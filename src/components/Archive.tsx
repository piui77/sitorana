import { useMemo, useState } from "react";
import { ARCHIVE, FAMILIES, REGIONS, STATUS_META, STATUS_ORDER, type IUCN } from "../lib/archive";
import { SPECIES } from "../lib/data";
import PlateImage from "./PlateImage";
import { sceneFor } from "../lib/portraits";
import { Reveal, SectionHead } from "./ui";

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
          sub={`Dieci schede di prima mano più ${ARCHIVE.length} ritratti. Le foto reali si scaricano DENTRO il sito con lo script «download_foto.py» (cartella public/images/specie): da quel momento si servono da lì, senza dipendenze esterne. Finché una foto non c'è, al suo posto una tavola illustrata SVG incorporata nel codice, con livrea e dettagli coerenti con la specie. Filtra per regione e stato, ordina per taglia o rischio.`}
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
            <span className="text-lime font-semibold text-sm">{filtered.length}</span> / {ARCHIVE.length} tavole in archivio ·{" "}
            <span className="text-foam/70">{total} specie nell'atlante</span>
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
                  className="group relative border border-leaf/50 bg-deep/60 flex flex-col overflow-hidden transition-all duration-300 hover:border-lime/50 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_-18px_rgba(0,0,0,0.8)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <span
                      className="absolute top-2 right-2 z-10 font-mono text-[10px] font-bold tracking-[0.1em] px-1.5 py-0.5 text-ink"
                      style={{ background: meta.color }}
                      title={`${meta.label} (IUCN)`}
                    >
                      {sp.status}
                    </span>
                    <PlateImage
                      sp={{ ...sp, scene: sceneFor(sp.region, sp.family) }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <span className="absolute bottom-1.5 left-1.5 z-10 font-mono text-[8.5px] tracking-[0.14em] uppercase bg-ink/75 text-foam/60 px-1.5 py-0.5">
                      foto/tavola · locale
                    </span>
                  </div>
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
              Le foto reali si scaricano nel sito con <span className="text-lime">python3 download_foto.py</span> (salvate in public/images/specie, nessuna dipendenza esterna);
              dove la foto non è ancora stata scaricata il sito mostra la tavola SVG incorporata nel codice.
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
