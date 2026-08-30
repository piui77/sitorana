import { ACTIONS, IUCN_BARS, STATS, THREATS } from "../lib/data";
import { Counter, Reveal, SectionHead, useInView } from "./ui";

export function Numbers() {
  return (
    <section id="numeri" className="relative scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <p className="font-mono text-[11px] md:text-xs tracking-[0.28em] uppercase text-lime/80 mb-10">
          <span className="text-foam/40">06 —</span> Lo stagno in cifre
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className={`py-8 md:py-10 px-2 md:px-6 h-full ${i > 0 ? "sm:border-l sm:border-leaf/50" : ""}`}>
                <p className="font-display italic font-black text-5xl md:text-6xl text-foam leading-none">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-4 text-sm leading-relaxed text-foam/55 max-w-[26ch]">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <p className="mt-6 font-mono text-[11px] text-foam/35">Fonte: IUCN Red List, aggiornamento 2023 · AmphibiaWeb.</p>
        </Reveal>
      </div>
    </section>
  );
}

function IucnChart() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  return (
    <div ref={ref} className="border border-leaf/60 bg-pond/60 p-6 md:p-8">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-foam/40">
        % di specie minacciate per gruppo · IUCN 2023
      </p>
      <div className="mt-6 flex flex-col gap-5">
        {IUCN_BARS.map((b, i) => (
          <div key={b.label} className="grid grid-cols-[110px_1fr_44px] md:grid-cols-[150px_1fr_50px] items-center gap-3">
            <span className={`font-mono text-xs ${b.hot ? "text-lime" : "text-foam/60"}`}>{b.label}</span>
            <div className="h-6 bg-deep border border-leaf/40 overflow-hidden">
              <div
                className={`h-full ${b.hot ? "bg-lime" : "bg-fern/70"}`}
                style={{
                  width: inView ? `${b.value * 2.2}%` : "0%",
                  transition: `width 1.1s cubic-bezier(0.19,1,0.22,1) ${i * 120}ms`,
                }}
              />
            </div>
            <span className={`font-display italic font-bold text-xl text-right ${b.hot ? "text-lime" : "text-foam/70"}`}>
              {b.value}%
            </span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-foam/55 leading-relaxed">
        Nessun altro gruppo di vertebrati sta perdendo specie così in fretta: gli anfibi sono i canarini
        nella miniera della crisi climatica — e la loro pelle permeabile registra tutto prima di noi.
      </p>
    </div>
  );
}

export default function Conservation() {
  return (
    <section id="conservazione" className="relative scroll-mt-24 py-24 md:py-36 bg-pond/70 border-y border-leaf/40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="07"
          kicker="Conservazione"
          title="Il coro si sta assottigliando"
          sub="Dagli anni '70 le popolazioni di anfibi sono crollate in tutto il mondo. Quattro minacce principali, e qualche gesto concreto per invertire la rotta."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <Reveal>
            <IucnChart />
          </Reveal>

          <div className="flex flex-col">
            {THREATS.map((t, i) => (
              <Reveal key={t.title} delay={i * 70}>
                <div className="border-l-2 border-rust/70 pl-5 md:pl-7 py-5 group hover:bg-lime/[0.03] transition-colors">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs text-foam/35">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display italic font-bold text-xl md:text-2xl text-foam">{t.title}</h3>
                    <span
                      className={`font-mono text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 border ${
                        t.level === "critica" ? "border-amber/60 text-amber" : "border-rust/60 text-rust"
                      }`}
                    >
                      {t.level}
                    </span>
                  </div>
                  <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-foam/60">{t.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mt-14 border border-lime/30 bg-lime/[0.04] p-6 md:p-10">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-lime/80 mb-6">Cosa puoi fare, da stasera</p>
            <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4">
              {ACTIONS.map((a, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-foam/75">
                  <svg viewBox="0 0 20 20" className="w-5 h-5 mt-0.5 shrink-0 text-lime" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M3 10.5l4.5 4.5L17 5.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
