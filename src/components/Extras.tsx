import { CURIOSITA, NAV } from "../lib/data";
import { FrogLogo, Reveal, SectionHead } from "./ui";

const TILTS = ["-2.5deg", "1.8deg", "-1.2deg", "2.6deg", "-2deg", "1.4deg"];

export function Curiosities() {
  return (
    <section id="curiosita" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHead
          index="08"
          kicker="Marginalia"
          title="Sei note a margine del diario"
          sub="Le cose che si scoprono solo restando fermi a lungo sull'argine: appunti veri, nessun abbellimento."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9">
          {CURIOSITA.map((c, i) => (
            <Reveal key={c.title} delay={(i % 3) * 100}>
              <article
                className="postcard paper relative text-ink p-6 md:p-7 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]"
                style={{ transform: `rotate(${TILTS[i % TILTS.length]})` }}
              >
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-lime/75 rotate-[-3deg] shadow-sm"
                  aria-hidden
                />
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-leaf">
                  Appunto n. {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display italic font-black text-[1.45rem] leading-tight">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-leaf/50 bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-10 py-14 md:py-16">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3">
              <FrogLogo className="w-10 h-10" />
              <p className="font-display italic font-black text-2xl text-foam">
                Atlante <span className="text-lime">delle</span> Rane
              </p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-foam/55">
              Un diario di campo per ricordare che ogni stagno è un teatro: basta il buio giusto,
              e il sipario d'acqua si alza da solo.
            </p>
            <p className="mt-6 font-mono text-[11px] tracking-[0.2em] uppercase text-foam/35">
              45°27′N · 9°11′E — registrato al tramonto
            </p>
          </div>

          <nav aria-label="Indice del diario">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-lime/80 mb-4">Indice</p>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm text-foam/65 hover:text-lime transition-colors">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-lime/80 mb-4">Fonti di campo</p>
            <ul className="flex flex-col gap-2 text-sm text-foam/65">
              <li><a className="hover:text-lime transition-colors" href="https://www.iucnredlist.org" target="_blank" rel="noreferrer">IUCN Red List ↗</a></li>
              <li><a className="hover:text-lime transition-colors" href="https://amphibiaweb.org" target="_blank" rel="noreferrer">AmphibiaWeb ↗</a></li>
              <li><a className="hover:text-lime transition-colors" href="https://www.inaturalist.org" target="_blank" rel="noreferrer">iNaturalist ↗</a></li>
              <li><a className="hover:text-lime transition-colors" href="https://www.amphibianark.org" target="_blank" rel="noreferrer">Amphibian Ark ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-leaf/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-mono text-[11px] text-foam/35">
            © 2026 Atlante delle Rane · i gracidii sono sintetizzati, la preoccupazione è reale
          </p>
          <p className="font-mono text-[11px] text-foam/35 italic">
            «brekekekéx koáx koáx» — Aristofane, 405 a.C.
          </p>
        </div>
      </div>
    </footer>
  );
}
