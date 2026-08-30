import { useEffect, useState } from "react";
import PondHero from "./components/PondHero";
import Anatomy from "./components/Anatomy";
import Metamorphosis from "./components/Metamorphosis";
import Species from "./components/Species";
import Archive from "./components/Archive";
import SoundLab from "./components/SoundLab";
import Conservation, { Numbers } from "./components/Conservation";
import Orders from "./components/Orders";
import { Curiosities, Footer } from "./components/Extras";
import { FrogLogo, Marquee } from "./components/ui";
import { MARQUEE, NAV } from "./lib/data";

function useScrollUI() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setScrolled(h.scrollTop > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { progress, scrolled };
}

export default function App() {
  const { progress, scrolled } = useScrollUI();

  return (
    <div className="grain relative bg-ink text-foam font-body antialiased">
      {/* barra di avanzamento */}
      <div
        className="fixed top-0 left-0 z-[90] h-[3px] bg-lime"
        style={{ width: `${progress}%`, boxShadow: "0 0 12px rgba(183,226,74,0.6)" }}
        aria-hidden
      />

      {/* navigazione */}
      <header
        className={`fixed top-0 inset-x-0 z-[70] transition-all duration-500 ${
          scrolled ? "bg-ink/90 backdrop-blur-md border-b border-leaf/50 py-2.5" : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10 flex items-center justify-between gap-4">
          <a href="#stagno" className="flex items-center gap-2.5 group" aria-label="Torna all'inizio">
            <FrogLogo className="w-8 h-8 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="font-display italic font-black text-lg leading-none text-foam">
              Atlante <span className="text-lime">delle</span> Rane
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-6" aria-label="Sezioni">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-mono text-[11px] tracking-[0.18em] uppercase text-foam/55 hover:text-lime transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-lime hover:after:w-full after:transition-all after:duration-300"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.2em] uppercase border border-leaf/70 text-foam/50 px-3 py-1.5">
            vol. I · <span className="text-lime">primavera</span>
          </span>
        </div>
      </header>

      <main>
        <div id="stagno">
          <PondHero />
        </div>

        <div className="marquee border-y border-leaf/40 bg-pond/80" aria-hidden={false}>
          <Marquee items={MARQUEE} />
        </div>

        <Anatomy />
        <Metamorphosis />
        <Species />
        <Archive />
        <SoundLab />
        <Numbers />
        <Conservation />
        <Orders />

        <div className="marquee border-y border-leaf/40 bg-pond/80">
          <Marquee items={[...MARQUEE].reverse()} reverse />
        </div>

        <Curiosities />
      </main>

      <Footer />
    </div>
  );
}
