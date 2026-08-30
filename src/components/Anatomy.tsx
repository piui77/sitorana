import { useState } from "react";
import { PARTS } from "../lib/data";
import { Reveal, SectionHead } from "./ui";

function FrogDiagram({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  return (
    <svg viewBox="0 0 420 260" className="w-full h-auto" role="img" aria-label="Diagramma anatomico di una rana, vista laterale">
      {/* piede posteriore palmato */}
      <polygon points="118,190 50,196 38,208 56,220 120,206" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2" />
      <path d="M118,194 L50,200 M118,199 L44,208 M118,203 L58,216" stroke="#1c2e1e" strokeWidth="1.6" />
      {/* coscia ripiegata */}
      <ellipse cx="148" cy="156" rx="62" ry="48" transform="rotate(-16 148 156)" fill="#2e4a2a" stroke="#1c2e1e" strokeWidth="2.5" />
      {/* corpo */}
      <path
        d="M96,192 C74,140 108,74 184,62 C254,50 322,76 346,122 C358,144 350,170 320,180 C256,202 148,210 96,192 Z"
        fill="#31512c"
        stroke="#1c2e1e"
        strokeWidth="2.5"
      />
      {/* ventre */}
      <path d="M104,186 C170,202 262,196 318,178" stroke="#8fbf2e" strokeWidth="2" fill="none" opacity="0.5" />
      {/* macchie */}
      <circle cx="200" cy="100" r="6" fill="#1c2e1e" opacity="0.55" />
      <circle cx="232" cy="86" r="4" fill="#1c2e1e" opacity="0.55" />
      <circle cx="172" cy="122" r="5" fill="#1c2e1e" opacity="0.55" />
      <circle cx="250" cy="108" r="3.4" fill="#1c2e1e" opacity="0.55" />
      {/* narici */}
      <circle cx="334" cy="106" r="2.4" fill="#1c2e1e" />
      <circle cx="343" cy="112" r="2.4" fill="#1c2e1e" />
      {/* bocca */}
      <path d="M346,128 Q312,142 284,144" stroke="#1c2e1e" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {/* sacco vocale */}
      <ellipse cx="341" cy="162" rx="21" ry="14" fill="rgba(127,200,200,0.16)" stroke="#7fc8c8" strokeWidth="1.6" strokeDasharray="5 4" />
      {/* occhio */}
      <circle cx="300" cy="84" r="24" fill="#b7e24a" stroke="#1c2e1e" strokeWidth="2.5" />
      <ellipse cx="302" cy="84" rx="6" ry="14" fill="#0c1410" />
      <circle cx="294" cy="74" r="4.4" fill="#f4f7ea" opacity="0.85" />
      {/* timpano */}
      <circle cx="257" cy="124" r="15" fill="rgba(233,242,220,0.08)" stroke="#e9f2dc" strokeWidth="1.8" opacity="0.85" />
      <circle cx="257" cy="124" r="6" fill="none" stroke="#e9f2dc" strokeWidth="1.2" opacity="0.5" />
      {/* zampa anteriore */}
      <path d="M296,168 Q310,188 318,204" stroke="#2e4a2a" strokeWidth="11" fill="none" strokeLinecap="round" />
      <path d="M318,204 L308,216 M318,204 L322,218 M318,204 L332,212" stroke="#2e4a2a" strokeWidth="5" strokeLinecap="round" />

      {/* hotspot */}
      {PARTS.map((p) => {
        const isActive = p.id === active;
        return (
          <g key={p.id} onClick={() => onSelect(p.id)} className="cursor-pointer" role="button" aria-label={p.title}>
            {isActive && <circle cx={p.x} cy={p.y} r="20" fill="none" stroke="#b7e24a" strokeWidth="1.4" className="anim-pulse-soft" />}
            <circle
              cx={p.x}
              cy={p.y}
              r="13"
              fill={isActive ? "#b7e24a" : "rgba(12,20,16,0.78)"}
              stroke={isActive ? "#b7e24a" : "rgba(183,226,74,0.55)"}
              strokeWidth="1.6"
              style={{ transition: "fill .3s, stroke .3s" }}
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Spline Sans Mono, monospace"
              fontWeight={600}
              fill={isActive ? "#0c1410" : "#b7e24a"}
            >
              {p.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Anatomy() {
  const [active, setActive] = useState(PARTS[0].id);
  const activePart = PARTS.find((p) => p.id === active)!;

  return (
    <section id="anatomia" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="02"
          kicker="Anatomia"
          title="Macchina da salto, corpo da microfono"
          sub="Sei dettagli che spiegano come un animale senza artigli né zanne sia sopravvissuto 200 milioni di anni. Passa il cursore sui punti numerati."
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <Reveal className="relative border border-leaf/70 bg-pond/60 p-5 md:p-8">
              <span className="absolute top-4 left-5 font-mono text-[10px] tracking-[0.25em] uppercase text-foam/35">
                Tav. II — Rana esculenta, lato sinistro
              </span>
              <div className="mt-8">
                <FrogDiagram active={active} onSelect={setActive} />
              </div>
              <p className="mt-4 font-mono text-xs text-lime/90 border-t border-leaf/60 pt-4">
                <span className="text-foam/35">&gt;</span> {activePart.n} — {activePart.title.toLowerCase()}
                <span className="text-foam/35"> · in evidenza</span>
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col">
            {PARTS.map((p, i) => {
              const isActive = p.id === active;
              return (
                <Reveal key={p.id} delay={i * 60}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(p.id)}
                    onFocus={() => setActive(p.id)}
                    onClick={() => setActive(p.id)}
                    className={`w-full text-left group border-l-2 pl-5 md:pl-7 py-6 transition-all duration-300 ${
                      isActive ? "border-lime bg-lime/[0.045]" : "border-leaf/50 hover:border-fern"
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className={`font-mono text-xs transition-colors ${isActive ? "text-lime" : "text-foam/35"}`}
                      >
                        {p.n}
                      </span>
                      <h3
                        className={`font-display italic font-bold text-2xl md:text-[1.7rem] transition-colors ${
                          isActive ? "text-foam" : "text-foam/55 group-hover:text-foam/80"
                        }`}
                      >
                        {p.title}
                      </h3>
                    </div>
                    <p
                      className={`mt-2 text-[15px] leading-relaxed transition-all duration-300 ${
                        isActive ? "text-foam/75 max-h-40 opacity-100" : "text-foam/40 max-h-40"
                      }`}
                    >
                      {p.text}
                    </p>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
