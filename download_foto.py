#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
download_foto.py — Scarica le foto delle specie per l'«Atlante delle Rane».

CHE COSA FA
-----------
1. Legge i nomi latini delle specie direttamente dai sorgenti del sito
   (src/lib/data.ts e src/lib/archive.ts), così l'elenco è sempre sincronizzato.
2. Per ogni specie interroga l'API di Wikipedia (prima in italiano, poi in
   inglese) e individua la foto principale della voce.
3. Scarica la foto (ingrandita a ~900 px) e la SALVA NEL PROGETTO, nella
   cartella:

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
    python3 download_foto.py            # scarica le foto mancanti
    python3 download_foto.py --forza    # riscarica tutto da capo

Serve solo Python 3.8+ (nessuna libreria esterna). Usa solo urllib.

DOPO
----
Ricostruisci il sito perché le foto finiscano nel bundle pubblicato:

    npm run build

Le foto già presenti non vengono riscaricate: lo script è ri-eseguibile
e salta ciò che ha già salvato (usa --forza per ignorare la cache).
"""

import json
import re
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
    "User-Agent": "AtlanteDelleRane/1.0 (script didattico per scaricare foto di pubblico dominio; atlante-rane@example.org)",
    "Accept": "application/json",
}

EXT_OK = {"jpg", "jpeg", "png", "gif", "webp"}
PAUSA = 0.3  # secondi tra una richiesta e l'altra (educazione verso i server)


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
    # rimuove i duplicati preservando l'ordine
    visti, unici = set(), []
    for n in nomi:
        if n not in visti:
            visti.add(n)
            unici.append(n)
    return unici


def get_json(url: str, tentativi: int = 2):
    """GET JSON con un tentativo di ripetizione."""
    for t in range(tentativi):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.loads(r.read().decode("utf-8"))
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            if t == tentativi - 1:
                raise
            time.sleep(1.2)
    return None


def url_foto_wikipedia(nome_latino: str) -> str | None:
    """Trova l'URL di una foto adatta per la specie (prova it, poi en)."""
    titoli = []
    pieno = nome_latino.strip().replace(" ", "_")
    binomio = "_".join(nome_latino.strip().split()[:2])
    for t in (pieno, binomio):
        if t not in titoli:
            titoli.append(t)

    for lang in ("it", "en"):
        for titolo in titoli:
            api = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(titolo)}"
            try:
                dati = get_json(api)
            except Exception:
                continue
            if not dati or dati.get("type") in ("disambiguation", "standard") and dati.get("extract") is None:
                pass
            miniatura = (dati or {}).get("thumbnail", {}).get("source")
            if miniatura:
                # le miniature arrivano a 320 px: le portiamo a ~900 px
                return re.sub(r"/(\d+)px-", "/900px-", miniatura, count=1)
            originale = (dati or {}).get("originalimage", {}).get("source")
            if originale:
                return originale
            time.sleep(PAUSA)
    return None


def estensione(url: str) -> str | None:
    percorso = urllib.parse.urlparse(url).path
    ext = percorso.rsplit(".", 1)[-1].lower() if "." in percorso else ""
    return ext if ext in EXT_OK else None


def scarica(url: str, destinazione: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=40) as r:
            dati = r.read()
        if len(dati) < 2000:  # troppo piccola: probabilmente un errore in HTML
            return False
        destinazione.write_bytes(dati)
        return True
    except Exception:
        return False


def main() -> int:
    forza = "--forza" in sys.argv
    nomi = raccogli_nomi()
    if not nomi:
        print("Nessun nome latino trovato nei sorgenti: verifica che src/lib/data.ts e src/lib/archive.ts esistano.")
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # riparte dal manifest esistente (per non perdere i percorsi già registrati)
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
            # la foto è già sul disco: la registro nel manifest e passo oltre
            rel = f"/images/specie/{esistenti[0].name}"
            manifest[nome] = rel
            gia += 1
            print(f"[{i:3d}/{totale}] già presente  {nome} → {esistenti[0].name}")
            continue

        url = url_foto_wikipedia(nome)
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
        if scarica(url, destinazione):
            manifest[nome] = f"/images/specie/{destinazione.name}"
            scaricate += 1
            kb = destinazione.stat().st_size / 1024
            print(f"[{i:3d}/{totale}] scaricata     {nome} → {destinazione.name} ({kb:.0f} kB)")
        else:
            fallite += 1
            print(f"[{i:3d}/{totale}] errore        {nome}")
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
    print("\nOra ricostruisci il sito per includere le foto:")
    print("    npm run build\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
