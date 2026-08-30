import { useEffect, useMemo, useRef, useState } from "react";
import { ARCHIVE, FAMILIES, REGIONS, STATUS_META, STATUS_ORDER, type ArchiveSpecies, type IUCN } from "../lib/archive";
import { SPECIES } from "../lib/data";
import { Reveal, SectionHead } from "./ui";

/* ---------- utilità deterministiche ---------- */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, v));
  const r = ch((n >> 16) + amt), g = ch(((n >> 8) & 0xff) + amt), b = ch((n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}
function lighten(hex: string, amt: number): string {
  return shade(hex, amt);
}

/* ---------- foto reali da Wikipedia (salvate in cache locale) ---------- */
const photoCache = new Map<string, string | null>();
const inFlight = new Map<string, Promise<string | null>>();
const LS_KEY = "atlante-rane-foto-v1";

try {
  const saved = localStorage.getItem(LS_KEY);
  if (saved) {
    const obj = JSON.parse(saved) as Record<string, string | null>;
    for (const [k, v] of Object.entries(obj)) photoCache.set(k, v);
  }
} catch {
  /* cache non disponibile: si riparte da zero */
}

function persistCache() {
  try {
    const obj: Record<string, string | null> = {};
    photoCache.forEach((v, k) => {
      obj[k] = v;
    });
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  } catch {
    /* noop */
  }
}

/* al massimo 4 richieste contemporanee, per non intasare la rete */
let activeReqs = 0;
const reqQueue: (() => void)[] = [];
function withLimit<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      activeReqs++;
      fn().then(resolve, reject).finally(() => {
        activeReqs--;
        const next = reqQueue.shift();
        if (next) next();
      });
    };
    if (activeReqs < 4) run();
    else reqQueue.push(run);
  });
}

async function fetchWikiPhoto(latin: string): Promise<string | null> {
  const full = latin.trim().replace(/\s+/g, "_");
  const binomial = latin.trim().split(/\s+/).slice(0, 2).join("_");
  const titles = [full, binomial].filter((t, i, a) => a.indexOf(t) === i);
  for (const lang of ["it", "en"]) {
    for (const title of titles) {
      try {
        const r = await fetch(
          `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
        );
        if (!r.ok) continue;
        const d = (await r.json()) as { thumbnail?: { source?: string } };
        if (d.thumbnail?.source) return d.thumbnail.source;
      } catch {
        /* prova il candidato successivo */
      }
    }
  }
  return null;
}

/** Carica (una sola volta) la foto di una specie; riusa la promise se già in volo. */
function loadPhoto(latin: string): Promise<string | null> {
  let p = inFlight.get(latin);
  if (!p) {
    p = withLimit(() => fetchWikiPhoto(latin)).finally(() => inFlight.delete(latin));
    inFlight.set(latin, p);
  }
  return p;
}

/* ---------- identikit procedurale ---------- */
const SHAPES = {
  round: { rx: 56, ry: 44, hx: 132, hy: 68, hr: 27, ex1: -11, ey1: -19, ex2: 9, ey2: -15, er: 9.5 },
  wide: { rx: 62, ry: 41, hx: 136, hy: 70, hr: 30, ex1: -12, ey1: -21, ex2: 10, ey2: -17, er: 10.5 },
  slim: { rx: 66, ry: 28, hx: 140, hy: 76, hr: 21, ex1: -9, ey1: -15, ex2: 8, ey2: -12, er: 7.5 },
} as const;

function Identikit({ sp }: { sp: ArchiveSpecies }) {
  const seed = hashStr(sp.latin);
  const rnd = mulberry32(seed);
  const S = SHAPES[sp.shape];
  const dark = shade(sp.c1, -52);
  const light = lighten(sp.c1, 34);
  const uid = `idk-${sp.latin.replace(/[^a-z]/gi, "")}`;

  const spots =
    sp.pattern === "spotted"
      ? Array.from({ length: 9 }, () => ({
          x: 60 + rnd() * 110,
          y: 78 + rnd() * 40,
          r: 2.6 + rnd() * 4.6,
        }))
      : [];
  const mottles =
    sp.pattern === "mottled"
      ? Array.from({ length: 5 }, () => ({
          x: 55 + rnd() * 120,
          y: 72 + rnd() * 44,
          r: 11 + rnd() * 11,
        }))
      : [];
  const stripes =
    sp.pattern === "striped"
      ? Array.from({ length: 4 }, (_, i) => 66 + i * 22 + rnd() * 8)
      : [];

  return (
    <svg viewBox="0 0 200 150" className="w-full h-full idk-frog" aria-hidden>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={sp.c1} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <ellipse cx="100" cy="96" rx={S.rx} ry={S.ry} />
          <circle cx={S.hx} cy={S.hy} r={S.hr} />
        </clipPath>
      </defs>

      {/* ombra */}
      <ellipse cx="100" cy="134" rx="64" ry="7" fill="rgba(0,0,0,0.4)" />

      {/* zampa posteriore */}
      <ellipse cx="52" cy="104" rx="27" ry="19" transform="rotate(-18 52 104)" fill={dark} />
      <path d="M66,122 L46,127 M66,122 L52,132 M66,122 L62,133" stroke={dark} strokeWidth="4.4" strokeLinecap="round" />

      {/* corpo + testa */}
      <g clipPath={`url(#${uid}-clip)`}>
        <ellipse cx="100" cy="96" rx={S.rx} ry={S.ry} fill={`url(#${uid})`} />
        <circle cx={S.hx} cy={S.hy} r={S.hr} fill={sp.c1} />
        {/* ventre */}
        <ellipse cx="106" cy="112" rx={S.rx * 0.78} ry={S.ry * 0.52} fill={light} opacity="0.32" />
        {spots.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={dark} opacity="0.5" />
        ))}
        {mottles.map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={i % 2 ? sp.c2 : dark} opacity="0.3" />
        ))}
        {stripes.map((x, i) => (
          <path
            key={i}
            d={`M${x},58 Q${x - 8},96 ${x + 4},136`}
            stroke={sp.c2}
            strokeWidth={5.5 + (i % 2) * 2}
            fill="none"
            opacity="0.55"
            strokeLinecap="round"
          />
        ))}
        {sp.pattern === "plain" && (
          <path d={`M${S.hx - S.hr},64 Q100,60 52,86`} stroke={light} strokeWidth="3.4" fill="none" opacity="0.5" strokeLinecap="round" />
        )}
      </g>

      {/* contorno */}
      <ellipse cx="100" cy="96" rx={S.rx} ry={S.ry} fill="none" stroke={dark} strokeWidth="2.4" />
      <circle cx={S.hx} cy={S.hy} r={S.hr} fill="none" stroke={dark} strokeWidth="2.4" />

      {/* zampa anteriore */}
      <path d={`M${S.hx - 8},118 Q${S.hx},126 ${S.hx + 12},128`} stroke={dark} strokeWidth="5" fill="none" strokeLinecap="round" />

      {/* occhi */}
      <g className="anim-blink" style={{ animationDelay: `${(seed % 7) * 0.7}s` }}>
        <circle cx={S.hx + S.ex1} cy={S.hy + S.ey1} r={S.er * 0.92} fill={sp.c2} stroke={dark} strokeWidth="2" />
        <circle cx={S.hx + S.ex2} cy={S.hy + S.ey2} r={S.er} fill={sp.c2} stroke={dark} strokeWidth="2" />
        <ellipse cx={S.hx + S.ex1} cy={S.hy + S.ey1} rx={S.er * 0.24} ry={S.er * 0.55} fill="#10140c" />
        <ellipse cx={S.hx + S.ex2} cy={S.hy + S.ey2} rx={S.er * 0.26} ry={S.er * 0.6} fill="#10140c" />
        <circle cx={S.hx + S.ex2 + 3} cy={S.hy + S.ey2 - 3} r={S.er * 0.2} fill="#f4f7ea" opacity="0.9" />
      </g>

      {/* narici e bocca */}
      <circle cx={S.hx + S.hr * 0.45} cy={S.hy - 2} r="1.7" fill={dark} />
      <circle cx={S.hx + S.hr * 0.72} cy={S.hy + 2} r="1.7" fill={dark} />
      <path
        d={`M${S.hx + S.hr * 0.85},${S.hy + 10} Q${S.hx + S.hr * 0.3},${S.hy + 16} ${S.hx - S.hr * 0.3},${S.hy + 15}`}
        stroke={dark}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- cornice con foto + identikit di riserva ---------- */
function PhotoFrame({ sp, statusColor, statusLabel }: { sp: ArchiveSpecies; statusColor: string; statusLabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<{ src: string | null; status: "idle" | "loading" | "ok" | "fail" }>(() => {
    const cached = photoCache.get(sp.latin);
    return cached !== undefined
      ? { src: cached, status: cached ? "ok" : "fail" }
      : { src: null, status: "idle" };
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (photoCache.get(sp.latin) !== undefined) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setState((s) => (s.status === "idle" ? { ...s, status: "loading" } : s));
        loadPhoto(sp.latin).then((src) => {
          photoCache.set(sp.latin, src);
          persistCache();
          setState(src ? { src, status: "ok" } : { src: null, status: "fail" });
        });
      },
      { rootMargin: "480px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sp.latin]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] overflow-hidden"
      style={{ background: `linear-gradient(165deg, ${sp.c1}26 0%, rgba(15,29,20,0) 65%)` }}
    >
      <span
        className="absolute top-2 right-2 z-10 font-mono text-[10px] font-bold tracking-[0.1em] px-1.5 py-0.5 text-ink"
        style={{ background: statusColor }}
        title={`${statusLabel} (IUCN)`}
      >
        {sp.status}
      </span>

      {/* identikit: segnaposto durante il caricamento, ritratto definitivo se la foto manca */}
      <div
        className={`absolute inset-0 p-1 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        aria-hidden={loaded}
      >
        <Identikit sp={sp} />
      </div>

      {state.src && (
        <img
          src={state.src}
          alt={`Foto di ${sp.name} (${sp.latin})`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            photoCache.set(sp.latin, null);
            setState({ src: null, status: "fail" });
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {state.status === "loading" && !loaded && <div className="absolute inset-0 shimmer" aria-hidden />}

      {loaded ? (
        <span className="absolute bottom-1.5 left-1.5 z-10 font-mono text-[8.5px] tracking-[0.14em] uppercase bg-ink/75 text-foam/60 px-1.5 py-0.5">
          foto · Wikipedia
        </span>
      ) : state.status === "fail" ? (
        <span className="absolute bottom-1.5 left-1.5 z-10 font-mono text-[8.5px] tracking-[0.14em] uppercase bg-ink/75 text-lime/70 px-1.5 py-0.5">
          identikit
        </span>
      ) : null}
    </div>
  );
}

/* ---------- filtri ---------- */
type SortKey = "nome" | "taglia" | "rischio";

export default function Archive() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("Tutte");
  const [status, setStatus] = useState<"Tutte" | IUCN>("Tutte");
  const [sort, setSort] = useState<SortKey>("nome");

  const total = SPECIES.length + ARCHIVE.length;

  const statusCount = useMemo(() => {
    const m = new Map<IUCN, number>();
    for (const s of ARCHIVE) m.set(s.status, (m.get(s.status) ?? 0) + 1);
    return m;
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = ARCHIVE.filter(
      (s) =>
        (region === "Tutte" || s.region === region) &&
        (status === "Tutte" || s.status === status) &&
        (needle === "" ||
          s.name.toLowerCase().includes(needle) ||
          s.latin.toLowerCase().includes(needle) ||
          s.family.toLowerCase().includes(needle) ||
          s.note.toLowerCase().includes(needle))
    );
    const riskRank: Record<IUCN, number> = { EX: 6, CR: 5, EN: 4, VU: 3, NT: 2, LC: 1 };
    return [...list].sort((a, b) =>
      sort === "nome"
        ? a.name.localeCompare(b.name, "it")
        : sort === "taglia"
          ? b.sizeCm - a.sizeCm
          : riskRank[b.status] - riskRank[a.status]
    );
  }, [q, region, status, sort]);

  const hasFilters = q !== "" || region !== "Tutte" || status !== "Tutte";

  return (
    <section id="archivio" className="relative scroll-mt-24 py-24 md:py-36 bg-pond/70 border-y border-leaf/40 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_0%,rgba(127,200,200,0.06)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="05"
          kicker="L'archivio"
          title="Cento rane, un atlante"
          sub={`Dieci schede illustrate più ${ARCHIVE.length} ritratti fotografici recuperati dalle voci di Wikipedia e salvati nella cache del diario. Dove la foto manca, resta l'identikit disegnato sui colori reali della livrea. Filtra per regione e stato di conservazione, ordina per taglia o rischio.`}
        />

        {/* barra strumenti */}
        <Reveal>
          <div className="flex flex-col gap-5 border border-leaf/60 bg-deep/70 p-5 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <label className="relative flex-1 block">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lime" aria-hidden>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <circle cx="10.5" cy="10.5" r="7" />
                    <path d="M16 16l5.5 5.5" />
                  </svg>
                </span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cerca per nome, specie o famiglia… es. «rana», «Dendrobates»"
                  className="w-full bg-ink/70 border border-leaf/60 focus:border-lime/70 outline-none pl-11 pr-4 py-3 text-sm text-foam placeholder:text-foam/30 transition-colors"
                />
              </label>

              <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] uppercase">
                <span className="text-foam/35">Ordina</span>
                <div className="flex border border-leaf/60">
                  {([["nome", "A→Z"], ["taglia", "Taglia"], ["rischio", "Rischio"]] as [SortKey, string][]).map(([k, label]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setSort(k)}
                      className={`px-3.5 py-2.5 transition-colors ${sort === k ? "bg-lime text-ink" : "text-foam/55 hover:text-lime"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foam/35 mr-1">Regione</span>
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1.5 text-[12px] border transition-all ${
                    region === r
                      ? "border-lime bg-lime/15 text-lime"
                      : "border-leaf/60 text-foam/55 hover:border-lime/50 hover:text-foam/85"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foam/35 mr-1">Stato IUCN</span>
              <button
                type="button"
                onClick={() => setStatus("Tutte")}
                className={`px-3 py-1.5 text-[12px] border transition-all ${
                  status === "Tutte"
                    ? "border-lime bg-lime/15 text-lime"
                    : "border-leaf/60 text-foam/55 hover:border-lime/50 hover:text-foam/85"
                }`}
              >
                Tutte
              </button>
              {STATUS_ORDER.map((s) => {
                const meta = STATUS_META[s];
                const count = statusCount.get(s) ?? 0;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(status === s ? "Tutte" : s)}
                    title={meta.label}
                    className={`px-3 py-1.5 text-[12px] border transition-all flex items-center gap-1.5 ${
                      status === s ? "bg-lime/15 text-foam" : "text-foam/55 hover:text-foam/85"
                    }`}
                    style={{ borderColor: status === s ? meta.color : "rgba(74,107,58,0.6)" }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                    {s}
                    <span className="text-foam/35 font-mono text-[10px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* contatore vivo */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs text-foam/50" aria-live="polite">
            <span className="text-lime font-semibold text-sm">{filtered.length}</span> / {ARCHIVE.length} specie in archivio ·{" "}
            <span className="text-foam/70">{total} nell'atlante</span>
            {FAMILIES.length > 0 && <> · {FAMILIES.length} famiglie</>}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => { setQ(""); setRegion("Tutte"); setStatus("Tutte"); }}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-rust border border-rust/50 px-3 py-1.5 hover:bg-rust hover:text-ink transition-colors"
            >
              × azzera filtri
            </button>
          )}
        </div>

        {/* griglia */}
        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {filtered.map((sp) => {
              const meta = STATUS_META[sp.status];
              return (
                <article
                  key={sp.latin}
                  className="idk-card group relative border border-leaf/50 bg-deep/60 flex flex-col overflow-hidden transition-all duration-300 hover:border-lime/50 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-18px_rgba(0,0,0,0.8)]"
                >
                  <PhotoFrame sp={sp} statusColor={meta.color} statusLabel={meta.label} />
                  <div className="p-3.5 md:p-4 flex flex-col gap-1.5 flex-1">
                    <h3 className="font-display italic font-bold text-[1.02rem] leading-tight text-foam group-hover:text-lime transition-colors">
                      {sp.name}
                    </h3>
                    <p className="font-mono italic text-[10px] text-lime/80 leading-snug">{sp.latin}</p>
                    <p className="text-[11.5px] leading-snug text-foam/55 mt-1">{sp.note}</p>
                    <div className="mt-auto pt-2.5 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.08em] uppercase text-foam/45 border-t border-leaf/40">
                      <span className="text-foam/60">{sp.family}</span>
                      <span aria-hidden>·</span>
                      <span>{sp.region}</span>
                      <span aria-hidden>·</span>
                      <span className="text-water/80">{sp.sizeCm < 1 ? "9 mm" : `${sp.sizeCm} cm`}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-leaf/70 py-20 text-center">
            <svg width="88" height="60" viewBox="0 0 88 60" className="mx-auto opacity-70" aria-hidden>
              <ellipse cx="44" cy="40" rx="26" ry="14" fill="none" stroke="#4a6b3a" strokeWidth="2.4" />
              <circle cx="35" cy="24" r="8" fill="none" stroke="#4a6b3a" strokeWidth="2.4" />
              <circle cx="53" cy="24" r="8" fill="none" stroke="#4a6b3a" strokeWidth="2.4" />
              <line x1="32" y1="22" x2="38" y2="26" stroke="#4a6b3a" strokeWidth="2" strokeLinecap="round" />
              <line x1="38" y1="22" x2="32" y2="26" stroke="#4a6b3a" strokeWidth="2" strokeLinecap="round" />
              <line x1="50" y1="22" x2="56" y2="26" stroke="#4a6b3a" strokeWidth="2" strokeLinecap="round" />
              <line x1="56" y1="22" x2="50" y2="26" stroke="#4a6b3a" strokeWidth="2" strokeLinecap="round" />
              <path d="M36,44 Q44,40 52,44" fill="none" stroke="#4a6b3a" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <p className="mt-5 font-display italic font-bold text-2xl text-foam/70">Nessuna rana in questo punto dello stagno</p>
            <p className="mt-2 text-sm text-foam/45">
              Prova con «rana», «rospo», una famiglia come «Hylidae» — oppure azzera i filtri.
            </p>
          </div>
        )}

        <Reveal delay={100}>
          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4 border-t border-leaf/40 pt-6">
            <p className="font-mono text-[11px] text-foam/40 leading-relaxed flex-1">
              Stati di conservazione: categorie <a href="https://www.iucnredlist.org" target="_blank" rel="noreferrer" className="text-water hover:text-lime transition-colors">IUCN Red List</a> (dati indicativi a scopo didattico).
              Le foto sono le miniature delle voci di Wikipedia, salvate in locale dopo il primo passaggio;
              dove la foto non esiste resta l'identikit disegnato sui colori reali della livrea.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {STATUS_ORDER.map((s) => (
                <span key={s} className="flex items-center gap-1.5 font-mono text-[10px] text-foam/50">
                  <span className="w-2 h-2 rounded-full" style={{ background: STATUS_META[s].color }} />
                  {STATUS_META[s].label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
