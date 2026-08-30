import { useState } from "react";
import { CALLS, playCall } from "../lib/audio";
import { SPECIES } from "../lib/data";
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
          title="Sei inquiline dello stagno (e oltre)"
          sub="Dalla raganella di casa nostra al fillopate dorato: ogni scheda riporta taglia, habitat, tossicità e — premi play — la voce ricostruita in tempo reale."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SPECIES.map((sp, i) => {
            const isPlaying = playing === sp.id;
            return (
              <Reveal key={sp.id} delay={(i % 3) * 90}>
                <article className="card-species group border border-leaf/60 bg-pond/50 overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={sp.img}
                      alt={sp.name}
                      loading="lazy"
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
        </div>

        <Reveal delay={120}>
          <p className="mt-10 font-mono text-xs text-foam/40 max-w-2xl leading-relaxed">
            <span className="text-amber">●</span> tossicità: 0 innocua · 5 letale — la scala riguarda le secrezioni cutanee,
            non il morso: le rane non mordono (quasi) mai.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
