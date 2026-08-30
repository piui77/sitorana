/*
 * Tavole d'atlante: ritratti SVG generati nel sito, senza alcuna risorsa esterna.
 * Ogni specie ottiene una scena ambientale e una livrea deterministiche
 * (seme = nome latino), con dettagli anatomici coerenti con la famiglia:
 * pupille orizzontali per i rospi, verticali per le raganelle, dischi adesivi
 * per le arboricole, zampe palmate per le acquatiche.
 */

export type Pattern = "plain" | "spotted" | "mottled" | "striped";
export type Shape = "round" | "wide" | "slim";
export type Scene = "palude" | "foresta" | "torrente" | "savana" | "giardino";

export interface PortraitSpec {
  latin: string;
  family: string;
  c1: string; // colore base della livrea
  c2: string; // colore d'accento (occhi, macchie, striature)
  pattern: Pattern;
  shape: Shape;
  scene?: Scene;
}

/* ---------- utilità deterministiche ---------- */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, v));
  const r = ch((n >> 16) + amt);
  const g = ch(((n >> 8) & 0xff) + amt);
  const b = ch((n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

/* ---------- tassonomia → dettagli ---------- */
const ARBOREALI = new Set([
  "Hylidae", "Dendrobatidae", "Mantellidae", "Rhacophoridae", "Centrolenidae",
  "Hyperoliidae", "Eleutherodactylidae", "Phyllomedusidae", "Microhylidae",
]);
const ACQUATICHE = new Set(["Ranidae", "Pipidae", "Myobatrachidae", "Pelodytidae"]);

const SHAPES = {
  round: { rx: 112, ry: 84, hx: 288, hy: 148, hr: 55, er: 18, pupil: "h" as const },
  wide: { rx: 130, ry: 76, hx: 298, hy: 154, hr: 60, er: 20, pupil: "h" as const },
  slim: { rx: 140, ry: 56, hx: 304, hy: 164, hr: 44, er: 15, pupil: "v" as const },
};

export function sceneFor(region: string, family: string): Scene {
  if (family === "Pipidae" || family === "Ranidae" || family === "Leptodactylidae") return "palude";
  if (family === "Centrolenidae" || family === "Cycloramphidae" || family === "Rhacophoridae") return "torrente";
  if (family === "Bufonidae" || family === "Myobatrachidae") return "giardino";
  switch (region) {
    case "Italia": return "palude";
    case "Africa": return "savana";
    case "Oceania": return "giardino";
    default: return "foresta";
  }
}

/* ---------- scene ambientali ---------- */
function sceneBg(scene: Scene, rnd: () => number, uid: string): string {
  const out: string[] = [];
  const W = 480;

  if (scene === "palude") {
    out.push(`<rect width="480" height="360" fill="url(#${uid}-bg)"/>`);
    out.push(`<rect y="246" width="480" height="114" fill="url(#${uid}-water)"/>`);
    for (let i = 0; i < 6; i++) {
      const cx = 40 + rnd() * 400, cy = 258 + rnd() * 88, rx = 26 + rnd() * 70;
      out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${3 + rnd() * 5}" fill="none" stroke="#7fc8c8" stroke-opacity="${0.06 + rnd() * 0.12}" stroke-width="1.6"/>`);
    }
    for (let i = 0; i < 8; i++) {
      const x = 8 + rnd() * 464, h = 120 + rnd() * 190, lean = (rnd() - 0.5) * 30;
      out.push(`<path d="M${x},360 C${x + lean * 0.3},${360 - h * 0.5} ${x + lean},${360 - h * 0.85} ${x + lean * 1.2},${360 - h}" stroke="#1c3a22" stroke-width="${2.5 + rnd() * 2.5}" fill="none" stroke-linecap="round" opacity="${0.55 + rnd() * 0.35}"/>`);
      if (rnd() > 0.55) {
        out.push(`<ellipse cx="${x + lean * 1.2}" cy="${360 - h - 9}" rx="4.5" ry="12" fill="#2a4a2a" opacity="0.8"/>`);
      }
    }
    out.push(`<circle cx="392" cy="66" r="120" fill="url(#${uid}-moon)"/>`);
  } else if (scene === "foresta") {
    out.push(`<rect width="480" height="360" fill="url(#${uid}-bg)"/>`);
    for (let i = 0; i < 4; i++) {
      const cx = rnd() * W, cy = 30 + rnd() * 120, rx = 90 + rnd() * 90, ry = 26 + rnd() * 26, rot = (rnd() - 0.5) * 50;
      out.push(`<g transform="rotate(${rot} ${cx} ${cy})" opacity="${0.4 + rnd() * 0.25}">`);
      out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${i % 2 ? "#122816" : "#0f2413"}"/>`);
      out.push(`<path d="M${cx - rx},${cy} L${cx + rx},${cy}" stroke="#0a1a0e" stroke-width="2" opacity="0.6"/>`);
      out.push(`</g>`);
    }
    for (let i = 0; i < 12; i++) {
      const cx = rnd() * W, cy = rnd() * 220, r = 6 + rnd() * 30;
      out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${i % 3 ? "#b7e24a" : "#7fc8c8"}" opacity="${0.03 + rnd() * 0.07}"/>`);
    }
    out.push(`<rect x="-60" y="-40" width="150" height="520" fill="#e9f2dc" opacity="0.03" transform="rotate(24 20 220)"/>`);
  } else if (scene === "torrente") {
    out.push(`<rect width="480" height="360" fill="url(#${uid}-bg)"/>`);
    for (let i = 0; i < 5; i++) {
      const cx = 30 + rnd() * 420, cy = 290 + rnd() * 55, rx = 34 + rnd() * 60, ry = 14 + rnd() * 14;
      out.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${i % 2 ? "#16303a" : "#12262e"}"/>`);
    }
    for (let i = 0; i < 3; i++) {
      out.push(`<rect x="${60 + i * 140}" y="-40" width="46" height="520" fill="#e9f2dc" opacity="0.035" transform="rotate(18 ${80 + i * 140} 180)"/>`);
    }
    for (let i = 0; i < 4; i++) {
      const x = 40 + rnd() * 380, y = 268 + rnd() * 70;
      out.push(`<path d="M${x},${y} q${14 + rnd() * 20},-${10 + rnd() * 12} ${34 + rnd() * 30},0" fill="none" stroke="#7fc8c8" stroke-opacity="${0.1 + rnd() * 0.1}" stroke-width="2" stroke-linecap="round"/>`);
    }
  } else if (scene === "savana") {
    out.push(`<rect width="480" height="360" fill="url(#${uid}-bg)"/>`);
    out.push(`<circle cx="96" cy="74" r="150" fill="url(#${uid}-moon)"/>`);
    for (let i = 0; i < 30; i++) {
      const x = rnd() * W, h = 50 + rnd() * 130, lean = (rnd() - 0.5) * 44;
      out.push(`<path d="M${x},360 Q${x + lean * 0.4},${360 - h * 0.6} ${x + lean},${360 - h}" stroke="${i % 2 ? "#4a3818" : "#5a4820"}" stroke-width="${1.6 + rnd() * 2}" fill="none" stroke-linecap="round" opacity="${0.5 + rnd() * 0.4}"/>`);
    }
  } else {
    // giardino
    out.push(`<rect width="480" height="360" fill="url(#${uid}-bg)"/>`);
    for (let i = 0; i < 6; i++) {
      const cx = 20 + i * 84 + rnd() * 30, cy = 120 + rnd() * 60, r = 56 + rnd() * 44;
      out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#142a18" opacity="${0.4 + rnd() * 0.2}"/>`);
    }
    for (let i = 0; i < 10; i++) {
      const cx = rnd() * W, cy = rnd() * 240, r = 5 + rnd() * 22;
      out.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${i % 4 ? "#f0a32b" : "#b7e24a"}" opacity="${0.03 + rnd() * 0.05}"/>`);
    }
    out.push(`<rect y="292" width="480" height="68" fill="#0e1c12" opacity="0.7"/>`);
  }
  return out.join("");
}

/* ---------- la tavola ---------- */
export function portraitSvg(sp: PortraitSpec): string {
  const seed = hashStr(sp.latin);
  const rnd = mulberry32(seed);
  const uid = `p${seed.toString(36)}`;
  const S = SHAPES[sp.shape];
  const scene = sp.scene ?? sceneFor("", sp.family);

  const dark = shade(sp.c1, -58);
  const light = shade(sp.c1, 44);
  const mid = shade(sp.c1, 14);

  const bodyCx = 240, bodyCy = 218;
  const pads = ARBOREALI.has(sp.family);
  const webbed = ACQUATICHE.has(sp.family);
  const warty = sp.family === "Bufonidae";

  const parts: string[] = [];

  /* defs */
  parts.push(`<defs>`);
  parts.push(
    `<linearGradient id="${uid}-bg" x1="0" y1="0" x2="0" y2="1">` +
      (scene === "savana"
        ? `<stop offset="0" stop-color="#2e2210"/><stop offset="0.55" stop-color="#241a0c"/><stop offset="1" stop-color="#150f07"/>`
        : scene === "torrente"
          ? `<stop offset="0" stop-color="#0e222a"/><stop offset="0.6" stop-color="#102a30"/><stop offset="1" stop-color="#0a1a1e"/>`
          : scene === "giardino"
            ? `<stop offset="0" stop-color="#101f14"/><stop offset="0.6" stop-color="#152917"/><stop offset="1" stop-color="#0c1810"/>`
            : `<stop offset="0" stop-color="#0e2118"/><stop offset="0.55" stop-color="#122b1c"/><stop offset="1" stop-color="#0b1a11"/>`) +
    `</linearGradient>`
  );
  parts.push(
    `<linearGradient id="${uid}-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16382a"/><stop offset="1" stop-color="#0b1d14"/></linearGradient>`
  );
  parts.push(
    `<radialGradient id="${uid}-moon" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="${scene === "savana" ? "#f0a32b" : "#d8f57e"}" stop-opacity="0.14"/><stop offset="1" stop-color="${scene === "savana" ? "#f0a32b" : "#d8f57e"}" stop-opacity="0"/></radialGradient>`
  );
  parts.push(
    `<radialGradient id="${uid}-body" cx="0.36" cy="0.28" r="0.95"><stop offset="0" stop-color="${light}"/><stop offset="0.45" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></radialGradient>`
  );
  parts.push(
    `<radialGradient id="${uid}-head" cx="0.38" cy="0.3" r="0.95"><stop offset="0" stop-color="${light}"/><stop offset="0.5" stop-color="${sp.c1}"/><stop offset="1" stop-color="${dark}"/></radialGradient>`
  );
  parts.push(
    `<radialGradient id="${uid}-vig" cx="0.5" cy="0.44" r="0.72"><stop offset="0" stop-color="#050a07" stop-opacity="0"/><stop offset="0.75" stop-color="#050a07" stop-opacity="0"/><stop offset="1" stop-color="#050a07" stop-opacity="0.55"/></radialGradient>`
  );
  parts.push(
    `<clipPath id="${uid}-clip"><ellipse cx="${bodyCx}" cy="${bodyCy}" rx="${S.rx}" ry="${S.ry}"/><circle cx="${S.hx}" cy="${S.hy}" r="${S.hr}"/></clipPath>`
  );
  parts.push(
    `<filter id="${uid}-grain" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.9 0.9 0 0"/></filter>`
  );
  parts.push(`<filter id="${uid}-blur"><feGaussianBlur stdDeviation="7"/></filter>`);
  parts.push(`</defs>`);

  /* sfondo */
  parts.push(sceneBg(scene, rnd, uid));

  /* ombra a terra */
  parts.push(`<ellipse cx="238" cy="${bodyCy + S.ry + 16}" rx="${S.rx * 1.05}" ry="15" fill="#000" opacity="0.42"/>`);

  /* zampa posteriore ripiegata */
  const legX = bodyCx - S.rx * 0.72, legY = bodyCy + S.ry * 0.16;
  parts.push(
    `<ellipse cx="${legX}" cy="${legY}" rx="${S.rx * 0.48}" ry="${S.ry * 0.52}" transform="rotate(-18 ${legX} ${legY})" fill="${shade(sp.c1, -34)}" stroke="${dark}" stroke-width="2.5"/>`
  );
  /* piede posteriore con eventuali membrane */
  const fx = bodyCx - S.rx * 0.98, fy = bodyCy + S.ry * 0.72;
  if (webbed) {
    parts.push(`<path d="M${fx + 8},${fy - 6} L${fx - 40},${fy + 16} L${fx - 26},${fy + 30} L${fx - 6},${fy + 34} L${fx + 10},${fy + 26} Z" fill="${shade(sp.c1, -44)}" opacity="0.85"/>`);
  }
  parts.push(
    `<path d="M${fx + 6},${fy - 4} L${fx - 42},${fy + 14} M${fx + 8},${fy + 2} L${fx - 30},${fy + 30} M${fx + 10},${fy + 8} L${fx - 6},${fy + 34}" stroke="${shade(sp.c1, -40)}" stroke-width="7" stroke-linecap="round" fill="none"/>`
  );

  /* corpo + testa */
  parts.push(`<g>`);
  parts.push(`<ellipse cx="${bodyCx}" cy="${bodyCy}" rx="${S.rx}" ry="${S.ry}" fill="url(#${uid}-body)" stroke="${dark}" stroke-width="3"/>`);
  parts.push(`<circle cx="${S.hx}" cy="${S.hy}" r="${S.hr}" fill="url(#${uid}-head)" stroke="${dark}" stroke-width="3"/>`);

  /* livrea (ritagliata sulla sagoma) */
  parts.push(`<g clip-path="url(#${uid}-clip)">`);
  parts.push(`<ellipse cx="${bodyCx + 10}" cy="${bodyCy + S.ry * 0.42}" rx="${S.rx * 0.8}" ry="${S.ry * 0.5}" fill="${light}" opacity="0.22"/>`);
  if (sp.pattern === "spotted") {
    for (let i = 0; i < 26; i++) {
      const x = bodyCx + (rnd() - 0.55) * S.rx * 1.9;
      const y = bodyCy + (rnd() - 0.5) * S.ry * 1.8;
      parts.push(`<circle cx="${x}" cy="${y}" r="${3.5 + rnd() * 9}" fill="${i % 3 ? dark : sp.c2}" opacity="${0.28 + rnd() * 0.28}"/>`);
    }
  } else if (sp.pattern === "mottled") {
    for (let i = 0; i < 15; i++) {
      const x = bodyCx + (rnd() - 0.55) * S.rx * 1.9;
      const y = bodyCy + (rnd() - 0.5) * S.ry * 1.8;
      parts.push(`<ellipse cx="${x}" cy="${y}" rx="${12 + rnd() * 22}" ry="${9 + rnd() * 16}" transform="rotate(${(rnd() - 0.5) * 70} ${x} ${y})" fill="${i % 2 ? sp.c2 : dark}" opacity="${0.16 + rnd() * 0.16}"/>`);
    }
  } else if (sp.pattern === "striped") {
    for (let i = 0; i < 6; i++) {
      const x = bodyCx - S.rx * 0.75 + i * (S.rx * 0.3) + rnd() * 12;
      parts.push(`<path d="M${x},${bodyCy - S.ry} Q${x - 14},${bodyCy} ${x + 8},${bodyCy + S.ry}" stroke="${i % 2 ? sp.c2 : dark}" stroke-width="${6 + (i % 3) * 4}" fill="none" opacity="${0.3 + rnd() * 0.2}" stroke-linecap="round"/>`);
    }
  } else {
    parts.push(`<path d="M${bodyCx - S.rx * 0.8},${bodyCy - S.ry * 0.5} Q${bodyCx},${bodyCy - S.ry * 0.95} ${S.hx - S.hr * 0.4},${S.hy - S.hr * 0.7}" stroke="${light}" stroke-width="4" fill="none" opacity="0.35" stroke-linecap="round"/>`);
  }
  if (warty) {
    for (let i = 0; i < 34; i++) {
      const x = bodyCx + (rnd() - 0.55) * S.rx * 1.85;
      const y = bodyCy + (rnd() - 0.5) * S.ry * 1.75;
      parts.push(`<circle cx="${x}" cy="${y}" r="${1.4 + rnd() * 2.2}" fill="${dark}" opacity="${0.35 + rnd() * 0.3}"/>`);
    }
  }
  /* grana della pelle */
  parts.push(`<rect x="${bodyCx - S.rx - 10}" y="${S.hy - S.hr - 10}" width="${S.rx * 2 + 20}" height="${bodyCy + S.ry - S.hy + S.hr + 20}" filter="url(#${uid}-grain)" opacity="0.16"/>`);
  parts.push(`</g>`);

  /* riflesso sul dorso */
  parts.push(
    `<path d="M${bodyCx - S.rx * 0.55},${bodyCy - S.ry * 0.72} Q${bodyCx},${bodyCy - S.ry * 1.02} ${bodyCx + S.rx * 0.5},${bodyCy - S.ry * 0.66}" stroke="#f4f7ea" stroke-opacity="0.16" stroke-width="9" fill="none" stroke-linecap="round"/>`
  );

  /* zampa anteriore */
  const ax = S.hx - 4, ay = S.hy + S.hr * 0.62;
  parts.push(`<path d="M${ax},${ay} Q${ax + 10},${ay + 34} ${ax + 22},${bodyCy + S.ry * 0.62}" stroke="${shade(sp.c1, -30)}" stroke-width="9" fill="none" stroke-linecap="round"/>`);
  const tx = ax + 22, ty = bodyCy + S.ry * 0.62;
  for (let i = 0; i < 3; i++) {
    const ang = -0.5 + i * 0.5;
    const exx = tx + Math.sin(ang) * 26 + 8, eyy = ty + Math.cos(ang) * 16 + 6;
    parts.push(`<path d="M${tx},${ty} L${exx},${eyy}" stroke="${shade(sp.c1, -30)}" stroke-width="5.5" stroke-linecap="round"/>`);
    if (pads) parts.push(`<circle cx="${exx + 1.5}" cy="${eyy + 1.5}" r="5.4" fill="${light}" stroke="${dark}" stroke-width="1.6"/>`);
  }

  /* timpano */
  parts.push(`<circle cx="${S.hx - S.hr * 0.52}" cy="${S.hy + S.hr * 0.16}" r="${S.hr * 0.26}" fill="none" stroke="${dark}" stroke-width="2.4" opacity="0.6"/>`);

  /* occhi */
  const e1 = { x: S.hx - S.hr * 0.36, y: S.hy - S.hr * 0.68 };
  const e2 = { x: S.hx + S.hr * 0.34, y: S.hy - S.hr * 0.56 };
  for (const e of [e1, e2]) {
    parts.push(`<circle cx="${e.x}" cy="${e.y}" r="${S.er}" fill="${sp.c2}" stroke="${dark}" stroke-width="2.6"/>`);
    parts.push(`<circle cx="${e.x}" cy="${e.y}" r="${S.er * 0.82}" fill="${shade(sp.c2, -30)}"/>`);
    if (S.pupil === "v") {
      parts.push(`<ellipse cx="${e.x}" cy="${e.y}" rx="${S.er * 0.22}" ry="${S.er * 0.62}" fill="#0c1410"/>`);
    } else {
      parts.push(`<ellipse cx="${e.x}" cy="${e.y}" rx="${S.er * 0.6}" ry="${S.er * 0.22}" fill="#0c1410"/>`);
    }
    parts.push(`<circle cx="${e.x - S.er * 0.3}" cy="${e.y - S.er * 0.34}" r="${S.er * 0.18}" fill="#f4f7ea" opacity="0.9"/>`);
  }

  /* narici e bocca */
  parts.push(`<circle cx="${S.hx + S.hr * 0.5}" cy="${S.hy - S.hr * 0.08}" r="2.3" fill="${dark}"/>`);
  parts.push(`<circle cx="${S.hx + S.hr * 0.78}" cy="${S.hy + S.hr * 0.02}" r="2.3" fill="${dark}"/>`);
  parts.push(
    `<path d="M${S.hx + S.hr * 0.92},${S.hy + S.hr * 0.3} Q${S.hx + S.hr * 0.2},${S.hy + S.hr * 0.58} ${S.hx - S.hr * 0.55},${S.hy + S.hr * 0.5}" stroke="${dark}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`
  );

  /* vignettatura + controluce */
  parts.push(`<rect width="480" height="360" fill="url(#${uid}-vig)"/>`);

  /* foglie in primo piano sfuocate (profondità di campo) */
  parts.push(
    `<g filter="url(#${uid}-blur)" opacity="0.75">` +
      `<ellipse cx="26" cy="342" rx="120" ry="42" transform="rotate(-16 26 342)" fill="#08120b"/>` +
      `<ellipse cx="462" cy="18" rx="110" ry="38" transform="rotate(-14 462 18)" fill="#08120b"/>` +
    `</g>`
  );

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" role="img">${parts.join("")}</svg>`;
}

/* ---------- data URI memoizzata ---------- */
const uriCache = new Map<string, string>();
export function portraitSrc(sp: PortraitSpec): string {
  let uri = uriCache.get(sp.latin);
  if (!uri) {
    uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(portraitSvg(sp))}`;
    uriCache.set(sp.latin, uri);
  }
  return uri;
}
