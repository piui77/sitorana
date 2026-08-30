import { CSSProperties, MouseEvent, useRef, useState } from "react";
import { CALLS, playCall } from "../lib/audio";
import { Fireflies, IconSound, usePrefersReducedMotion } from "./ui";

const TITLE = ["R", "A", "N", "E"];
const BUBBLE_WORDS = ["cra!", "ribbit!", "koáx koáx!", "brekekekéx!", "cra cra!", "gra gra!", "croac!"];
const LETTER_CALLS = ["esculentus", "temporaria", "hyla", "litoria"] as const;

interface Ripple { id: number; x: number; y: number }
interface Bubble { id: number; x: number; y: number; text: string; size: number }

function Reeds({ className, seed = 0 }: { className?: string; seed?: number }) {
  const reeds = Array.from({ length: 10 }, (_, i) => ({
    x: 6 + i * 15 + ((i * 7 + seed * 13) % 9),
    h: 62 + ((i * 37 + seed * 29) % 78),
    d: (i * 0.71 + seed) % 4,
    w: i % 3 === 0 ? 4 : 2.4,
  }));
  return (
    <svg viewBox="0 0 170 170" className={className} preserveAspectRatio="xMinYMax meet" aria-hidden>
      {reeds.map((r, i) => (
        <g key={i} className="anim-sway" style={{ animationDelay: `${-r.d}s`, animationDuration: `${5 + (i % 4)}s` }}>
          <path
            d={`M${r.x},170 Q${r.x + 5},${170 - r.h * 0.55} ${r.x + 2.5},${170 - r.h}`}
            stroke={i % 2 ? "#2e4a2a" : "#22381f"}
            strokeWidth={r.w}
            fill="none"
            strokeLinecap="round"
          />
          {i % 3 === 0 && <ellipse cx={r.x + 2.5} cy={170 - r.h + 4} rx={3.4} ry={9} fill="#4a6b3a" />}
        </g>
      ))}
    </svg>
  );
}

function LilyPad({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 120 80" className={className} style={style} aria-hidden>
      <path d="M62,40 L114,28 A54,34 0 1 0 114,52 Z" fill="#2e4a2a" stroke="#4a6b3a" strokeWidth="1.6" />
      <path d="M62,40 L22,24 M62,40 L14,44 M62,40 L26,62 M62,40 L46,14 M62,40 L40,66" stroke="#22381f" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function EyesPair({ className, delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <span className={`absolute flex gap-[7px] ${className ?? ""}`} style={{ animationDelay: delay }} aria-hidden>
      <span className="anim-blink w-[7px] h-[7px] rounded-full bg-lime shadow-[0_0_12px_3px_rgba(183,226,74,0.55)]" style={{ animationDelay: delay }} />
      <span className="anim-blink w-[7px] h-[7px] rounded-full bg-lime shadow-[0_0_12px_3px_rgba(183,226,74,0.55)]" style={{ animationDelay: delay }} />
    </span>
  );
}

export default function PondHero() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [croaking, setCroaking] = useState(false);
  const [squishIdx, setSquishIdx] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const addRipple = (x: number, y: number) => {
    if (reduced) return;
    const id = ++idRef.current;
    setRipples((r) => [...r.slice(-8), { id, x, y }]);
    window.setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 1050);
  };

  const spawnBubble = (x: number, y: number) => {
    if (reduced) return;
    const id = ++idRef.current;
    const text = BUBBLE_WORDS[Math.floor(Math.random() * BUBBLE_WORDS.length)];
    const size = 1.1 + Math.random() * 1.3;
    setBubbles((b) => [...b.slice(-6), { id, x, y, text, size }]);
    window.setTimeout(() => setBubbles((b) => b.filter((p) => p.id !== id)), 1200);
  };

  const heroClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = heroRef.current!.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top);
  };

  const croakButton = () => {
    const dur = playCall(CALLS.esculentus);
    setCroaking(true);
    window.setTimeout(() => setCroaking(false), dur);
  };

  const letterClick = (e: MouseEvent<HTMLButtonElement>, idx: number) => {
    e.stopPropagation();
    const cfg = CALLS[LETTER_CALLS[idx % LETTER_CALLS.length]];
    playCall(cfg);
    setSquishIdx(idx);
    window.setTimeout(() => setSquishIdx(null), 520);
    const rect = heroRef.current!.getBoundingClientRect();
    const lr = e.currentTarget.getBoundingClientRect();
    spawnBubble(lr.left - rect.left + lr.width / 2, lr.top - rect.top - 8);
  };

  return (
    <div
      ref={heroRef}
      onClick={heroClick}
      className="relative min-h-[100svh] overflow-hidden cursor-pointer select-none bg-[radial-gradient(130%_90%_at_72%_-12%,#1c2e1e_0%,#0f1d14_52%,#0c1410_100%)]"
    >
      {/* acqua e luna */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[46%] bg-[radial-gradient(90%_100%_at_50%_100%,rgba(127,200,200,0.14)_0%,rgba(127,200,200,0.04)_45%,transparent_75%)]" />
      <div aria-hidden className="absolute right-[12%] top-[10%] w-28 h-28 md:w-40 md:h-40 rounded-full bg-foam/[0.07] blur-[2px] anim-pulse-soft" />
      <div aria-hidden className="absolute right-[14%] top-[12%] w-20 h-20 md:w-28 md:h-28 rounded-full bg-foam/[0.05]" />

      {/* ninfee */}
      <LilyPad className="anim-floaty absolute left-[6%] bottom-[13%] w-24 md:w-40 opacity-90" style={{ ["--fr" as string]: "-8deg", animationDelay: "-2s" }} />
      <LilyPad className="anim-floaty absolute left-[30%] bottom-[5%] w-16 md:w-24 opacity-70" style={{ ["--fr" as string]: "14deg", animationDelay: "-4.5s" }} />
      <LilyPad className="anim-floaty absolute right-[8%] bottom-[9%] w-28 md:w-44 opacity-85" style={{ ["--fr" as string]: "4deg", animationDelay: "-1s" }} />

      {/* canneti */}
      <Reeds className="absolute left-0 bottom-0 w-44 md:w-64 h-44 md:h-72 opacity-90" />
      <Reeds className="absolute right-0 bottom-0 w-44 md:w-64 h-44 md:h-72 opacity-90 -scale-x-100" seed={3} />

      {/* occhi nel buio */}
      <EyesPair className="left-[9%] bottom-[26%]" delay="0.4s" />
      <EyesPair className="right-[13%] bottom-[30%]" delay="2.2s" />
      <EyesPair className="left-[21%] bottom-[18%]" delay="3.6s" />

      <Fireflies count={8} seed={2} />

      {/* increspature */}
      {ripples.map((r) => (
        <span key={r.id} className="ripple-ring" style={{ left: r.x, top: r.y }} />
      ))}
      {/* bolle di gracidio */}
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="croak-bubble text-lime"
          style={{ left: b.x, top: b.y, fontSize: `${b.size}rem` }}
        >
          {b.text}
        </span>
      ))}

      {/* contenuto */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-10 min-h-[100svh] flex flex-col justify-end py-24 md:py-28">
        <div>
          <p className="font-display italic text-xl md:text-3xl text-water/90 mb-1 md:mb-2">Atlante delle</p>
          <h1 className="font-display italic font-black leading-[0.82] text-foam text-[clamp(5rem,21vw,16.5rem)] tracking-tight">
            {TITLE.map((ch, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => letterClick(e, i)}
                className={`letter-btn inline-block will-change-transform focus:outline-none focus-visible:text-lime ${squishIdx === i ? "anim-squish" : ""}`}
                aria-label={`Lettera ${ch}: premi per un gracidio`}
              >
                {ch}
              </button>
            ))}
          </h1>

          <div className="mt-8 md:mt-10 flex flex-wrap items-end justify-between gap-8">
            <p className="max-w-md text-foam/65 text-base md:text-lg leading-relaxed">
              Settemila specie, un solo superpotere: trasformare l'acqua in voce.
              Clicca sullo stagno, sfiora le lettere, ascolta il coro.
            </p>
            <button
              type="button"
              onClick={croakButton}
              className="group flex items-center gap-4 border border-lime/40 hover:border-lime bg-lime/[0.07] hover:bg-lime/15 transition-colors px-6 py-4 text-lime font-mono text-xs md:text-sm tracking-[0.18em] uppercase"
            >
              <span className="w-9 h-9 rounded-full border border-lime/50 flex items-center justify-center group-hover:bg-lime group-hover:text-ink transition-colors">
                <IconSound playing={croaking} />
              </span>
              Ascolta il gracidio
            </button>
          </div>
        </div>
      </div>

      {/* indicatore scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foam/45">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">scendi nello stagno</span>
        <svg viewBox="0 0 24 24" className="w-4 h-4 anim-bob" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
