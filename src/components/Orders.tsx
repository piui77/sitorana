import { useEffect, useRef, useState, type ReactElement } from "react";
import { Reveal, SectionHead } from "./ui";

/* ---------- silhouette da guida di campo ---------- */
function FrogGlyph() {
  return (
    <svg viewBox="0 0 140 70" className="w-full h-full" aria-hidden>
      <ellipse cx="62" cy="42" rx="34" ry="21" fill="currentColor" />
      <circle cx="100" cy="35" r="18" fill="currentColor" />
      <circle cx="105" cy="20" r="7.5" fill="currentColor" />
      <ellipse cx="30" cy="48" rx="19" ry="12" transform="rotate(-18 30 48)" fill="currentColor" opacity="0.85" />
      <circle cx="107" cy="19" r="2.6" fill="#0c1410" />
      <path d="M116,38 Q104,44 94,44" stroke="#0c1410" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function SalamanderGlyph() {
  return (
    <svg viewBox="0 0 140 70" className="w-full h-full" aria-hidden>
      <path
        d="M8,40 C18,27 34,25 52,29 C74,34 92,31 106,27 C117,24 128,27 132,33 C126,39 115,39 104,37 C88,34 70,39 52,41 C34,43 18,48 8,40 Z"
        fill="currentColor"
      />
      <path d="M48,41 L40,56 M58,40 L52,55 M98,35 L90,50 M110,34 L104,49" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="33" r="3.4" fill="#f0a32b" />
      <circle cx="66" cy="35" r="3" fill="#f0a32b" />
      <circle cx="88" cy="31" r="3.4" fill="#f0a32b" />
      <circle cx="112" cy="30" r="2.8" fill="#f0a32b" />
      <circle cx="126" cy="31" r="2.3" fill="#0c1410" />
    </svg>
  );
}

function CaecilianGlyph() {
  return (
    <svg viewBox="0 0 140 70" className="w-full h-full" aria-hidden>
      <path
        d="M12,46 C30,20 52,54 72,33 C92,14 112,46 128,31"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M31,29 l5,13 M52,41 l5,11 M72,26 l5,13 M92,23 l5,13 M111,38 l5,11"
        stroke="#0f1d14"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="125" cy="30" r="2" fill="#0c1410" />
    </svg>
  );
}

/* ---------- dati ---------- */
interface Order {
  id: string;
  numeral: string;
  short: string;
  name: string;
  count: number;
  pct: number;
  color: string;
  trait: string;
  fact: string;
  Glyph: () => ReactElement;
}

const ORDERS: Order[] = [
  {
    id: "anura", numeral: "I", short: "Anura", name: "Rane e rospi",
    count: 7400, pct: 88, color: "#b7e24a",
    trait: "Niente coda da adulti, zampe posteriori a molla, voce come documento d'identità: è l'ordine che ha colonizzato quasi tutto il pianeta.",
    fact: "Da sole superano tutte le specie di mammiferi conosciute (circa 6.500).",
    Glyph: FrogGlyph,
  },
  {
    id: "urodela", numeral: "II", short: "Urodela", name: "Salamandre e tritoni",
    count: 770, pct: 9, color: "#7fc8c8",
    trait: "Coda per tutta la vita, passo cauto, pelle umida: molte rigenerano zampe, coda e perfino parti di midollo spinale.",
    fact: "La salamandra gigante cinese arriva a 1,8 metri: l'anfibio più grande del mondo.",
    Glyph: SalamanderGlyph,
  },
  {
    id: "apoda", numeral: "III", short: "Apoda", name: "Cecilie",
    count: 220, pct: 3, color: "#f0a32b",
    trait: "Senza zampe e con occhi minuscoli: anellidi solo all'apparenza, vivono quasi tutte sottoterra nei tropici.",
    fact: "In alcune specie i piccoli «brucano» la pelle nutriente della madre.",
    Glyph: CaecilianGlyph,
  },
];

const TOTALE = 8390;

/* ---------- contatore ---------- */
function useCountUp(target: number, run: boolean, dur = 1500): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return v;
}

function Total({ run }: { run: boolean }) {
  const v = useCountUp(TOTALE, run, 1700);
  return (
    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-foam/45">
      Totale anfibi: <span className="text-foam text-sm tracking-normal normal-case">{v.toLocaleString("it-IT")}</span> specie descritte
      <span className="text-foam/35"> · ≈150 nuove ogni anno</span>
    </p>
  );
}

/* ---------- sezione ---------- */
export default function Orders() {
  const barRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="famiglia" className="relative scroll-mt-24 py-24 md:py-36">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_45%_at_12%_8%,rgba(127,200,200,0.05)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="08"
          kicker="Censimento"
          title="Quante sono, davvero?"
          sub={`Circa 7.400 specie di rane e rospi, 770 di salamandre e tritoni, 220 di cecilie: oltre 8.000 anfibi in tutto, e la conta non si ferma. Le proporzioni qui sotto sono in scala reale — ed è proprio questo il punto.`}
        />

        {/* barra proporzionale */}
        <Reveal>
          <div ref={barRef} className="border border-leaf/60 bg-pond/60 p-5 md:p-7">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-foam/40">
                Tav. IX — proporzione degli ordini (scala reale)
              </p>
              <Total run={inView} />
            </div>

            <div className="flex h-14 md:h-16 w-full overflow-hidden border border-ink/60">
              {ORDERS.map((o, i) => (
                <div
                  key={o.id}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="relative h-full cursor-default transition-all duration-300"
                  style={{
                    width: inView ? `${o.pct}%` : "0%",
                    background: o.color,
                    transitionProperty: "width, filter, transform",
                    transitionDuration: "1300ms, 250ms, 250ms",
                    transitionTimingFunction: "cubic-bezier(0.19,1,0.22,1), ease, ease",
                    transitionDelay: inView ? `${i * 140}ms, 0ms, 0ms` : "0ms",
                    filter: active === null || active === i ? "none" : "saturate(0.35) brightness(0.6)",
                    transform: active === i ? "scaleY(1.06)" : "none",
                  }}
                  title={`${o.short}: ${o.count.toLocaleString("it-IT")} specie (${o.pct}%)`}
                >
                  <span className="absolute inset-y-0 left-2 md:left-3 flex items-center font-mono text-[10px] md:text-[11px] font-bold tracking-[0.14em] uppercase text-ink">
                    {o.short}
                  </span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] md:text-xs font-bold text-ink/70">
                    {o.pct}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {ORDERS.map((o, i) => (
                <span
                  key={o.id}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={`flex items-center gap-2 font-mono text-[11px] transition-colors cursor-default ${
                    active === i ? "text-foam" : "text-foam/50"
                  }`}
                >
                  <span className="w-2.5 h-2.5" style={{ background: o.color }} aria-hidden />
                  {o.name}: <span className="text-foam">{o.count.toLocaleString("it-IT")}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* i tre ordini */}
        <div className="mt-12 md:mt-16 flex flex-col">
          {ORDERS.map((o, i) => {
            const isActive = active === i;
            return (
              <Reveal key={o.id} delay={i * 90}>
                <div
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className={`group grid grid-cols-[64px_1fr] md:grid-cols-[110px_120px_1fr] items-center gap-4 md:gap-8 border-l-2 pl-4 md:pl-7 py-7 md:py-8 transition-all duration-300 ${
                    isActive ? "translate-x-2" : ""
                  }`}
                  style={{ borderLeftColor: isActive ? o.color : "rgba(74,107,58,0.4)" }}
                >
                  <span
                    className="font-display italic font-black text-4xl md:text-6xl leading-none transition-colors duration-300"
                    style={{ color: isActive ? o.color : "rgba(233,242,220,0.18)" }}
                  >
                    {o.numeral}
                  </span>

                  <div className="hidden md:block w-full max-w-[120px] text-foam/70 transition-colors duration-300" style={{ color: isActive ? o.color : undefined }}>
                    <o.Glyph />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display italic font-bold text-2xl md:text-3xl text-foam">
                        {o.name} <span className="font-mono not-italic text-sm tracking-[0.2em] uppercase" style={{ color: o.color }}>{o.short}</span>
                      </h3>
                      <span className="font-mono text-sm md:text-base" style={{ color: o.color }}>
                        ≈ {o.count.toLocaleString("it-IT")} specie
                      </span>
                    </div>
                    <p className="mt-2 text-[15px] leading-relaxed text-foam/60 max-w-2xl">{o.trait}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-foam/40 italic max-w-2xl">
                      <span className="not-italic font-mono text-[10px] tracking-[0.2em] uppercase mr-2" style={{ color: o.color }}>Nota</span>
                      {o.fact}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140}>
          <p className="mt-10 font-mono text-[11px] text-foam/35 leading-relaxed max-w-2xl">
            Cifre indicativi: <a href="https://amphibiaweb.org" target="_blank" rel="noreferrer" className="text-water hover:text-lime transition-colors">AmphibiaWeb</a> e{" "}
            <a href="https://www.iucnredlist.org" target="_blank" rel="noreferrer" className="text-water hover:text-lime transition-colors">IUCN</a> aggiornano
            il censimento di continuo — circa 150 nuove specie di anfibi vengono descritte ogni anno, quasi tutte rane.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
