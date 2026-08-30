/*
 * Manifest delle foto scaricate in locale.
 *
 * Lo script `download_foto.py` salva le foto reali in `public/images/specie/`
 * e scrive `public/images/specie/manifest.json`, una mappa
 * { "nome latino": { "src": "/images/specie/file.jpg", "via": "Wikipedia|iNaturalist" } }
 * (accetta anche la forma semplice "nome latino": "percorso").
 *
 * Questo modulo carica quel manifest una sola volta: se la foto di una specie
 * esiste sul disco del sito la si usa, altrimenti si ripiega sulla tavola
 * illustrata SVG generata nel codice (nessuna dipendenza esterna in ogni caso).
 */

export interface FotoInfo {
  src: string;
  via: string;
}

type Manifest = Map<string, FotoInfo>;

let cache: Manifest | null = null;
let pending: Promise<Manifest> | null = null;

function normalizza(obj: Record<string, unknown>): Manifest {
  const m: Manifest = new Map();
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (typeof v === "string") m.set(k, { src: v, via: "locale" });
    else if (v && typeof v === "object" && typeof (v as FotoInfo).src === "string")
      m.set(k, { src: (v as FotoInfo).src, via: (v as FotoInfo).via || "locale" });
  }
  return m;
}

function loadManifest(): Promise<Manifest> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetch("images/specie/manifest.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((obj: Record<string, unknown>) => {
        cache = normalizza(obj);
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
  return loadManifest().then((m) => m.get(latin)?.src ?? null);
}

/** true quando almeno una foto locale è disponibile (per le note nell'interfaccia). */
export function hasAnyPhoto(): Promise<boolean> {
  return loadManifest().then((m) => m.size > 0);
}
