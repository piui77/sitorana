import { useState } from "react";
import { CALLS, playCall, playChorus } from "../lib/audio";
import { PADS } from "../lib/data";
import { IconSound, Reveal, SectionHead } from "./ui";

export default function SoundLab() {
  const [playing, setPlaying] = useState<string | null>(null);

  const play = (callId: string) => {
    const dur = playCall(CALLS[callId]);
    setPlaying(callId);
    window.setTimeout(() => setPlaying((p) => (p === callId ? null : p)), dur);
  };

  const chorus = () => {
    const dur = playChorus();
    setPlaying("coro");
    window.setTimeout(() => setPlaying((p) => (p === "coro" ? null : p)), dur);
  };

  const anyPlaying = playing !== null;

  return (
    <section id="coro" className="relative scroll-mt-24 py-24 md:py-36 bg-pond/70 border-y border-leaf/40 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_110%,rgba(183,226,74,0.07)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="05"
          kicker="Coro notturno"
          title="Quattro voci, nessuna registrazione"
          sub="Ogni gracidio è sintetizzato nel tuo browser: frequenze, trilli e pause ricalcano il canto reale. Premi un pad, poi lancia il coro completo."
        />

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {PADS.map((pad, i) => {
            const isPlaying = playing === pad.callId;
            return (
              <Reveal key={pad.callId} delay={i * 80}>
                <button
                  type="button"
                  onClick={() => play(pad.callId)}
                  className={`w-full text-left border p-6 md:p-7 transition-all duration-300 group ${
                    isPlaying
                      ? "border-lime bg-lime/[0.08] shadow-[0_0_40px_-12px_rgba(183,226,74,0.4)]"
                      : "border-leaf/60 bg-deep/60 hover:border-lime/50 hover:-translate-y-1"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display italic font-bold text-2xl md:text-[1.7rem] text-foam">{pad.name}</h3>
                      <p className="font-mono italic text-xs text-water/80 mt-0.5">{pad.latin}</p>
                    </div>
                    <span
                      className={`w-12 h-12 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
                        isPlaying ? "border-lime bg-lime text-ink" : "border-lime/50 text-lime group-hover:bg-lime group-hover:text-ink"
                      }`}
                    >
                      <IconSound playing={isPlaying} />
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.14em] uppercase">
                    <span className="border border-leaf/70 text-lime/90 px-2.5 py-1">{pad.hz}</span>
                    <span className="border border-leaf/70 text-foam/60 px-2.5 py-1">{pad.pattern}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foam/60">{pad.desc}</p>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-col md:flex-row items-stretch md:items-center gap-6 border border-lime/35 bg-lime/[0.05] p-6 md:p-8">
            <div className="flex items-end gap-[5px] h-12" aria-hidden>
              {Array.from({ length: 22 }, (_, i) => (
                <span
                  key={i}
                  className={`w-[5px] rounded-sm ${anyPlaying ? "eq-bar bg-lime" : "bg-leaf"}`}
                  style={{
                    height: `${22 + ((i * 31) % 78)}%`,
                    animationDelay: `${(i % 7) * 0.09}s`,
                    animationDuration: `${0.4 + (i % 4) * 0.13}s`,
                  }}
                />
              ))}
            </div>
            <div className="flex-1">
              <p className="font-display italic font-bold text-2xl md:text-3xl text-foam">Il coro completo</p>
              <p className="mt-1 text-sm text-foam/60 max-w-lg leading-relaxed">
                Rane verdi, temporarie e raganella insieme, come in una notte di aprile attorno a una roggia.
              </p>
            </div>
            <button
              type="button"
              onClick={chorus}
              className={`shrink-0 px-8 py-4 font-mono text-xs tracking-[0.2em] uppercase transition-colors ${
                playing === "coro"
                  ? "bg-lime text-ink"
                  : "border border-lime text-lime hover:bg-lime hover:text-ink"
              }`}
            >
              {playing === "coro" ? "In esecuzione…" : "▶ Avvia il coro"}
            </button>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-8 font-mono text-[11px] text-foam/35 leading-relaxed max-w-2xl">
            Nota di campo: i richiami sono approssimazioni didattiche generate con Web Audio API —
            per il concerto vero, cercare una zona umida dopo il tramonto.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
