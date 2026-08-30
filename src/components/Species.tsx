import { useState } from "react";
import { CALLS, playCall } from "../lib/audio";
import { SPECIES } from "../lib/data";
import { ARCHIVE } from "../lib/archive";
import PlateImage from "./PlateImage";
import { IconSound, Reveal, SectionHead } from "./ui";

export default function Species() {
  const [playing, setPlaying] = useState<string | null>(null);

  const play = (callId: string, key: string) => {
    const dur = playCall(CALLS[callId]);
    setPlaying(key);
    window.setTimeout(() => setPlaying((p) => (p === key ? null : p)), dur);
  };

  return (
    <section id="specie" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="04"
          kicker="Schede di campo"
          title="Dieci inquiline dello stagno (e oltre)"
          sub="Dalla raganella di casa nostra alla rana toro africana: ogni scheda riporta taglia, habitat, tossicità e — premi play — la voce ricostruita in tempo reale. In fondo, le voci che non sentiremo più."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SPECIES.map((sp, i) => {
            const isPlaying = playing === sp.id;
            return (
              <Reveal key={sp.id} delay={(i % 3) * 90}>
                <article className="card-species group border border-leaf/60 bg-pond/50 overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <PlateImage
                      sp={sp}
                      className="anim-kenburns w-full h-full object-cover"
                      style={{ animationDelay: `${-i * 3.1}s` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-ink/30" />
                    <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.22em] uppercase bg-ink/70 border border-leaf/60 text-foam/70 px-2.5 py-1">
                      {sp.code}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-ink/70 border border-leaf/60 px-2.5 py-1.5" title={`Tossicità ${sp.toxicity}/5`}>
                      {Array.from({ length: 5 }, (_, d) => (
                        <span
                          key={d}
                          className={`w-1.5 h-1.5 rounded-full ${d < sp.toxicity ? "bg-amber" : "bg-leaf"}`}
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-4">
                      <h3 className="font-display italic font-bold text-2xl md:text-[1.6rem] leading-tight text-foam">
                        {sp.name}
                      </h3>
                      <p className="font-mono italic text-xs text-lime/85 mt-0.5">{sp.latin}</p>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <dl className="grid grid-cols-3 gap-2 font-mono text-[10px] tracking-wide uppercase">
                      <div>
                        <dt className="text-foam/35">Luogo</dt>
                        <dd className="text-foam/75 normal-case tracking-normal text-[11px] mt-0.5 leading-snug">{sp.place}</dd>
                      </div>
                      <div>
                        <dt className="text-foam/35">Taglia</dt>
                        <dd className="text-foam/75 text-[11px] mt-0.5">{sp.size}</dd>
                      </div>
                      <div>
                        <dt className="text-foam/35">Habitat</dt>
                        <dd className="text-foam/75 normal-case tracking-normal text-[11px] mt-0.5 leading-snug">{sp.habitat}</dd>
                      </div>
                    </dl>
                    <p className="text-sm leading-relaxed text-foam/60 flex-1">{sp.note}</p>
                    <button
                      type="button"
                      onClick={() => play(sp.callId, sp.id)}
                      className={`flex items-center justify-between gap-3 border px-4 py-3 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors ${
                        isPlaying
                          ? "border-lime bg-lime text-ink"
                          : "border-leaf/70 text-lime hover:border-lime/70 hover:bg-lime/[0.07]"
                      }`}
                    >
                      <span>{sp.callLabel}</span>
                      <IconSound playing={isPlaying} />
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}

          {/* ---- in memoriam ---- */}
          <Reveal delay={90}>
            <article className="h-full flex flex-col border border-dashed border-leaf/80 bg-ink/70 p-6">
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-foam/35">
                In memoriam · SPC-†
              </span>
              <svg viewBox="0 0 120 80" className="w-28 mt-5 opacity-60" aria-hidden>
                <defs>
                  <pattern id="hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="5" stroke="#8a9a78" strokeWidth="1.1" />
                  </pattern>
                </defs>
                <path
                  d="M18,62 C16,44 28,32 44,29 C50,28 53,21 59,18 C65,15 72,18 72,24 C72,28 77,31 82,34 C94,40 100,50 98,58 C96,66 86,70 72,70 L32,70 C24,70 19,68 18,62 Z"
                  fill="url(#hatch)" stroke="#8a9a78" strokeWidth="1.4"
                />
                <circle cx="64" cy="26" r="3" fill="none" stroke="#8a9a78" strokeWidth="1.3" />
              </svg>
              <h3 className="mt-4 font-display italic font-bold text-2xl leading-tight text-foam">
                Le voci perdute
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-snug">
                <li>
                  <span className="font-mono italic text-water/85">Rheobatrachus silus</span>
                  <span className="text-foam/40"> · † 1985</span>
                  <span className="block text-foam/55 text-[13px] mt-0.5">incubava i girini nello stomaco, in Australia</span>
                </li>
                <li>
                  <span className="font-mono italic text-water/85">Incilius periglenes</span>
                  <span className="text-foam/40"> · † 1989</span>
                  <span className="block text-foam/55 text-[13px] mt-0.5">il rospo dorato di Monteverde, Costa Rica</span>
                </li>
              </ul>
              <p className="mt-auto pt-5 text-[13px] leading-relaxed text-foam/50 border-t border-leaf/50">
                Il coro si è già spento per decine di specie. Queste due ricordano che la lista non è teorica.
              </p>
            </article>
          </Reveal>

          {/* ---- archivio completo ---- */}
          <Reveal delay={180}>
            <a
              href="#archivio"
              className="group h-full flex flex-col justify-between border border-lime/50 bg-lime/[0.05] p-6 transition-colors duration-300 hover:bg-lime"
            >
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-lime/90 group-hover:text-ink/70 transition-colors">
                  E non finisce qui
                </span>
                <p className="mt-4 font-display italic font-black text-5xl md:text-6xl text-foam group-hover:text-ink transition-colors">
                  +{ARCHIVE.length}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foam/60 group-hover:text-ink/75 max-w-[26ch] transition-colors">
                  specie nell'archivio: rane stravaganti e un'intera ala di salamandre e tritoni.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-lime group-hover:text-ink transition-colors">
                Apri l'archivio
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden>
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4">
            <p className="font-mono text-xs text-foam/40 max-w-2xl leading-relaxed flex-1">
              <span className="text-amber">●</span> tossicità: 0 innocua · 5 letale — la scala riguarda le secrezioni cutanee,
              non il morso: le rane non mordono (quasi) mai.
            </p>
            <a
              href="#archivio"
              className="group shrink-0 inline-flex items-center gap-3 border border-lime/50 px-5 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-lime transition-colors hover:bg-lime hover:text-ink"
            >
              L'archivio completo · +{ARCHIVE.length} specie
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-y-0.5" aria-hidden>
                <path d="M12 5v14M5 12l7 7 7-7" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
