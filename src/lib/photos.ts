/*
 * Manifest delle foto scaricate in locale.
 *
 * Lo script `download_foto.py` salva le foto reali in `public/images/specie/`
 * e scrive `public/images/specie/manifest.json`, una mappa
 * { "nome latino": "/images/specie/file.jpg" }.
 *
 * Questo modulo carica quel manifest una sola volta: se la foto di una specie
 * esiste sul disco del sito la si usa, altrimenti si ripiega sulla tavola
 * illustrata SVG generata nel codice (nessuna dipendenza esterna in ogni caso).
 */

type Manifest = Map<string, string>;

let cache: Manifest | null = null;
let pending: Promise<Manifest> | null = null;

function loadManifest(): Promise<Manifest> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch("images/specie/manifest.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((obj: Record<string, string>) => {
        cache = new Map(Object.entries(obj ?? {}));
        return cache;
      })
      .catch(() => {
        // script non ancora eseguito (o sito aperto da file://): solo tavole
        cache = new Map();
        return cache;
      });
  }
  return pending;
}

/** Percorso locale della foto di una specie, o null se non è stata scaricata. */
export function getPhoto(latin: string): Promise<string | null> {
  return loadManifest().then((m) => m.get(latin) ?? null);
}

/** true quando almeno una foto locale è disponibile (per le note nell'interfaccia). */
export function hasAnyPhoto(): Promise<boolean> {
  return loadManifest().then((m) => m.size > 0);
}
