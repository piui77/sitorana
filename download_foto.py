#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
download_foto.py — Scarica le foto delle specie per l'«Atlante delle Rane».

CHE COSA FA
-----------
1. Legge i nomi latini delle specie direttamente dai sorgenti del sito
   (src/lib/data.ts e src/lib/archive.ts), così l'elenco è sempre sincronizzato.
2. Per ogni specie individua una foto su Wikipedia/Wikimedia provando più
   strade: voce italiana, voce inglese, miniatura 900 px, immagine originale,
   elenco multimediale della pagina.
3. Scarica la foto e la SALVA NEL PROGETTO, nella cartella:

       public/images/specie/<nome-specie>.jpg

4. Scrive il file:

       public/images/specie/manifest.json

   che associa ogni nome latino al percorso locale della sua foto.
   Il sito legge questo manifest all'apertura: se la foto c'è mostra quella,
   se manca mostra la tavola illustrata SVG già incorporata nel codice.

PERCHÉ COSÌ
-----------
Le foto vengono salvate DENTRO il progetto: nessuna dipendenza da server
esterni a runtime. Una volta scaricate, restano tue anche se Wikipedia o il
CDN originale sparissero.

USO
---
    python3 download_foto.py               # scarica le foto mancanti
    python3 download_foto.py --forza       # riscarica tutto da capo
    python3 download_foto.py --test        # diagnosi di rete rapida
    python3 download_foto.py --dettaglio   # stampa gli errori completi

Se sei dietro un proxy aziendale che intercetta HTTPS e gli scaricamenti
falliscono per un errore SSL, prova:

    python3 download_foto.py --no-ssl-verify

Serve solo Python 3.10+ (nessuna libreria esterna: solo urllib).

DOPO
----
Ricostruisci il sito perché le foto finiscano nel bundle pubblicato:

    npm run build
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

HEADERS = {
    # Wikimedia richiede uno User-Agent identificativo: non rimuoverlo.
    "User-Agent": "AtlanteDelleRane/1.1 (script didattico che salva foto in locale; atlante-rane@example.org)",
    "Accept": "application/json",
}
HEADERS_IMG = {
    "User-Agent": HEADERS["User-Agent"],
    "Accept": "image/*,*/*;q=0.8",
    "Referer": "https://www.wikipedia.org/",
}

EXT_OK = {"jpg", "jpeg", "png", "gif", "webp"}
PAUSA = 0.25  # secondi tra una richiesta e l'altra (educazione verso i server)

DETTAGLIO = False  # --dettaglio: errori completi
SSL_CTX = None     # --no-ssl-verify: contesto SSL senza verifica


def apri(url: str, headers: dict, timeout: int = 25):
    req = urllib.request.Request(url, headers=headers)
    return urllib.request.urlopen(req, timeout=timeout, context=SSL_CTX)


def motivo_errore(e: Exception) -> str:
    """Riassume un'eccezione in poche parole per il resoconto."""
    if isinstance(e, urllib.error.HTTPError):
        return f"HTTP {e.code}"
    if isinstance(e, urllib.error.URLError):
        inner = getattr(e, "reason", None)
        return f"rete: {inner}".replace("\n", " ")[:80]
    if isinstance(e, TimeoutError) or "timed out" in str(e):
        return "timeout"
    return str(e).replace("\n", " ")[:80] or type(e).__name__


def slug(nome_latino: str) -> str:
    """«Pelophylax kl. esculentus» → «pelophylax-kl-esculentus»."""
    return re.sub(r"[^a-z0-9]+", "-", nome_latino.lower()).strip("-")


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


def get_json(url: str) -> dict | None:
    try:
        with apri(url, HEADERS) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        if DETTAGLIO:
            print(f"    · GET fallita {url[:90]}…\n      {motivo_errore(e)}")
        return None


def titoli_per(nome_latino: str) -> list[str]:
    titoli: list[str] = []
    pieno = nome_latino.strip().replace(" ", "_")
    binomio = "_".join(nome_latino.strip().split()[:2])
    for t in (pieno, binomio):
        if t not in titoli:
            titoli.append(t)
    return titoli


def ingrandisci(url_miniatura: str) -> str:
    """Le miniature REST arrivano a 320 px: chiediamo la versione a ~900 px."""
    return re.sub(r"/(\d+)px-", "/900px-", url_miniatura, count=1)


def candidati_da_summary(lang: str, titolo: str) -> list[str]:
    """URL di foto (dal più grande al più piccolo) letti dal riassunto della voce."""
    api = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(titolo)}"
    dati = get_json(api)
    if not dati:
        return []
    out: list[str] = []
    mini = (dati.get("thumbnail") or {}).get("source")
    orig = (dati.get("originalimage") or {}).get("source")
    if mini:
        out.append(ingrandisci(mini))
        if orig and orig != mini:
            out.append(orig)  # originale come seconda scelta (può essere enorme)
        else:
            out.append(mini)  # miniatura così com'è
    elif orig:
        out.append(orig)
    return out


def candidati_da_medialist(lang: str, titolo: str) -> list[str]:
    """Piega di riserva: il primo file immagine dell'elenco multimediale della pagina."""
    api = f"https://{lang}.wikipedia.org/api/rest_v1/page/media-list/{urllib.parse.quote(titolo)}"
    dati = get_json(api)
    if not dati:
        return []
    for voce in dati.get("items", []):
        if voce.get("type") != "image":
            continue
        srcset = voce.get("srcset") or []
        if not srcset:
            continue
        # la voce a risoluzione più alta dell'srcset
        migliore = max(srcset, key=lambda s: s.get("scale", 1)).get("src", "")
        if migliore:
            if migliore.startswith("//"):
                migliore = "https:" + migliore
            return [migliore]
    return []


def trova_url_foto(nome_latino: str) -> tuple[str | None, str]:
    """Restituisce (url, perché) provando tutte le strade in ordine di preferenza."""
    for lang in ("it", "en"):
        for titolo in titoli_per(nome_latino):
            for url in candidati_da_summary(lang, titolo):
                return url, f"voce {lang}:{titolo.replace('_', ' ')}"
    for lang in ("it", "en"):
        for titolo in titoli_per(nome_latino):
            for url in candidati_da_medialist(lang, titolo):
                return url, f"media-list {lang}:{titolo.replace('_', ' ')}"
            time.sleep(PAUSA / 2)
    return None, ""


def estensione(url: str) -> str | None:
    percorso = urllib.parse.urlparse(url).path
    # ignora eventuali suffissi tipo «.jpg/900px-…» già normalizzati dal regex
    base = percorso.rsplit("/", 1)[-1]
    ext = base.rsplit(".", 1)[-1].lower() if "." in base else ""
    # le miniature .svg vengono servite come .svg.png
    if ext == "svg":
        return "png"
    return ext if ext in EXT_OK else None


def scarica(url: str, destinazione: Path) -> tuple[bool, str]:
    """Scarica un file; restituisce (riuscito, motivo)."""
    try:
        with apri(url, HEADERS_IMG, timeout=45) as r:
            dati = r.read()
        if len(dati) < 400:
            return False, f"file troppo piccolo ({len(dati)} B)"
        destinazione.write_bytes(dati)
        return True, ""
    except Exception as e:
        return False, motivo_errore(e)


def diagnosi() -> int:
    """--test: tre controlli rapidi per capire dove si inceppa la rete."""
    print("Diagnosi di rete per l'Atlante delle Rane\n" + "-" * 46)
    prove = [
        ("API Wikipedia (JSON)", "https://it.wikipedia.org/api/rest_v1/page/summary/Rana_temporaria"),
        ("Miniatura Wikimedia", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Rana_temporaria.jpg/320px-Rana_temporaria.jpg"),
    ]
    ok = True
    for nome, url in prove:
        try:
            with apri(url, HEADERS, timeout=20) as r:
                n = len(r.read())
            print(f"  OK   {nome}: {n:,} byte da {url[:70]}…")
        except Exception as e:
            ok = False
            print(f"  FAIL {nome}\n       {motivo_errore(e)}")
    if not ok:
        print(
            "\nSuggerimenti:\n"
            "  · sei dietro un proxy? prova:  python3 download_foto.py --no-ssl-verify\n"
            "  · oppure imposta le variabili d'ambiente HTTPS_PROXY / HTTP_PROXY\n"
            "  · riprova più tardi: può essere un blocco momentaneo della rete"
        )
    else:
        print("\nLa rete funziona: lancia   python3 download_foto.py")
    return 0 if ok else 1


def main() -> int:
    global DETTAGLIO, SSL_CTX
    if "--test" in sys.argv:
        return diagnosi()
    DETTAGLIO = "--dettaglio" in sys.argv
    if "--no-ssl-verify" in sys.argv:
        SSL_CTX = ssl.create_default_context()
        SSL_CTX.check_hostname = False
        SSL_CTX.verify_mode = ssl.CERT_NONE
        print("Attenzione: verifica SSL disattivata (usa solo dietro proxy fidati).\n")
    forza = "--forza" in sys.argv

    nomi = raccogli_nomi()
    if not nomi:
        print("Nessun nome latino trovato nei sorgenti: verifica che src/lib/data.ts e src/lib/archive.ts esistano.")
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest: dict[str, str] = {}
    if MANIFEST.exists() and not forza:
        try:
            manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            manifest = {}

    scaricate = gia = fallite = 0
    totale = len(nomi)
    print(f"Specie da esaminare: {totale}")
    print(f"Cartella di destinazione: {OUT_DIR.relative_to(ROOT)}\n")

    for i, nome in enumerate(nomi, 1):
        s = slug(nome)
        esistenti = sorted(OUT_DIR.glob(f"{s}.*")) if not forza else []

        if esistenti:
            rel = f"/images/specie/{esistenti[0].name}"
            manifest[nome] = rel
            gia += 1
            print(f"[{i:3d}/{totale}] già presente  {nome} → {esistenti[0].name}")
            continue

        url, provenienza = trova_url_foto(nome)
        if not url:
            fallite += 1
            print(f"[{i:3d}/{totale}] nessuna foto  {nome}")
            time.sleep(PAUSA)
            continue

        ext = estensione(url)
        if not ext:
            fallite += 1
            print(f"[{i:3d}/{totale}] formato non adatto  {nome} ({url})")
            continue

        destinazione = OUT_DIR / f"{s}.{ext}"
        ok, perche = scarica(url, destinazione)

        # seconda chance: se la versione 900 px non esiste, riprova la miniatura base
        if not ok and "/900px-" in url:
            ok, perche2 = scarica(url.replace("/900px-", "/320px-"), destinazione)
            if ok:
                perche = ""

        if ok:
            manifest[nome] = f"/images/specie/{destinazione.name}"
            scaricate += 1
            kb = destinazione.stat().st_size / 1024
            print(f"[{i:3d}/{totale}] scaricata     {nome} → {destinazione.name} ({kb:.0f} kB, {provenienza})")
        else:
            fallite += 1
            print(f"[{i:3d}/{totale}] errore        {nome} — {perche}")
            if destinazione.exists():
                destinazione.unlink()
        time.sleep(PAUSA)

    MANIFEST.write_text(
        json.dumps(manifest, indent=2, sort_keys=True, ensure_ascii=False),
        encoding="utf-8",
    )

    print("\n" + "=" * 60)
    print(f"Scaricate ora : {scaricate}")
    print(f"Già presenti  : {gia}")
    print(f"Senza foto    : {fallite}  (il sito mostrerà la tavola illustrata)")
    print(f"Foto totali   : {len(manifest)}")
    print(f"Manifest      : {MANIFEST.relative_to(ROOT)}")
    print("=" * 60)
    if fallite:
        print("\nTroppi errori? Esegui la diagnosi:  python3 download_foto.py --test")
        print("Errori completi:                    python3 download_foto.py --dettaglio")
    print("\nOra ricostruisci il sito per includere le foto:")
    print("    npm run build\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
