import { ReactNode, useEffect, useRef, useState } from "react";

/* ---------- hooks ---------- */
export function useInView<T extends HTMLElement>(threshold = 0.2, once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.unobserve(e.target);
          } else if (!once) setInView(false);
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return { ref, inView };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

/* ---------- reveal ---------- */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      className={`rv ${inView ? "in" : ""} ${className}`}
      style={{ ["--rvd" as string]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- testata di sezione ---------- */
export function SectionHead({
  index,
  kicker,
  title,
  sub,
}: {
  index: string;
  kicker: string;
  title: string;
  sub?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`rv ${inView ? "in" : ""} mb-12 md:mb-16`}>
      <p className="font-mono text-[11px] md:text-xs tracking-[0.28em] uppercase text-lime/80 mb-4">
        <span className="text-foam/40">{index} —</span> {kicker}
      </p>
      <h2 className="font-display italic font-black text-foam leading-[0.98] text-[clamp(2.4rem,6vw,4.6rem)]">
        <span className="mask-line">
          <span>{title}</span>
        </span>
      </h2>
      {sub && (
        <p className="mt-5 max-w-xl text-foam/65 text-base md:text-lg leading-relaxed">{sub}</p>
      )}
    </div>
  );
}

/* ---------- contatore ---------- */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString("it-IT")}
      <span className="text-lime">{suffix}</span>
    </span>
  );
}

/* ---------- lucciole ---------- */
export function Fireflies({ count = 7, seed = 1 }: { count?: number; seed?: number }) {
  const flies = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 137 + seed * 53) % 100}%`,
    top: `${(i * 89 + seed * 31) % 100}%`,
    delay: `${(i * 1.7 + seed) % 9}s`,
    dur: `${7 + ((i * 3 + seed) % 6)}s`,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {flies.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={{ left: f.left, top: f.top, animationDelay: f.delay, animationDuration: f.dur }}
        />
      ))}
    </div>
  );
}

/* ---------- logo rana ---------- */
export function FrogLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <ellipse cx="32" cy="40" rx="22" ry="17" fill="#2e4a2a" />
      <circle cx="19" cy="21" r="10" fill="#2e4a2a" />
      <circle cx="45" cy="21" r="10" fill="#2e4a2a" />
      <circle cx="19" cy="21" r="5.4" fill="#b7e24a" />
      <circle cx="45" cy="21" r="5.4" fill="#b7e24a" />
      <circle cx="19" cy="21.5" r="2.3" fill="#0c1410" />
      <circle cx="45" cy="21.5" r="2.3" fill="#0c1410" />
      <path d="M24,44 Q32,50 40,44" stroke="#0c1410" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- icone ---------- */
export function IconSound({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <span className="flex items-end gap-[3px] h-4" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="eq-bar w-[3px] rounded-sm bg-current"
            style={{ height: "100%", animationDelay: `${i * 0.12}s`, animationDuration: `${0.42 + (i % 3) * 0.14}s` }}
          />
        ))}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/* ---------- marquee ---------- */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display italic font-semibold text-lg md:text-xl px-5 md:px-8 text-foam/70">
            {it}
          </span>
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-lime/70" fill="currentColor" aria-hidden>
            <path d="M6 0l1.6 4.4L12 6 7.6 7.6 6 12 4.4 7.6 0 6l4.4-1.6z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee overflow-hidden py-4">
      <div className={`marquee-track ${reverse ? "rev" : ""}`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
