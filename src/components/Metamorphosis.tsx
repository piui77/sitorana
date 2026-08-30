import { useEffect, useRef, useState } from "react";
import { STAGES, Stage } from "../lib/data";
import { SectionHead } from "./ui";

function StageArt({ stage }: { stage: Stage["stage"] }) {
  if (stage === "uova") {
    const eggs = [
      [70, 62], [92, 50], [114, 60], [80, 84], [104, 78], [126, 82],
      [92, 102], [116, 102], [70, 100], [136, 68],
    ];
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full" aria-hidden>
        <ellipse cx="100" cy="120" rx="86" ry="12" fill="rgba(127,200,200,0.1)" />
        {eggs.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill="rgba(233,242,220,0.1)" stroke="rgba(233,242,220,0.28)" strokeWidth="1.4" />
            <circle cx={x} cy={y} r="4" fill="#0c1410" />
            <circle cx={x - 1.4} cy={y - 1.4} r="1.3" fill="#b7e24a" opacity="0.8" />
          </g>
        ))}
      </svg>
    );
  }
  if (stage === "girino") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full" aria-hidden>
        <ellipse cx="100" cy="122" rx="86" ry="12" fill="rgba(127,200,200,0.1)" />
        <g className="anim-tail">
          <path d="M78,72 Q120,46 158,70 Q124,92 78,80 Z" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2" />
        </g>
        <ellipse cx="62" cy="74" rx="26" ry="21" fill="#31512c" stroke="#1c2e1e" strokeWidth="2.4" />
        <circle cx="52" cy="66" r="5" fill="#b7e24a" />
        <circle cx="51" cy="66" r="2.2" fill="#0c1410" />
        <path d="M42,84 Q36,92 40,98 M50,86 Q46,94 50,100" stroke="#2e4a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (stage === "zampe") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full" aria-hidden>
        <ellipse cx="100" cy="122" rx="86" ry="12" fill="rgba(127,200,200,0.1)" />
        <g className="anim-tail">
          <path d="M78,70 Q122,44 160,68 Q124,90 78,78 Z" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2" />
        </g>
        <ellipse cx="62" cy="72" rx="27" ry="22" fill="#31512c" stroke="#1c2e1e" strokeWidth="2.4" />
        <circle cx="52" cy="63" r="5.4" fill="#b7e24a" />
        <circle cx="51" cy="63" r="2.3" fill="#0c1410" />
        <path d="M66,92 Q60,104 50,108 M60,108 L44,110 M60,108 L48,118 M60,108 L58,120" stroke="#2e4a2a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        <path d="M78,90 Q76,102 68,106 M68,106 L54,108 M68,106 L58,116" stroke="#2e4a2a" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (stage === "ranocchietta") {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full" aria-hidden>
        <ellipse cx="100" cy="122" rx="86" ry="12" fill="rgba(127,200,200,0.1)" />
        <g className="anim-tail" style={{ transformOrigin: "24% 50%" }}>
          <path d="M52,74 Q30,66 20,74 Q32,84 52,82 Z" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2" />
        </g>
        <ellipse cx="92" cy="78" rx="42" ry="30" fill="#31512c" stroke="#1c2e1e" strokeWidth="2.4" />
        <circle cx="118" cy="58" r="13" fill="#b7e24a" stroke="#1c2e1e" strokeWidth="2.2" />
        <ellipse cx="119" cy="58" rx="3.4" ry="7" fill="#0c1410" />
        <path d="M128,74 Q114,82 100,83" stroke="#1c2e1e" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M112,102 Q116,112 122,116 M122,116 L116,124 M122,116 L128,122" stroke="#2e4a2a" strokeWidth="3.6" fill="none" strokeLinecap="round" />
        <ellipse cx="70" cy="96" rx="16" ry="12" transform="rotate(-14 70 96)" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 150" className="w-full h-full" aria-hidden>
      <ellipse cx="100" cy="124" rx="86" ry="12" fill="rgba(127,200,200,0.1)" />
      <polygon points="66,102 30,106 24,114 36,120 68,112" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="1.8" />
      <ellipse cx="82" cy="92" rx="34" ry="26" transform="rotate(-14 82 92)" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2.2" />
      <path d="M62,104 C52,80 66,52 100,46 C128,42 152,56 160,76 C166,90 160,102 144,106 C116,114 80,116 62,104 Z" fill="#31512c" stroke="#1c2e1e" strokeWidth="2.4" />
      <circle cx="140" cy="52" r="13" fill="#b7e24a" stroke="#1c2e1e" strokeWidth="2.2" />
      <ellipse cx="141" cy="52" rx="3.4" ry="7.4" fill="#0c1410" />
      <path d="M158,72 Q140,80 126,81" stroke="#1c2e1e" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M132,100 Q140,110 146,116 M146,116 L138,124 M146,116 L154,122" stroke="#2e4a2a" strokeWidth="3.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Metamorphosis() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const stage = STAGES[active];

  return (
    <section id="metamorfosi" className="relative scroll-mt-24 py-24 md:py-36 bg-pond/70 border-y border-leaf/40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="03"
          kicker="Metamorfosi"
          title="Da girino a saltatrice in dodici settimane"
          sub="Nessun altro vertebrato cambia così tanto, così in fretta: branchie che diventano polmoni, una coda che si autodigerisce, una dieta che si capovolge."
        />

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-28">
            <div className="relative border border-leaf/70 bg-deep/80 p-6 md:p-10">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-foam/40">
                <span>Tav. III — sviluppo</span>
                <span className="text-lime">{String(active + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")}</span>
              </div>

              <div className="mt-6 aspect-[4/3] flex items-center justify-center">
                <StageArt key={stage.id} stage={stage.stage} />
              </div>

              <div className="mt-4 flex items-center gap-2" aria-hidden>
                {STAGES.map((s, i) => (
                  <span
                    key={s.id}
                    className={`h-[3px] flex-1 transition-colors duration-500 ${i <= active ? "bg-lime" : "bg-leaf/60"}`}
                  />
                ))}
              </div>
              <p className="mt-4 font-display italic font-bold text-2xl md:text-3xl text-foam">{stage.title}</p>
              <p className="mt-1 font-mono text-xs text-water/80">{stage.when}</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {STAGES.map((s, i) => {
              const isActive = i === active;
              return (
                <div
                  key={s.id}
                  data-idx={i}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                  className={`border border-leaf/50 p-6 md:p-8 transition-all duration-500 ${
                    isActive ? "border-lime/60 bg-lime/[0.05] translate-x-0 md:translate-x-2" : "opacity-55 hover:opacity-80"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`font-display italic font-black text-4xl md:text-5xl ${isActive ? "text-lime" : "text-foam/25"}`}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-water/70">{s.when}</p>
                      <h3 className="font-display italic font-bold text-2xl md:text-[1.65rem] text-foam mt-1">{s.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-[15px] md:text-base leading-relaxed text-foam/65">{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
