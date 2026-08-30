export interface Species {
  id: string;
  code: string;
  name: string;
  latin: string;
  place: string;
  size: string;
  habitat: string;
  toxicity: number; // 0..5
  callId: string;
  callLabel: string;
  note: string;
  img: string;
  accent: string;
}

export const SPECIES: Species[] = [
  {
    id: "hyla", code: "SPC-01", name: "Raganella italiana", latin: "Hyla intermedia",
    place: "Italia · stagni, fossi, risaie", size: "4–5 cm", habitat: "Zone umide di pianura",
    toxicity: 0, callId: "hyla", callLabel: "Raglio metallico",
    note: "La voce delle sere d'estate in pianura Padana: un crepitio rapido che sembra una motocicletta lontana.",
    img: "https://image.qwenlm.ai/generated-images/bdc127a9-6307-4d34-9e89-77a77bb27dc7/_result.png", accent: "var(--color-lime)",
  },
  {
    id: "temporaria", code: "SPC-02", name: "Rana temporaria", latin: "Rana temporaria",
    place: "Alpi e Appennini", size: "6–9 cm", habitat: "Boschi umidi e torbiere",
    toxicity: 1, callId: "temporaria", callLabel: "Cra-cra sommesso",
    note: "In primavera scende in massa verso i laghetti alpini: le migrazioni notturne coinvolgono migliaia di individui.",
    img: "https://image.qwenlm.ai/generated-images/95b038da-87a9-430d-a0d7-520da922e276/_result.png", accent: "var(--color-water)",
  },
  {
    id: "agalychnis", code: "SPC-03", name: "Rana dagli occhi rossi", latin: "Agalychnis callidryas",
    place: "America centrale", size: "5–7 cm", habitat: "Foresta pluviale",
    toxicity: 2, callId: "agalychnis", callLabel: "Cip acuto",
    note: "I suoi occhi scarlatti sono un \"flash\" di avvertimento: spalancandoli di colpo confonde i predatori notturni.",
    img: "https://image.qwenlm.ai/generated-images/519eab2c-adf2-4544-9085-7e704e87425d/_result.png", accent: "var(--color-rust)",
  },
  {
    id: "dendrobates", code: "SPC-04", name: "Dendrobate azzurro", latin: "Dendrobates tinctorius «azureus»",
    place: "Suriname · savane sipaliwini", size: "3,5–4,5 cm", habitat: "Lettiera di foresta",
    toxicity: 4, callId: "dendrobates", callLabel: "Ronzio elettrico",
    note: "Il cobalto della pelle è un cartello stradale per i predatori: la tossina arriva dalle formiche e dagli acari che mangia.",
    img: "https://image.qwenlm.ai/generated-images/e24ec950-e94c-467b-9f05-21487b6e5b1e/_result.png", accent: "var(--color-water)",
  },
  {
    id: "litoria", code: "SPC-05", name: "Rana verdastra australiana", latin: "Litoria caerulea",
    place: "Australia e Nuova Guinea", size: "fino a 10 cm", habitat: "Giardini, grondaie, serbatoi",
    toxicity: 1, callId: "litoria", callLabel: "Crawk profondo",
    note: "Tranquilla e corpulenta, si è adattata alla città: la si trova nei bagni e nelle cassette della posta.",
    img: "https://image.qwenlm.ai/generated-images/a4c4ea79-4e63-45b2-b95e-906584958bc5/_result.png", accent: "var(--color-limedeep)",
  },
  {
    id: "phyllobates", code: "SPC-06", name: "Fillopate dorato", latin: "Phyllobates terribilis",
    place: "Colombia · Chocó", size: "4–5 cm", habitat: "Foresta umida costiera",
    toxicity: 5, callId: "phyllobates", callLabel: "Trillo argentino",
    note: "Un solo esemplare custodisce abbastanza batracotossina da uccidere dieci adulti: il vertebrato più velenoso al mondo.",
    img: "https://image.qwenlm.ai/generated-images/4621bc8d-613f-4dcc-9c34-2177396e9dfa/_result.png", accent: "var(--color-amber)",
  },
  {
    id: "bombina", code: "SPC-07", name: "Ululone dal ventre giallo", latin: "Bombina variegata",
    place: "Italia · pozze temporanee", size: "3,5–5 cm", habitat: "Pozze effimere, prati allagati",
    toxicity: 2, callId: "bombina", callLabel: "Uu-uu lamentoso",
    note: "Se minacciato inarca la schiena e mostra il ventre giallo e nero: il colore avverte «so di cattivo». Il verso è un «uu… uu…» malinconico che gli dà il nome.",
    img: "https://image.qwenlm.ai/generated-images/8525c3f6-a586-4192-bc29-a4a4df0875a0/_result.png", accent: "var(--color-amber)",
  },
  {
    id: "bufo", code: "SPC-08", name: "Rospo comune", latin: "Bufo bufo",
    place: "Europa · giardini e boschi", size: "fino a 15 cm", habitat: "Boschi, orti, cantine umide",
    toxicity: 2, callId: "bufo", callLabel: "Fusa meccaniche",
    note: "Il grande migratore di primavera: nelle notti di pioggia migliaia di rospi attraversano le strade verso gli stagni, spesso scortati dai volontari. Le parotidi secernono una tossina dal sapore pessimo.",
    img: "https://image.qwenlm.ai/generated-images/174093c8-9eac-4cf4-95a0-df13618f467b/_result.png", accent: "var(--color-rust)",
  },
  {
    id: "dyscophus", code: "SPC-09", name: "Rana pomodoro", latin: "Dyscophus antongilii",
    place: "Madagascar nord-orientale", size: "6–10 cm", habitat: "Lettiera di foresta pluviale",
    toxicity: 2, callId: "tomato", callLabel: "Cip squillante",
    note: "Una palla rosso pomodoro che si gonfia d'aria quando si spaventa, fino a sembrare impossibile da inghiottire. La pelle secerne una sostanza appiccicosa che scoraggia i predatori.",
    img: "https://image.qwenlm.ai/generated-images/c6306c57-5e49-4107-b8fd-ccecdd0f26e9/_result.png", accent: "var(--color-rust)",
  },
  {
    id: "pyxicephalus", code: "SPC-10", name: "Rana toro africana", latin: "Pyxicephalus adspersus",
    place: "Africa subsahariana", size: "fino a 24 cm · 2 kg", habitat: "Savane allagate, pozze",
    toxicity: 1, callId: "bullfrog", callLabel: "Muggito profondo",
    note: "Un maschio può pesare due chili e difende i girini come un pastore, scavando canali verso l'acqua. Il suo «jug-o-rum» si sente a chilometri di distanza.",
    img: "https://image.qwenlm.ai/generated-images/c4ea9551-9061-40c8-9eca-8452eee01137/_result.png", accent: "var(--color-limedeep)",
  },
];

/* ---------- coro notturno (voci europee) ---------- */
export interface PadInfo {
  callId: string;
  name: string;
  latin: string;
  hz: string;
  pattern: string;
  desc: string;
}
export const PADS: PadInfo[] = [
  {
    callId: "temporaria", name: "Rana temporaria", latin: "Rana temporaria", hz: "≈130 Hz",
    pattern: "2 impulsi × 2 serie", desc: "Un borbottio morbido, quasi timido: lo senti solo a pochi metri, nei boschi alpini.",
  },
  {
    callId: "hyla", name: "Raganella italiana", latin: "Hyla intermedia", hz: "≈430 Hz",
    pattern: "13 impulsi rapidi", desc: "Un raglio metallico e continuo, prodotto da un animale di 40 grammi. Colonnella sonora delle risaie.",
  },
  {
    callId: "esculentus", name: "Rana verde", latin: "Pelophylax kl. esculentus", hz: "≈205 Hz",
    pattern: "3 impulsi gravi", desc: "Il «croac» da manuale: gonfia i sacchi vocali fino a sembrare un palloncino e richiude di scatto.",
  },
  {
    callId: "dalmatina", name: "Rana agile", latin: "Rana dalmatina", hz: "≈355 Hz",
    pattern: "miagolio calante", desc: "Verso inconfondibile, simile a un lamento: la femmina lo usa per ritrovare il maschio nel buio.",
  },
];

/* ---------- anatomia ---------- */
export interface Part {
  id: string;
  n: string;
  title: string;
  x: number;
  y: number;
  text: string;
}
export const PARTS: Part[] = [
  {
    id: "occhi", n: "01", title: "Occhi a torretta", x: 300, y: 84,
    text: "Sporgono sopra il cranio: vedono davanti, ai lati e quasi sopra, senza muovere la testa. E quando ingoia, la rana li abbassa nelle orbite per spingere il cibo in gola.",
  },
  {
    id: "timpano", n: "02", title: "Timpano in vista", x: 257, y: 124,
    text: "Un tamburo circolare ben visibile dietro l'occhio: capta il canto dei maschi anche a decine di metri e, nelle rane verdi, trasmette le vibrazioni anche attraverso i polmoni.",
  },
  {
    id: "sacco", n: "03", title: "Sacco vocale", x: 341, y: 163,
    text: "Niente corde vocali: l'aria rimbalza avanti e indietro tra polmoni e sacco, come in una cornamusa. Alcune specie si sentono a più di un chilometro di distanza.",
  },
  {
    id: "zampe", n: "04", title: "Molle posteriori", x: 148, y: 158,
    text: "Le zampe posteriori si ripiegano come molle cariche di tendini elastici: rilasciate, lanciano l'animale fino a 20 volte la lunghezza del corpo in un unico balzo.",
  },
  {
    id: "piedi", n: "05", title: "Piedi palmati", x: 62, y: 206,
    text: "Le membrane tra le dita trasformano il piede in una pagaia. Le specie arboricole le sostituiscono con polpastrelli a ventosa, capaci di aderire al vetro.",
  },
  {
    id: "pelle", n: "06", title: "Pelle che respira", x: 206, y: 78,
    text: "Sottile, umida e piena di capillari: da sola può coprire gran parte dello scambio di ossigeno. Per questo le rane bevono dalla pelle e soffrono tanto l'inquinamento.",
  },
];

/* ---------- metamorfosi ---------- */
export interface Stage {
  id: string;
  when: string;
  title: string;
  text: string;
  stage: "uova" | "girino" | "zampe" | "ranocchietta" | "adulta";
}
export const STAGES: Stage[] = [
  {
    id: "uova", when: "Giorni 0–4", title: "La nuvola di gelatina", stage: "uova",
    text: "Centinaia di uova sospese in una massa gelatinosa, ancorate alla vegetazione sommersa. La gelatina le protegge da funghi, pesci e sbalzi di temperatura mentre l'embrione si divide.",
  },
  {
    id: "girino", when: "Giorni 4–28", title: "Girino: vita da pesce", stage: "girino",
    text: "Nasce con branchie esterne, coda a pinna e una bocca a ventosa. Per settimane è un erbivoro che raschia alghe dalle pietre: non ha zampe, né polmoni, né fretta.",
  },
  {
    id: "zampe", when: "Settimane 5–8", title: "Spuntano le molle", stage: "zampe",
    text: "Prima le zampe posteriori, poi i polmoni: il girino comincia a salire in superficie a respirare aria. L'intestino, lunghissimo per digerire le alghe, si accorcia per la dieta carnivora in arrivo.",
  },
  {
    id: "ranocchietta", when: "Settimane 9–12", title: "Il grande riassorbimento", stage: "ranocchietta",
    text: "Le zampe anteriori erompono dagli opercoli e la coda non cade: viene letteralmente digerita, riciclata come carburante della trasformazione. In pochi giorni l'animale sbarca a terra.",
  },
  {
    id: "adulta", when: "Dopo 2–4 anni", title: "Ritorno all'acqua", stage: "adulta",
    text: "Raggiunta la maturità, l'istinto la riporta esattamente nello stagno dov'è nata: orienta con l'olfatto e con il campo magnetico, pronta a ripetere il ciclo nel coro di primavera.",
  },
];

/* ---------- numeri ---------- */
export const STATS = [
  { value: 7000, suffix: "+", label: "specie di anfibi descritte, quasi tutte rane e rospi (ordine Anura)" },
  { value: 41, suffix: "%", label: "delle specie di anfibi è minacciata di estinzione — il dato peggiore tra i vertebrati" },
  { value: 20, suffix: "×", label: "la lunghezza del corpo: il record di salto proporzionale tra i vertebrati" },
  { value: 500, suffix: "+", label: "specie colpite dal fungo chitridio, la più grave epidemia animale mai registrata" },
];

/* ---------- conservazione ---------- */
export const THREATS = [
  {
    title: "Perdita di habitat",
    body: "Bonifiche, cemento e agricoltura intensiva hanno cancellato stagni e zone umide: in pianura Padana è sparito oltre il 70% delle aree umide storiche.",
    level: "critica",
  },
  {
    title: "Chitridiomicosi",
    body: "Il fungo Batrachochytrium dendrobatidis attacca la pelle — l'organo con cui respirano — e ha già spinto circa 90 specie oltre l'orlo dell'estinzione.",
    level: "critica",
  },
  {
    title: "Clima che cambia",
    body: "Stagni che si prosciugano in anticipo, primature fuori stagione: la metamorfosi è sincronizzata con l'acqua, e l'acqua non aspetta.",
    level: "alta",
  },
  {
    title: "Insetticidi e inquinanti",
    body: "La pelle permeabile assorbe tutto: i pesticidi alterano sviluppo e sistema immunitario anche a dosi considerate sicure per altri animali.",
    level: "alta",
  },
];

export const IUCN_BARS = [
  { label: "Anfibi", value: 41, hot: true },
  { label: "Squali e razze", value: 37, hot: false },
  { label: "Mammiferi", value: 27, hot: false },
  { label: "Rettili", value: 21, hot: false },
  { label: "Uccelli", value: 13, hot: false },
];

export const ACTIONS = [
  "Lascia un angolo selvatico: anche una pozzanghera stabile può diventare un vivaio.",
  "Niente pesticidi in giardino: gli insetti sono il cibo, la pelle fa il resto.",
  "Non spostare anfibi né girini: ogni popolazione è adattata al suo stagno.",
  "Segnala gli avvistamenti su iNaturalist: ogni punto sulla mappa aiuta la ricerca.",
  "Attraversamenti protetti: nelle notti di pioggia, rallenta vicino a rogge e fossi.",
];

/* ---------- curiosità ---------- */
export const CURIOSITA = [
  {
    title: "Non bevono: si inzuppano",
    text: "Niente bocca per bere. L'acqua entra da una zona specializzata della pelle pelvica, la «patch», premuta contro il terreno umido come una spugna.",
  },
  {
    title: "Ingoiano con gli occhi",
    text: "Per mandare giù la preda, gli occhi rientrano nelle orbite e spingono il boccone in gola. Ecco perché la rana ammicca mentre mangia.",
  },
  {
    title: "Gelo e risurrezione",
    text: "La rana silvatica del Nord America si congela d'inverno: cuore fermo, sangue di ghiaccio. Il glucosio fa da antigelo e in primavera riparte come nulla fosse.",
  },
  {
    title: "Brekekekéx koáx koáx",
    text: "È il verso onomatopeico del coro di rane nelle «Rane» di Aristofane, 405 a.C.: il primo gracidio della letteratura occidentale.",
  },
  {
    title: "Lo stomaco che fu culla",
    text: "La rana gastrica australiana incubava i girini nello stomaco, sospendendo la digestione. Estinta negli anni '80, resta un unicum evolutivo.",
  },
  {
    title: "Lingua in 0,07 secondi",
    text: "La lingua si estroflette più veloce di un battito di ciglia e, grazie a una saliva non newtoniana, incolla prede pesanti anche un terzo del suo peso.",
  },
];

export const NAV = [
  { href: "#anatomia", label: "Anatomia" },
  { href: "#metamorfosi", label: "Metamorfosi" },
  { href: "#specie", label: "Specie" },
  { href: "#archivio", label: "Archivio" },
  { href: "#coro", label: "Coro notturno" },
  { href: "#conservazione", label: "Conservazione" },
  { href: "#curiosita", label: "Curiosità" },
];

export const MARQUEE = [
  "Hyla intermedia", "Rana temporaria", "Agalychnis callidryas", "Dendrobates tinctorius",
  "Litoria caerulea", "Phyllobates terribilis", "Pelophylax esculentus", "Rana dalmatina",
  "Bombina variegata", "Bufo bufo", "Dyscophus antongilii", "Pyxicephalus adspersus",
  "Alytes obstetricans", "Rana latastei", "Rheobatrachus silus", "Incilius periglenes",
];
