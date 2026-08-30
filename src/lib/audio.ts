/* Gracidii sintetizzati con Web Audio — nessun file esterno. */

export interface CallConfig {
  id: string;
  base: number; // frequenza base (Hz)
  pulses: number; // impulsi per singola emissione
  pulseDur: number; // durata impulso (s)
  gap: number; // pausa tra impulsi (s)
  repeats: number; // ripetizioni
  wobbleHz: number; // modulazione di frequenza
  wobbleDepth: number; // profondità modulazione (Hz)
  filter: number; // lowpass (Hz)
  type: OscillatorType;
  slide?: number; // scivolamento di frequenza entro l'impulso
  gain?: number; // volume relativo
  noise?: number; // componente "gracidata" 0..1
}

export const CALLS: Record<string, CallConfig> = {
  temporaria: {
    id: "temporaria", base: 132, pulses: 2, pulseDur: 0.17, gap: 0.11, repeats: 2,
    wobbleHz: 17, wobbleDepth: 24, filter: 950, type: "sawtooth", noise: 0.25, gain: 0.8,
  },
  hyla: {
    id: "hyla", base: 430, pulses: 13, pulseDur: 0.042, gap: 0.022, repeats: 2,
    wobbleHz: 26, wobbleDepth: 34, filter: 1900, type: "square", noise: 0.15, gain: 0.4,
  },
  esculentus: {
    id: "esculentus", base: 205, pulses: 3, pulseDur: 0.2, gap: 0.15, repeats: 2,
    wobbleHz: 13, wobbleDepth: 42, filter: 1150, type: "sawtooth", slide: -30, noise: 0.3, gain: 0.7,
  },
  dalmatina: {
    id: "dalmatina", base: 355, pulses: 1, pulseDur: 0.48, gap: 0.2, repeats: 2,
    wobbleHz: 8, wobbleDepth: 16, filter: 1500, type: "triangle", slide: -190, noise: 0.1, gain: 0.75,
  },
  agalychnis: {
    id: "agalychnis", base: 940, pulses: 1, pulseDur: 0.12, gap: 0.16, repeats: 3,
    wobbleHz: 40, wobbleDepth: 90, filter: 2600, type: "square", noise: 0.08, gain: 0.3,
  },
  dendrobates: {
    id: "dendrobates", base: 1280, pulses: 10, pulseDur: 0.03, gap: 0.016, repeats: 2,
    wobbleHz: 55, wobbleDepth: 140, filter: 3000, type: "square", noise: 0.1, gain: 0.22,
  },
  litoria: {
    id: "litoria", base: 265, pulses: 1, pulseDur: 0.34, gap: 0.22, repeats: 3,
    wobbleHz: 11, wobbleDepth: 26, filter: 1300, type: "sawtooth", slide: -95, noise: 0.35, gain: 0.75,
  },
  phyllobates: {
    id: "phyllobates", base: 1720, pulses: 16, pulseDur: 0.034, gap: 0.012, repeats: 2,
    wobbleHz: 60, wobbleDepth: 180, filter: 3400, type: "square", noise: 0.06, gain: 0.18,
  },
};

let ctx: AudioContext | null = null;
let noiseBuf: AudioBuffer | null = null;
let currentStop: (() => void) | null = null;

function ensureCtx(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function getNoise(ac: AudioContext): AudioBuffer {
  if (!noiseBuf) {
    noiseBuf = ac.createBuffer(1, ac.sampleRate * 0.5, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuf;
}

export function callDuration(cfg: CallConfig): number {
  const one = cfg.pulses * (cfg.pulseDur + cfg.gap);
  return Math.round((cfg.repeats * (one + cfg.gap * 1.7) + 0.15) * 1000);
}

function schedulePulse(ac: AudioContext, dest: AudioNode, cfg: CallConfig, t: number) {
  const dur = cfg.pulseDur;
  const osc = ac.createOscillator();
  osc.type = cfg.type;
  const f0 = cfg.base;
  const f1 = cfg.base + (cfg.slide ?? 0);
  osc.frequency.setValueAtTime(f0, t);
  osc.frequency.linearRampToValueAtTime(f1, t + dur);

  // trillo: LFO sulla frequenza
  const lfo = ac.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = cfg.wobbleHz;
  const lfoGain = ac.createGain();
  lfoGain.gain.value = cfg.wobbleDepth;
  lfo.connect(lfoGain).connect(osc.frequency);

  const filt = ac.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = cfg.filter;
  filt.Q.value = 4;

  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(0.5, t + Math.min(0.028, dur * 0.25));
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);

  osc.connect(filt).connect(env).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
  lfo.start(t);
  lfo.stop(t + dur + 0.02);

  // componente rumorosa "cra"
  if (cfg.noise && cfg.noise > 0) {
    const src = ac.createBufferSource();
    src.buffer = getNoise(ac);
    const bp = ac.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = cfg.base * 2.4;
    bp.Q.value = 1.1;
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.0001, t);
    ng.gain.linearRampToValueAtTime(0.5 * cfg.noise, t + 0.015);
    ng.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(bp).connect(ng).connect(dest);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}

/** Suona un gracidio; restituisce la durata in ms. Interrompe quello precedente. */
export function playCall(cfg: CallConfig): number {
  const ac = ensureCtx();
  currentStop?.();

  const master = ac.createGain();
  master.gain.value = cfg.gain ?? 0.7;
  master.connect(ac.destination);

  const t0 = ac.currentTime + 0.04;
  let t = t0;
  for (let r = 0; r < cfg.repeats; r++) {
    for (let p = 0; p < cfg.pulses; p++) {
      schedulePulse(ac, master, cfg, t);
      t += cfg.pulseDur + cfg.gap;
    }
    t += cfg.gap * 1.7;
  }
  const end = t + 0.12;

  const stop = () => {
    try {
      master.gain.cancelScheduledValues(ac.currentTime);
      master.gain.setTargetAtTime(0.0001, ac.currentTime, 0.02);
      window.setTimeout(() => master.disconnect(), 250);
    } catch {
      /* noop */
    }
  };
  currentStop = stop;
  window.setTimeout(() => {
    if (currentStop === stop) {
      master.disconnect();
      currentStop = null;
    }
  }, (end - ac.currentTime) * 1000 + 200);

  return Math.round((end - t0) * 1000);
}

/** Coro: tre voci sovrapposte con leggeri sfasamenti. */
export function playChorus(): number {
  const a = playCall(CALLS.esculentus);
  window.setTimeout(() => playCall(CALLS.temporaria), 260);
  window.setTimeout(() => playCall(CALLS.hyla), 620);
  window.setTimeout(() => playCall(CALLS.temporaria), 1450);
  return a + 1700;
}

export function stopAll() {
  currentStop?.();
  currentStop = null;
}
