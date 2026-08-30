/* Archivio sistematico: 102 identikit, uno per ogni specie.
   Ogni riga: [latino, nome italiano, famiglia, areale, taglia max (cm), stato IUCN, nota, colore 1, colore 2, sagoma, livrea]. */

export type IUCN = "LC" | "NT" | "VU" | "EN" | "CR" | "EX";
export type FrogShape = "round" | "wide" | "slim";
export type FrogPattern = "spotted" | "mottled" | "striped" | "plain";

export interface ArchiveSpecies {
  name: string;
  latin: string;
  family: string;
  region: string;
  sizeCm: number;
  status: IUCN;
  note: string;
  c1: string;
  c2: string;
  shape: FrogShape;
  pattern: FrogPattern;
}

export const STATUS_ORDER: IUCN[] = ["LC", "NT", "VU", "EN", "CR", "EX"];

export const STATUS_META: Record<IUCN, { label: string; color: string }> = {
  LC: { label: "Minima preoccupazione", color: "#7fc8c8" },
  NT: { label: "Prossima alla minaccia", color: "#a9c47f" },
  VU: { label: "Vulnerabile", color: "#f0a32b" },
  EN: { label: "In pericolo", color: "#d96f32" },
  CR: { label: "In pericolo critico", color: "#e05555" },
  EX: { label: "Estinta", color: "#8d958c" },
};

export const REGIONS = [
  "Tutte", "Europa", "Italia", "Nordamerica", "America Centrale",
  "Sudamerica", "Africa", "Madagascar", "Asia", "Oceania", "Caraibi",
];

type Row = [string, string, string, string, number, IUCN, string, string, string, FrogShape, FrogPattern];

const ROWS: Row[] = [
  // ——— Ranidae ———
  ["Rana dalmatina", "Rana agile", "Ranidae", "Europa", 8, "LC", "Salta fin da gennaio: è la prima a far vibrare i boschi allagati.", "#8a6a3e", "#e8d8a0", "slim", "plain"],
  ["Rana latastei", "Rana di Lataste", "Ranidae", "Italia", 7, "VU", "Endemica della pianura padano-veneta: il suo areale è un fazzoletto.", "#9c5f38", "#e0c890", "wide", "mottled"],
  ["Rana italica", "Rana appenninica", "Ranidae", "Italia", 7, "LC", "Vive nei ruscelli appenninici, nascosta tra i sassi coperti di muschio.", "#7a5c34", "#d8c088", "slim", "mottled"],
  ["Rana arvalis", "Rana dei campi", "Ranidae", "Europa", 7, "LC", "In amore i maschi si tingono di azzurro cobalto: dura pochi giorni.", "#7c6238", "#9fc0d8", "wide", "plain"],
  ["Rana iberica", "Rana iberica", "Ranidae", "Europa", 5, "LC", "Piccola rana di torrente dei boschi umidi del nord-ovest spagnolo.", "#8a5c34", "#d0b480", "slim", "striped"],
  ["Rana graeca", "Rana greca", "Ranidae", "Europa", 8, "LC", "Sorella balcanica della temporaria, con la mascherina scura sugli occhi.", "#8a6a40", "#d8c090", "wide", "mottled"],
  ["Rana pyrenaica", "Rana dei Pirenei", "Ranidae", "Europa", 6, "LC", "Riconosciuta come specie solo nel 1993: vive in pochi torrenti pirenaici.", "#96683c", "#d8b888", "wide", "mottled"],
  ["Rana muscosa", "Rana dalle zampe gialle", "Ranidae", "Nordamerica", 8, "VU", "Bandiera della conservazione nelle montagne della California.", "#6e7a3c", "#d8d05a", "slim", "mottled"],
  ["Rana sierrae", "Rana della Sierra Nevada", "Ranidae", "Nordamerica", 8, "EN", "Decimata dal fungo chitridio: restano popolazioni isolate in quota.", "#7c8040", "#c8c860", "slim", "mottled"],
  ["Rana draytonii", "Rana di Drayton", "Ranidae", "Nordamerica", 12, "VU", "Un tempo comunissima in California, oggi sopravvive a macchie.", "#6a7a3a", "#b8c070", "wide", "mottled"],
  ["Rana holtzi", "Rana del Taurus", "Ranidae", "Asia", 8, "EN", "Vive praticamente in un solo lago turco, il Gölbaşı, a 1.700 metri.", "#8a7040", "#d0c080", "wide", "plain"],
  ["Lithobates catesbeianus", "Rana toro americana", "Ranidae", "Nordamerica", 20, "LC", "Gigante importato ovunque: in Italia è una specie invasiva vorace.", "#4e6e32", "#a8c878", "wide", "plain"],
  ["Lithobates pipiens", "Rana leopardo", "Ranidae", "Nordamerica", 10, "LC", "Macchie cerchiate come un felino: il nome è tutto un programma.", "#6e7a3a", "#e8d870", "wide", "spotted"],
  ["Lithobates sylvaticus", "Rana silvana", "Ranidae", "Nordamerica", 8, "LC", "Si congela d'inverno e «risorge» in primavera: il glucosio è il suo antigelo.", "#8a6a40", "#d8c890", "wide", "plain"],
  ["Pelophylax kl. esculentus", "Rana verde", "Ranidae", "Europa", 12, "LC", "Ibridogenesi da manuale: nasce da due specie e le tradisce entrambe.", "#4e7a30", "#c8d870", "wide", "plain"],
  ["Pelophylax lessonae", "Rana dei fossi", "Ranidae", "Europa", 7, "LC", "La più piccola delle rane verdi europee, amante dei fossi di risaia.", "#5a8034", "#c0d068", "wide", "plain"],
  ["Pelophylax ridibundus", "Rana ridibonda", "Ranidae", "Europa", 15, "LC", "La più grande rana verde d'Europa: il nome ricorda una risata sguaiata.", "#4a6e30", "#b0c060", "wide", "striped"],
  ["Pelophylax perezi", "Rana iberica verde", "Ranidae", "Europa", 10, "LC", "Onnipresente nella penisola iberica, dai giardini ai torrenti.", "#57783a", "#b8c868", "wide", "plain"],
  // ——— Hylidae ———
  ["Hyla arborea", "Raganella europea", "Hylidae", "Europa", 5, "LC", "Cugina centro-europea della raganella italiana: stesso raglio, stesso verde.", "#5a9a30", "#d8e880", "slim", "plain"],
  ["Hyla meridionalis", "Raganella meridionale", "Hylidae", "Europa", 6, "LC", "Riconoscibile dalla striscia scura che scende fino alla spalla.", "#6aa038", "#c0d870", "slim", "striped"],
  ["Hyla savignyi", "Raganella di Savigny", "Hylidae", "Asia", 5, "LC", "La raganella del Vicino Oriente, dal grido acuto e insistente.", "#7aa840", "#d0e078", "slim", "plain"],
  ["Litoria aurea", "Raganella dorata", "Hylidae", "Oceania", 8, "EN", "Un tempo simbolo di Sydney, oggi conta poche popolazioni residue.", "#5a8a2e", "#e8c840", "slim", "plain"],
  ["Agalychnis moreletii", "Rana di Morelet", "Hylidae", "America Centrale", 9, "LC", "Come la cugina dagli occhi rossi, sfodera colori nascosti se spaventata.", "#3e8a34", "#e05a3c", "wide", "plain"],
  ["Boana prasina", "Raganella verde brasiliana", "Hylidae", "Sudamerica", 6, "LC", "Costruisce nidi di schiuma appesi sull'acqua, come piccole nuvole.", "#78b048", "#e0e890", "slim", "plain"],
  ["Dendropsophus ebraccatus", "Raganella «pantaloncini»", "Hylidae", "America Centrale", 3, "LC", "Le zampe arancione sembrano pantaloncini: il nome latino lo dice.", "#a8b848", "#e07a30", "slim", "plain"],
  ["Pseudacris crucifer", "Raganella crocifera", "Hylidae", "Nordamerica", 4, "LC", "Il primo coro di primavera del Nordamerica: fischia già a febbraio.", "#9a8a50", "#d8c890", "slim", "plain"],
  ["Pseudacris regilla", "Raganella del Pacifico", "Hylidae", "Nordamerica", 5, "LC", "La voce dei cartoni animati: il «ribbit» dei film è il suo.", "#8a9a48", "#c8d078", "slim", "striped"],
  ["Acris crepitans", "Rana grillo settentrionale", "Hylidae", "Nordamerica", 4, "LC", "Voce da insetto e salti da record nonostante i tre centimetri.", "#8a8a50", "#c0b878", "slim", "spotted"],
  ["Smilisca baudinii", "Raganella mascherata", "Hylidae", "America Centrale", 8, "LC", "Di giorno dorme incollata ai tronchi, perfettamente mimetizzata.", "#8a9a40", "#b8c070", "wide", "plain"],
  // ——— Bufonidae ———
  ["Bufo spinosus", "Rospo spinoso", "Bufonidae", "Europa", 13, "LC", "Il fratello mediterraneo del rospo comune, con verruche ancora più evidenti.", "#6a5a3a", "#c0a868", "round", "mottled"],
  ["Bufotes viridis", "Rospo smeraldino", "Bufonidae", "Europa", 10, "LC", "Macchie verde smeraldo su fondo chiaro: il rospo più elegante d'Europa.", "#a8a878", "#4a8a48", "round", "mottled"],
  ["Bufotes balearicus", "Rospo balearico", "Bufonidae", "Europa", 11, "LC", "Smeraldino insulare, diffuso anche in molte isole italiane.", "#b0b080", "#4e8e4c", "round", "mottled"],
  ["Strauchbufo raddei", "Rospo di Radde", "Bufonidae", "Asia", 9, "LC", "Il rospo dell'Estremo Oriente: in Corea si raduna a milioni.", "#6e5c38", "#b8a468", "round", "mottled"],
  ["Anaxyrus americanus", "Rospo americano", "Bufonidae", "Nordamerica", 11, "LC", "Il rospo da giardino nordamericano: un alleato contro le zanzare.", "#7a6040", "#c0a870", "round", "mottled"],
  ["Anaxyrus boreas", "Rospo boreale", "Bufonidae", "Nordamerica", 11, "NT", "In declino sulle Montagne Rocciose, monitorato da decenni.", "#8a7448", "#c8b478", "round", "spotted"],
  ["Anaxyrus canorus", "Rospo di Yosemite", "Bufonidae", "Nordamerica", 7, "VU", "Vive quasi solo nel parco di Yosemite, sopra i 2.500 metri.", "#7a6a3e", "#c8b870", "round", "mottled"],
  ["Rhinella marina", "Rospo delle canne", "Bufonidae", "Sudamerica", 25, "LC", "Introdotto in Australia come «disinfestante»: è diventato un disastro.", "#8a7a50", "#c0b078", "round", "mottled"],
  ["Atelopus zeteki", "Rana dorata di Panama", "Bufonidae", "America Centrale", 5, "CR", "Simbolo nazionale di Panama, scomparsa quasi ovunque per il chitridio.", "#e8b020", "#3a2e18", "slim", "plain"],
  ["Atelopus varius", "Arlecchino variabile", "Bufonidae", "America Centrale", 6, "CR", "Un arlecchino in pericolo critico: pochi avvistamenti negli ultimi anni.", "#e0a030", "#403018", "slim", "mottled"],
  ["Incilius periglenes", "Rospo dorato del Monteverde", "Bufonidae", "America Centrale", 6, "EX", "Visto l'ultima volta nel 1989: la prima vittima celebre del clima che cambia.", "#e8a820", "#4a3518", "round", "plain"],
  // ——— Bombinatoridae ———
  ["Bombina bombina", "Ululone dal ventre rosso", "Bombinatoridae", "Europa", 5, "LC", "Ventaglio rosso a macchie nere: inarca la schiena e mostra il cartello.", "#4a5a38", "#d84a30", "round", "mottled"],
  ["Bombina pachypus", "Ululone appenninico", "Bombinatoridae", "Italia", 5, "EN", "Endemico italiano in forte calo: le pozze temporanee stanno sparendo.", "#5a663c", "#e05a2e", "round", "mottled"],
  ["Bombina orientalis", "Ululone orientale", "Bombinatoridae", "Asia", 6, "LC", "La star dei terrari asiatici, con verruche arancioni sul dorso.", "#3e6a3e", "#e06030", "round", "mottled"],
  // ——— Alytidae ———
  ["Alytes obstetricans", "Rospo levatrice", "Alytidae", "Europa", 5, "LC", "Il maschio trasporta le uova sulle zampe e le bagna di notte: papà modello.", "#8a8058", "#c0b480", "round", "mottled"],
  ["Alytes cisternasii", "Rospo levatrice iberico", "Alytidae", "Europa", 5, "LC", "Il verso sembra un sonar: un «tin» breve ripetuto al crepuscolo.", "#9a8a58", "#c8b880", "round", "mottled"],
  ["Alytes muletensis", "Ferreret di Maiorca", "Alytidae", "Europa", 4, "VU", "Creduto estinto, riscoperto nel 1980 nei canyon di Maiorca.", "#8a7a50", "#b8a870", "round", "mottled"],
  ["Discoglossus pictus", "Discoglosso dipinto", "Alytidae", "Italia", 7, "LC", "Lingua rotonda e non estroflettibile: una rana «fuori dal coro».", "#7a6a40", "#c8b070", "wide", "spotted"],
  ["Discoglossus sardus", "Discoglosso sardo", "Alytidae", "Italia", 6, "LC", "Esclusivo di Sardegna, Corsica e poche isole tirreniche.", "#8a7448", "#c8b478", "wide", "spotted"],
  ["Latonia nigriventer", "Rana dipinta di Hula", "Alytidae", "Asia", 6, "CR", "Riscoperta nel 2011 dopo 70 anni: era stata dichiarata estinta.", "#6a5a38", "#e0a030", "wide", "mottled"],
  // ——— Pelobatidae · Pelodytidae · Scaphiopodidae ———
  ["Pelobates fuscus", "Pelobate fosco", "Pelobatidae", "Europa", 7, "LC", "Scava con un «badile» corneo sulle zampe: sparisce in pochi secondi.", "#8a7a48", "#b8a868", "round", "plain"],
  ["Pelobates cultripes", "Pelobate occidentale", "Pelobatidae", "Europa", 8, "NT", "Pupille verticali e abitudini da talpa: si vede solo con le piogge.", "#9a8a50", "#c0b070", "round", "plain"],
  ["Pelobates syriacus", "Pelobate siriano", "Pelobatidae", "Asia", 9, "NT", "Il pelobate del Vicino Oriente, sempre più raro nei coltivi.", "#8a7c48", "#b8aa68", "round", "plain"],
  ["Pelodytes punctatus", "Pelodite punteggiato", "Pelodytidae", "Europa", 5, "LC", "Puntini verdi su fondo sabbia: il mimetismo fatto rana.", "#9a8a58", "#6a8a3a", "slim", "spotted"],
  ["Scaphiopus holbrookii", "Rana dai piedi a vanga", "Scaphiopodidae", "Nordamerica", 8, "LC", "Dopo la pioggia emerge a migliaia: la sua voce sembra un belato.", "#7a6a40", "#c0aa70", "round", "plain"],
  ["Spea multiplicata", "Rana vanga del sud", "Scaphiopodidae", "Nordamerica", 6, "LC", "I girini hanno due morfologie: erbivori o cannibali, a seconda del cibo.", "#8a7848", "#b8a468", "round", "plain"],
  // ——— Dendrobatidae ———
  ["Dendrobates auratus", "Dendrobate dorato", "Dendrobatidae", "America Centrale", 4, "LC", "Bronzo e smeraldo: esiste in decine di varianti locali di colore.", "#3a7a48", "#c8a830", "slim", "mottled"],
  ["Dendrobates leucomelas", "Dendrobate giallo-nero", "Dendrobatidae", "Sudamerica", 4, "LC", "Bande da ape: il giallo avverte che la pelle scotta.", "#e8c020", "#2a2620", "slim", "striped"],
  ["Phyllobates bicolor", "Fillopate bicolore", "Dendrobatidae", "Sudamerica", 5, "EN", "Secondo solo al terribilis per tossina: le zampe sono blu notte.", "#e88a20", "#2e3a5a", "slim", "plain"],
  ["Oophaga pumilio", "Rana fragola", "Dendrobatidae", "America Centrale", 2.5, "LC", "Grande come un'unghia e rumorosissima: ogni isola ha la sua livrea.", "#d83828", "#3050a0", "slim", "plain"],
  ["Oophaga histrionica", "Rana arlecchino", "Dendrobatidae", "Sudamerica", 3.5, "VU", "Mosaico nero su arancio, dipinto in modo diverso per ogni individuo.", "#e07028", "#2a2420", "slim", "mottled"],
  ["Ranitomeya imitator", "Rana imitatrice", "Dendrobatidae", "Sudamerica", 2, "LC", "Copia le livree di tre specie tossiche vicine: mimetismo batesiano puro.", "#e8a020", "#2a2620", "slim", "striped"],
  ["Ranitomeya reticulata", "Rana reticolata", "Dendrobatidae", "Sudamerica", 2, "LC", "Una rete nera finissima su fondo rosso fuoco.", "#d84028", "#2e2820", "slim", "mottled"],
  ["Minyobates steyermarki", "Minirospo di Steyermark", "Dendrobatidae", "Sudamerica", 1.6, "CR", "Tra i più piccoli anfibi al mondo: vive su un solo tepui venezuelano.", "#c83020", "#2a221e", "round", "plain"],
  ["Andinobates bombetes", "Dendrobate «bombeta»", "Dendrobatidae", "Sudamerica", 2, "VU", "Il richiamo ricorda un petardo: da qui il nome colombiano.", "#d83828", "#2e2820", "slim", "plain"],
  // ——— Mantellidae (Madagascar) ———
  ["Mantella aurantiaca", "Mantella dorata", "Mantellidae", "Madagascar", 3, "EN", "La «freccia d'oro» del Madagascar: minacciata anche dai prelievi.", "#e8a020", "#3a2e18", "slim", "plain"],
  ["Mantella crocea", "Mantella gialla", "Mantellidae", "Madagascar", 3, "VU", "Gialla come un tuorlo, con mascherina nera da bandito.", "#e0b020", "#332a18", "slim", "plain"],
  ["Mantella baroni", "Mantella di Baron", "Mantellidae", "Madagascar", 3, "LC", "La più comune delle mantelle: nero lucido con calze arancio.", "#2e2a24", "#e07a28", "slim", "plain"],
  ["Mantella expectata", "Mantella blu", "Mantellidae", "Madagascar", 3, "CR", "Blu cobalto e zampe arancio: il commercio la sta mettendo alle corde.", "#3050a8", "#e07a28", "slim", "plain"],
  ["Mantidactylus granulatus", "Mantidattilo granulare", "Mantellidae", "Madagascar", 4, "LC", "Pelle a grani e occhi enormi: caccia insetti nella nebbia degli altopiani.", "#7a7a48", "#c0b068", "slim", "spotted"],
  ["Boophis tephraeomystax", "Boafo cenerino", "Mantellidae", "Madagascar", 6, "LC", "Raganella malgascia dalle ossa verdi, visibili attraverso la pelle.", "#8a9a58", "#c8d080", "slim", "plain"],
  ["Aglyptodactylus madagascariensis", "Rana delle paludi malgascia", "Mantellidae", "Madagascar", 7, "LC", "Gigante delle pozze malgasce: i maschi cantano in cori affollatissimi.", "#6a7a3e", "#b8c070", "wide", "plain"],
  // ——— Microhylidae · Brevicipitidae ———
  ["Dyscophus guineti", "Rana pomodoro striata", "Microhylidae", "Madagascar", 9, "LC", "Sorella striata della rana pomodoro, con bande scure sul rosso.", "#c84028", "#3a2a20", "round", "striped"],
  ["Kaloula pulchra", "Rana dipinta asiatica", "Microhylidae", "Asia", 7, "LC", "Disco marrone bordato d'oro: quando si spaventa diventa una palla.", "#5a4a30", "#d8a830", "round", "striped"],
  ["Kaloula borealis", "Rana dipinta coreana", "Microhylidae", "Asia", 6, "LC", "La versione coreana della kaloula, in declino per i pesticidi.", "#6a5438", "#c8a040", "round", "striped"],
  ["Gastrophryne carolinensis", "Rana dal ventre stretto", "Microhylidae", "Nordamerica", 4, "LC", "Una scheggia appuntita che fischia come un insetto nelle notti umide.", "#7a6a48", "#b8a870", "slim", "plain"],
  ["Breviceps adspersus", "Rana della pioggia", "Brevicipitidae", "Africa", 6, "LC", "Tonda come un sasso, zampetta invece di saltare: il web l'ha resa celebre.", "#8a7a50", "#c0b078", "round", "spotted"],
  ["Breviceps macrops", "Rana della sabbia", "Brevicipitidae", "Africa", 5, "LC", "Vive nelle dune del Sudafrica e nuota nella sabbia come nell'acqua.", "#a89060", "#c8b888", "round", "plain"],
  // ——— Ceratophryidae ———
  ["Ceratophrys ornata", "Rana cornuta argentina", "Ceratophryidae", "Sudamerica", 13, "NT", "Una bocca con la rana intorno: aspetta immobile tutto ciò che passa.", "#4e8a30", "#e0c030", "round", "mottled"],
  ["Ceratophrys cornuta", "Rana cornuta del Suriname", "Ceratophryidae", "Sudamerica", 15, "LC", "Le «corna» sopra gli occhi spezzano la sagoma: agguato perfetto.", "#6a8a34", "#c0a838", "round", "mottled"],
  ["Ceratophrys cranwelli", "Rana cornuta di Cranwell", "Ceratophryidae", "Sudamerica", 13, "LC", "La più comune in terrario: verde mela e appetito da aspirapolvere.", "#7aa038", "#e0d060", "round", "mottled"],
  ["Lepidobatrachus laevis", "Rana dalle zampe larghe", "Ceratophryidae", "Sudamerica", 10, "LC", "Bocca larga quanto il corpo: il girino è già un piccolo predatore.", "#7a8a48", "#b8b070", "wide", "striped"],
  // ——— Pyxicephalidae · Conrauidae ———
  ["Pyxicephalus edulis", "Rana toro commestibile", "Pyxicephalidae", "Africa", 9, "LC", "Il fratello minore della toro africana, diffuso nelle savane allagate.", "#5a7a34", "#b0c060", "wide", "plain"],
  ["Amietia angolensis", "Rana di fiume angolana", "Pyxicephalidae", "Africa", 7, "LC", "Vive nei torrenti rocciosi: i maschi gridano dalle cascate.", "#6a7a3a", "#b8c070", "slim", "mottled"],
  ["Conraua goliath", "Rana golia", "Conrauidae", "Africa", 32, "VU", "La rana più grande del mondo: 32 centimetri e 3 chili di muscoli.", "#4a6a34", "#9ab050", "wide", "plain"],
  // ——— Pipidae ———
  ["Xenopus laevis", "Xenopo liscio", "Pipidae", "Africa", 12, "LC", "La rana da laboratorio per eccellenza: ha dato il nome a mille scoperte.", "#8a8a68", "#b8b090", "wide", "mottled"],
  ["Pipa pipa", "Pipa del Suriname", "Pipidae", "Sudamerica", 20, "LC", "La femmina incuba le uova nella pelle del dorso: i piccoli «sbucano» da lì.", "#7a6a48", "#a89868", "wide", "mottled"],
  ["Hymenochirus boettgeri", "Xenopo nano", "Pipidae", "Africa", 3.5, "LC", "Minuscolo e buffo: sembra sempre sorpreso, con le zampe in posa.", "#8a7a58", "#b8a880", "slim", "plain"],
  // ——— Myobatrachidae · Rhinodermatidae ———
  ["Pseudophryne corroboree", "Rana corroboree", "Myobatrachidae", "Oceania", 3, "CR", "Bande gialle e nere da pittura aborigena: restano poche centinaia di individui.", "#2e2a20", "#e8d020", "slim", "striped"],
  ["Rheobatrachus silus", "Rana gastrica", "Myobatrachidae", "Oceania", 5, "EX", "Incubava i piccoli nello stomaco. Estinta negli anni '80: il mondo è più povero.", "#7a7a48", "#b0a870", "wide", "plain"],
  ["Mixophyes iteratus", "Rana dal dorso barrato", "Myobatrachidae", "Oceania", 9, "EN", "Lancia i girini fuori dall'acqua con le zampe: balistica evolutiva.", "#6a6a3e", "#b0a868", "slim", "striped"],
  ["Limnodynastes peronii", "Rana palustre striata", "Myobatrachidae", "Oceania", 7, "LC", "Il «tok» secco che accompagna le notti australiane vicino all'acqua.", "#7a7048", "#c0b478", "wide", "striped"],
  ["Rhinoderma darwinii", "Rana di Darwin", "Rhinodermatidae", "Sudamerica", 3.5, "EN", "Il maschio alleva i girini nel sacco vocale: Darwin ne rimase folgorato.", "#4a8a4a", "#8ab868", "slim", "plain"],
  // ——— Telmatobiidae · Centrolenidae ———
  ["Telmatobius culeus", "Rana del lago Titicaca", "Telmatobiidae", "Sudamerica", 14, "CR", "Pelle a grembiule per respirare a 3.800 metri: il lago si sta scaldando.", "#6a7a48", "#a8b068", "wide", "mottled"],
  ["Hyalinobatrachium fleischmanni", "Rana di vetro", "Centrolenidae", "America Centrale", 3, "LC", "Pancia trasparente: si vedono cuore e fegato lavorare.", "#8ac878", "#e8f0d0", "slim", "plain"],
  ["Centrolene prosoblepon", "Rana di vetro smeraldo", "Centrolenidae", "America Centrale", 3, "LC", "Vive sulle foglie sopra i torrenti: cade in acqua solo da girino.", "#5aa868", "#c8e8b0", "slim", "plain"],
  // ——— Phyllomedusidae · Leptodactylidae ———
  ["Phyllomedusa bicolor", "Rana kambò", "Phyllomedusidae", "Sudamerica", 10, "LC", "Le sue secrezioni sono usate dai popoli amazzonici nel rito del kambô.", "#5a9a38", "#c8e080", "slim", "plain"],
  ["Phyllomedusa sauvagii", "Rana cerosa", "Phyllomedusidae", "Sudamerica", 8, "LC", "Si spalma una cera impermeabile: dorme appesa alle foglie come una foglia.", "#8aa048", "#c0d078", "slim", "plain"],
  ["Leptodactylus pentadactylus", "Rana dal fischio amazzonica", "Leptodactylidae", "Sudamerica", 18, "LC", "Un fischio da locomotiva nella notte amazzonica: quasi venti centimetri.", "#6a5c38", "#b8a468", "wide", "striped"],
  ["Engystomops pustulosus", "Rana túngara", "Leptodactylidae", "America Centrale", 3, "LC", "Aggiunge un «chuck» al richiamo per conquistare: i pipistrelli la ascoltano.", "#7a6a48", "#b8a878", "round", "mottled"],
  // ——— Eleutherodactylidae · Brachycephalidae ———
  ["Eleutherodactylus coqui", "Coquí di Portorico", "Eleutherodactylidae", "Caraibi", 4, "LC", "«Co-quí!» è la voce nazionale di Portorico: due note, un'isola intera.", "#8a7a48", "#c0b078", "slim", "plain"],
  ["Eleutherodactylus iberia", "Rana minuscola cubana", "Eleutherodactylidae", "Caraibi", 0.9, "LC", "Meno di un centimetro: tra i più piccoli vertebrati dell'emisfero nord.", "#8a7448", "#b8a470", "round", "plain"],
  ["Brachycephalus ephippium", "Rospo zucca", "Brachycephalidae", "Sudamerica", 1.8, "LC", "Arancio fluorescente grande come una monetina, con uno scudo osseo nel dorso.", "#e07020", "#3a2a18", "round", "plain"],
];

export const ARCHIVE: ArchiveSpecies[] = ROWS.map((r) => ({
  latin: r[0],
  name: r[1],
  family: r[2],
  region: r[3],
  sizeCm: r[4],
  status: r[5],
  note: r[6],
  c1: r[7],
  c2: r[8],
  shape: r[9],
  pattern: r[10],
}));

export const FAMILIES: string[] = [...new Set(ARCHIVE.map((s) => s.family))].sort((a, b) =>
  a.localeCompare(b, "it")
);
