#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
download_foto.py — Scarica le foto delle specie per l'«Atlante delle Rane».

CHE COSA FA
-----------
1. Legge i nomi latini delle specie dai sorgenti del sito
   (src/lib/data.ts e src/lib/archive.ts): l'elenco è SEMPRE sincronizzato,
   nuove specie comprese. Se aggiungi una specie al sito, basta rilanciare
   lo script: scaricherà solo le foto che mancano ancora.
2. Per ogni specie cerca la foto su DUE FONTI INDIPENDENTI, in ordine:

       a) Wikipedia (voce italiana, poi inglese) — foto quasi sempre CC-BY-SA
       b) iNaturalist (api.inaturalist.org)    — foto dei naturalisti, licenze CC

   Due fonti perché usano server diversi: se la tua rete blocca
   upload.wikimedia.org (succede spesso su reti scolastiche/aziendali:
   errore «HTTP 400» su tutte le foto), iNaturalist di solito passa.

3. Salva le foto DENTRO il progetto, in:

       public/images/specie/<nome-specie>.jpg

4. Scrive:

       public/images/specie/manifest.json      (mappa specie → percorso locale + fonte)
       public/images/specie/attribuzioni.txt   (provenienza di ogni foto, per i crediti)

   Il sito legge il manifest all'apertura: se la foto c'è mostra quella,
   se manca mostra la tavola illustrata SVG già incorporata nel codice.

PERCHÉ COSÌ
-----------
Le foto vivono nel progetto: a runtime nessuna richiesta a server esterni.
Una volta scaricate restano tue anche se Wikipedia o iNaturalist sparissero.

USO
---
    python3 download_foto.py --test       # diagnosi rapida della rete (fallo prima!)
    python3 download_foto.py              # scarica le foto mancanti (anche le nuove specie!)
    python3 download_foto.py --solo=axolotl    # prova una singola specie (utile per verificare)
    python3 download_foto.py --forza      # riscarica tutto da capo
    python3 download_foto.py --no-ssl-verify   # se la rete intercetta HTTPS (errori SSL)

Serve solo Python 3.8+ (nessuna libreria esterna).

DOPO
----
    npm run build     # include le foto nel sito pubblicato
"""

import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA_TS = ROOT / "src" / "lib" / "data.ts"
ARCHIVE_TS = ROOT / "src" / "lib" / "archive.ts"
OUT_DIR = ROOT / "public" / "images" / "specie"
MANIFEST = OUT_DIR / "manifest.json"
CREDITI = OUT_DIR / "attribuzioni.txt"

# Wikimedia esige uno User-Agent identificativo: non rimuoverlo.
UA = "AtlanteDelleRane/1.1 (script didattico senza scopo di lucro; atlante-rane@example.org)"
HEADERS_API = {"User-Agent": UA, "Accept": "application/json"}
HEADERS_IMG = {"User-Agent": UA, "Accept": "image/*,*/*;q=0.8"}

EXT_OK = {"jpg", "jpeg", "png", "gif", "webp"}
PAUSA = 0.35  # cortesia tra una richiesta e l'altra
LIMITE_KB = 900  # oltre questa taglia si prova il formato successivo

CTX: ssl.SSLContext | None = None


def slug(nome_latino: str) -> str:
    """«Pelophylax kl. esculentus» → «pelophylax-kl-esculentus»."""
    return re.sub(r"[^a-z0-9]+", "-", nome_latino.lower()).strip("-")


def binomio(nome_latino: str) -> str:
    """«Dendrobates tinctorius «azureus»» → «Dendrobates tinctorius»."""
    return " ".join(nome_latino.strip().split()[:2])


def raccogli_nomi() -> list[str]:
    """Estrae i nomi latini dai sorgenti TypeScript del sito."""
    nomi: list[str] = []
    if DATA_TS.exists():
        testo = DATA_TS.read_text(encoding="utf-8")
        nomi += re.findall(r'latin:\s*"([^"]+)"', testo)
    if ARCHIVE_TS.exists():
        testo = ARCHIVE_TS.read_text(encoding="utf-8")
        nomi += re.findall(r'^\s*\[\s*"([^"]+)"\s*,', testo, re.M)
    visti, unici = set(), []
    for n in nomi:
        if n not in visti:
            visti.add(n)
            unici.append(n)
    return unici


def get_json(url: str, tentativi: int = 2):
    """GET JSON con un tentativo di ripetizione. Lancia eccezione se fallisce."""
    for t in range(tentativi):
        try:
            req = urllib.request.Request(url, headers=HEADERS_API)
            with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception:
            if t == tentativi - 1:
                raise
            time.sleep(1.2)
    return None


def motivo_errore(e: Exception) -> str:
    if isinstance(e, urllib.error.HTTPError):
        return f"HTTP {e.code}"
    if isinstance(e, urllib.error.URLError):
        r = str(e.reason)
        return f"rete: {r}" if len(r) < 70 else "rete irraggiungibile"
    if isinstance(e, TimeoutError) or "timed out" in str(e):
        return "timeout"
    if isinstance(e, ssl.SSLError) or "SSL" in str(e) or "CERTIFICATE" in str(e):
        return "SSL/certificato"
    if isinstance(e, ValueError):
        return "URL rifiutato dal server"
    s = str(e)
    return s[:70] if s else type(e).__name__


# ---------------------------------------------------------------- fonti: Wikipedia

def scala_miniatura(u: str, px: int) -> str:
    return re.sub(r"/(\d+)px-", f"/{px}px-", u, count=1)


def candidati_wikipedia(nome_latino: str):
    """(url, licenza indicativa) dalla voce Wikipedia: it, poi en."""
    titoli, visti = [], set()
    for t in (nome_latino.strip().replace(" ", "_"), binomio(nome_latino).replace(" ", "_")):
        if t not in visti:
            visti.add(t)
            titoli.append(t)

    for lang in ("it", "en"):
        for titolo in titoli:
            api = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(titolo)}"
            try:
                dati = get_json(api)
            except Exception:
                continue
            if not isinstance(dati, dict):
                continue
            mini = (dati.get("thumbnail") or {}).get("source")
            orig = (dati.get("originalimage") or {}).get("source")
            if mini or orig:
                c = []
                if mini:
                    c.append((scala_miniatura(mini, 900), f"Wikipedia ({lang})"))
                if orig:
                    c.append((orig, f"Wikipedia ({lang})"))
                if mini:
                    c.append((mini, f"Wikipedia ({lang})"))
                return c
            time.sleep(PAUSA)
    return []


# ---------------------------------------------------------------- fonti: iNaturalist

def candidati_inaturalist(nome_latino: str):
    """(url, licenza) da iNaturalist: foto predefinita del taxon.
    Due tentativi: prima solo taxa «attivi», poi senza filtro (utile per le
    specie più particolari o con tassonomia controversa)."""
    bn = binomio(nome_latino)
    risultati = []
    for params in (
        {"q": bn, "per_page": 5, "is_active": "true"},
        {"q": bn, "per_page": 5},
    ):
        try:
            dati = get_json(f"https://api.inaturalist.org/v1/taxa?{urllib.parse.urlencode(params)}")
        except Exception:
            continue
        risultati = (dati or {}).get("results") or []
        if risultati:
            break
    if not risultati:
        return []

    # preferisci il taxon il cui nome combacia col binomio cercato
    scelto = risultati[0]
    bn = binomio(nome_latino).lower()
    for t in risultati:
        if (t.get("name") or "").lower() == bn:
            scelto = t
            break

    foto = scelto.get("default_photo") or {}
    base = foto.get("url") or ""
    if not base or "/square" not in base:
        return []
    licenza = foto.get("attribution") or "iNaturalist (vedi licenza sulla pagina della specie)"
    return [
        (base.replace("/square", "/large"), "iNaturalist"),   # ~1024 px
        (base.replace("/square", "/medium"), "iNaturalist"),  # ~500 px
        (base.replace("/square", "/original"), "iNaturalist"),
    ]


# ---------------------------------------------------------------- download

def estensione(url: str) -> str | None:
    percorso = urllib.parse.urlparse(url).path
    ext = percorso.rsplit(".", 1)[-1].lower() if "." in percorso else ""
    return ext if ext in EXT_OK else None


def scarica(url: str, destinazione: Path) -> tuple[bool, str]:
    """Scarica; restituisce (riuscito, motivo)."""
    try:
        req = urllib.request.Request(url, headers=HEADERS_IMG)
        with urllib.request.urlopen(req, timeout=40, context=CTX) as r:
            dati = r.read()
        if len(dati) < 2000:  # troppo piccola: quasi certo una pagina di errore
            return False, "risposta troppo piccola"
        destinazione.write_bytes(dati)
        return True, ""
    except Exception as e:
        return False, motivo_errore(e)


def prova_specie(nome: str, destinazione_base: Path):
    """Prova tutte le fonti per una specie; restituisce (percorso|None, via, motivo)."""
    fonti = (("Wikipedia", candidati_wikipedia), ("iNaturalist", candidati_inaturalist))
    ultimo = "nessuna foto trovata"
    for nome_fonte, generatore in fonti:
        try:
            candidati = generatore(nome)
        except Exception as e:
            ultimo = f"{nome_fonte}: {motivo_errore(e)}"
            continue
        for url, _ in candidati:
            ext = estensione(url)
            if not ext:
                ultimo = f"{nome_fonte}: formato non adatto"
                continue
            destinazione = destinazione_base.with_suffix(f".{ext}")
            ok, perche = scarica(url, destinazione)
            if ok:
                if destinazione.stat().st_size / 1024 > LIMITE_KB and "original" in url:
                    destinazione.unlink(missing_ok=True)  # troppo pesante, prova la successiva
                    ultimo = f"{nome_fonte}: file oltre {LIMITE_KB} kB"
                    continue
                return destinazione, nome_fonte, ""
            ultimo = f"{nome_fonte}: {perche}"
            time.sleep(PAUSA / 2)
    return None, "", ultimo


# ---------------------------------------------------------------- diagnostica

def test_rete() -> int:
    print("Diagnosi della connessione (3 prove)...\n")
    prove = [
        ("API Wikipedia (it)", "https://it.wikipedia.org/api/rest_v1/page/summary/Rana_temporaria"),
        ("Server immagini Wikimedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Bufo_bufo_2.jpg/320px-Bufo_bufo_2.jpg"),
        ("API iNaturalist", "https://api.inaturalist.org/v1/taxa?q=Hyla%20intermedia&per_page=1"),
    ]
    esiti = []
    for label, url in prove:
        try:
            req = urllib.request.Request(url, headers=HEADERS_API)
            with urllib.request.urlopen(req, timeout=20, context=CTX) as r:
                dati = r.read()
            print(f"  [ OK ] {label} ({len(dati)} byte)")
            esiti.append(True)
        except Exception as e:
            print(f"  [FAIL] {label} — {motivo_errore(e)}")
            esiti.append(False)

    print()
    if all(esiti):
        print("Tutto raggiungibile: esegui «python3 download_foto.py».")
        return 0
    if esiti[0] and not esiti[1]:
        print("È il caso tipico: la tua rete lascia passare wikipedia.org ma BLOCCA")
        print("upload.wikimedia.org (dove vivono le foto). Niente paura: lo script")
        print("passa da solo su iNaturalist, che usa server diversi.")
        if not esiti[2]:
            print("Attenzione: anche iNaturalist non risponde — prova un hotspot del")
            print("telefono o «--no-ssl-verify» se vedi errori SSL.")
            return 1
        print("Esegui «python3 download_foto.py»: userà iNaturalist come fonte.")
        return 0
    print("Suggerimenti:")
    print("  · errori SSL/certificato  → riprova con --no-ssl-verify")
    print("  · timeout/rete            → sei dietro un proxy? Imposta HTTPS_PROXY")
    print("  · prova con un hotspot del telefono per escludere il firewall")
    return 1


# ---------------------------------------------------------------- main

def main() -> int:
    if "--test" in sys.argv:
        return test_rete()

    global CTX
    if "--no-ssl-verify" in sys.argv:
        CTX = ssl.create_default_context()
        CTX.check_hostname = False
        CTX.verify_mode = ssl.CERT_NONE
        print("! Verifica dei certificati SSL disattivata (solo per reti con proxy ispettivo)\n")

    forza = "--forza" in sys.argv

    # --solo=<testo>: limita il giro a una specie (o a quelle che contengono il testo)
    solo = next((a.split("=", 1)[1].strip().lower() for a in sys.argv[1:] if a.startswith("--solo=")), None)

    nomi = raccogli_nomi()
    if not nomi:
        print("Nessun nome latino trovato nei sorgenti: verifica src/lib/data.ts e src/lib/archive.ts.")
        return 1

    if solo:
        nomi = [n for n in nomi if solo in n.lower()]
        if not nomi:
            print(f"Nessuna specie contiene «{solo}» nell'elenco del sito.")
            return 1
        print(f"Filtro attivo: solo specie con «{solo}» nel nome ({len(nomi)})\n")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest: dict[str, dict] = {}
    if MANIFEST.exists() and not forza:
        try:
            grezzo = json.loads(MANIFEST.read_text(encoding="utf-8"))
            for k, v in grezzo.items():
                if isinstance(v, str):
                    manifest[k] = {"src": v, "via": "locale"}
                elif isinstance(v, dict) and "src" in v:
                    manifest[k] = v
        except json.JSONDecodeError:
            manifest = {}

    scaricate = gia = fallite = 0
    totale = len(nomi)
    print(f"Specie da esaminare: {totale}")
    print(f"Cartella di destinazione: {OUT_DIR.relative_to(ROOT)}")
    print(f"Fonti: Wikipedia (it, en) → iNaturalist\n")

    for i, nome in enumerate(nomi, 1):
        s = slug(nome)
        esistenti = sorted(OUT_DIR.glob(f"{s}.*")) if not forza else []

        if esistenti:
            manifest[nome] = manifest.get(nome) or {"src": f"/images/specie/{esistenti[0].name}", "via": "locale"}
            gia += 1
            print(f"[{i:3d}/{totale}] già presente  {nome} → {esistenti[0].name}")
            continue

        destinazione, via, perche = prova_specie(nome, OUT_DIR / s)
        if destinazione:
            kb = destinazione.stat().st_size / 1024
            manifest[nome] = {"src": f"/images/specie/{destinazione.name}", "via": via}
            scaricate += 1
            print(f"[{i:3d}/{totale}] scaricata     {nome} → {destinazione.name} ({kb:.0f} kB · via {via})")
        else:
            fallite += 1
            print(f"[{i:3d}/{totale}] errore        {nome} — {perche}")
        time.sleep(PAUSA)

    MANIFEST.write_text(
        json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False),
        encoding="utf-8",
    )
    righe = [f"{nome}\t{info.get('via', '?')}\t{info.get('src', '')}" for nome, info in sorted(manifest.items())]
    CREDITI.write_text(
        "nome latino\tfonte\tpercorso locale\n" + "\n".join(righe) + "\n\n"
        "Le foto restano di proprietà dei rispettivi autori (licenze CC-BY-SA per\n"
        "Wikipedia, licenze CC varie per iNaturalist): va bene per uso personale e\n"
        "didattico; per la pubblicazione cita la fonte.\n",
        encoding="utf-8",
    )

    print("\n" + "=" * 62)
    print(f"Scaricate ora : {scaricate}")
    print(f"Già presenti  : {gia}")
    print(f"Senza foto    : {fallite}  (il sito mostrerà la tavola illustrata)")
    print(f"Foto totali   : {len(manifest)}")
    print(f"Manifest      : {MANIFEST.relative_to(ROOT)}")
    print(f"Attribuzioni  : {CREDITI.relative_to(ROOT)}")
    print("=" * 62)
    print("\nOra ricostruisci il sito per includere le foto:")
    print("    npm run build\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
