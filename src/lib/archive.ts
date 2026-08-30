/* Archivio sistematico: un ritratto per ogni specie.
   Ogni riga: [latino, nome italiano, famiglia, areale, taglia max (cm), stato IUCN, nota,
               colore 1, colore 2, sagoma, livrea, ordine? (default "Anura")]. */

export type IUCN = "LC" | "NT" | "VU" | "EN" | "CR" | "EX";
export type FrogShape = "round" | "wide" | "slim" | "caudata";
export type FrogPattern = "spotted" | "mottled" | "striped" | "plain";
export type AmphibiaOrder = "Anura" | "Urodela";

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
  order: AmphibiaOrder;
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

type Row = [string, string, string, string, number, IUCN, string, string, string, FrogShape, FrogPattern, AmphibiaOrder?];

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
  ["Atelopus zeteki", "Rana dorata di Panama", "Bufonidae", "America Centrale", 5, "CR", "Non sente il proprio canto: «saluta» i rivali sventolando le zampe. Simbolo di Panama, quasi svanita per il chitridio.", "#e8b020", "#3a2e18", "slim", "plain"],
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
  // ——— Gli strani: Anura fuori dal comune ———
  ["Theloderma corticale", "Rana muschio del Vietnam", "Rhacophoridae", "Asia", 8, "EN", "Pelle che imita il muschio alla perfezione: vive appiccicata alle pareti delle grotte carsiche.", "#4a6a40", "#2e4a2e", "slim", "spotted"],
  ["Nasikabatrachus sahyadrensis", "Rana viola", "Nasikabatrachidae", "Asia", 7, "EN", "Passa quasi l'anno sottoterra a mangiare termiti: emerge solo pochi giorni, gonfia e violetta.", "#8a6aa8", "#b8a0c8", "round", "plain"],
  ["Lepidobatrachus laevis", "Rana di Budgett", "Ceratophryidae", "Sudamerica", 11, "NT", "Praticamente tutta bocca: il muso schiacciato la fa sembrare un personaggio dei cartoni.", "#6a7a48", "#c8b078", "wide", "striped"],
  ["Trichobatrachus robustus", "Rana pelosa", "Arthroleptidae", "Africa", 13, "LC", "I «peli» del maschio sono filamenti di pelle per respirare; e ha artigli che escono dalle dita.", "#7a5c34", "#b8a068", "wide", "mottled"],
  ["Barbourula kalimantanensis", "Rana senza polmoni del Borneo", "Bombinatoridae", "Asia", 8, "EN", "Unica rana al mondo senza polmoni: respira solo attraverso la pelle, in torrenti gelidi.", "#5a5a3e", "#a0a070", "slim", "mottled"],
  ["Breviceps mossambicus", "Rana della pioggia del Mozambico", "Brevicipitidae", "Africa", 5, "LC", "La «patata arrabbiata» del web: tonda, perennemente corrucciata, si gonfia come un palloncino se la tocchi.", "#9a8050", "#c8b080", "round", "plain"],
  ["Pseudis paradoxa", "Rana paradosso", "Hylidae", "Sudamerica", 7, "LC", "Il girino misura 25 cm e l'adulto 7: crescendo si restringe, al contrario di tutti.", "#7a8a48", "#c0c880", "slim", "striped"],
  ["Rhinophrynus dorsalis", "Rospo scavatore messicano", "Rhinophrynidae", "America Centrale", 8, "LC", "Naso a badile e strisce da pirata: passa la vita a ritroso, scavando all'indietro.", "#6a5a48", "#e0c890", "round", "striped"],
  ["Litoria infrafrenata", "Raganella dal labbro bianco", "Hylidae", "Oceania", 13, "LC", "La raganella più grande del mondo: dieci centimetri di verde squillante con le labbra bianche.", "#58b050", "#e8f0e0", "slim", "plain"],
  ["Rhacophorus nigropalmatus", "Rana volante di Wallace", "Rhacophoridae", "Asia", 10, "NT", "Dita palmate di nero come paracadute: plana da un albero all'altro per dieci metri.", "#5a8a3a", "#1e1e1e", "slim", "plain"],
  ["Hymenochirus boettgeri", "Rana artigliata nana", "Pipidae", "Africa", 4, "LC", "Quattro centimetri, tutta acquatica: le dita terminano in veri artigli neri.", "#8a7a50", "#b0a070", "slim", "plain"],
  ["Oreophrynella nigra", "Rospo rotolante dei tepui", "Bufonidae", "Sudamerica", 2, "VU", "Vive sulle cime piatte dei tepui venezuelani: se fugge, si appallottola e rotola giù dai sassi.", "#3a3a32", "#6a6a58", "round", "plain"],
  ["Cyclorana platycephala", "Rana serbatoio", "Hylidae", "Oceania", 6, "LC", "Quando piove si riempie d'acqua e si sigilla sottoterra: gli aborigeni la usavano come borraccia.", "#a89858", "#d0c088", "round", "plain"],
  ["Hemiphractus proboscideus", "Rana marsupiale", "Hemiphractidae", "Sudamerica", 8, "LC", "La femmina porta i girini in una tasca sul dorso, nutriti da uova non fecondate.", "#7a6a40", "#c8a050", "wide", "mottled"],
  ["Limnonectes larvaepartus", "Rana che partorisce", "Dicroglossidae", "Asia", 3, "NT", "Unica rana nota a partorire girini già formati: scoperta solo nel 2014, in Sulawesi.", "#6a6a3e", "#a8a068", "slim", "plain"],
  ["Ecnomiohyla rabborum", "Rana arboricola di Rabbs", "Hylidae", "America Centrale", 10, "CR", "Il maschio faceva da «albero» ai girini: l'ultimo individuo noto è morto nel 2016.", "#7a8050", "#c0b070", "slim", "mottled"],
  ["Litoria dayi", "Raganella delle cascate", "Hylidae", "Oceania", 7, "EN", "Vive attaccata alle rocce sotto le cascate del Queensland: il suo giro di boa si è rotto.", "#b08040", "#d8b878", "slim", "plain"],
  ["Staurois natator", "Rana splash del Borneo", "Ranidae", "Asia", 6, "NT", "Vive sui torrenti: per farsi notare nel fragore dell'acqua sventola le zampe posteriori.", "#6a6a40", "#b0a870", "slim", "striped"],
  ["Scaphiophryne gottlebei", "Rana arcobaleno scavatrice", "Microhylidae", "Madagascar", 4, "EN", "Un mosaico di cerchi rossi e verdi sul ventre bianco: il Madagascar ne ha poche centinaia.", "#d05038", "#e8d8c8", "round", "spotted"],
  ["Melanophryniscus stelzneri", "Rospo dal ventre rosso", "Bufonidae", "Sudamerica", 4, "LC", "Se spaventato si rigira sulla schiena mostrando il ventre arancio: finge di essere già morto.", "#2e2e28", "#d86828", "round", "spotted"],
  ["Leptodactylus fallax", "Pollo di montagna", "Leptodactylidae", "Caraibi", 20, "CR", "Gigante buono di Montserrat e Dominica: scava nidi di schiuma grandi come palloni.", "#8a6a3e", "#c8a868", "wide", "mottled"],
  ["Heleophryne rosei", "Rana fantasma della Table Mountain", "Heleophrynidae", "Africa", 5, "CR", "Vive solo nei torrenti della Table Mountain, sopra Città del Capo: ne restano pochissime.", "#5a7a48", "#a8c080", "slim", "mottled"],
  ["Assa darlingtoni", "Rana con la borsa", "Myobatrachidae", "Oceania", 2, "LC", "Due centimetri: il maschio cova i girini in due tasche sui fianchi finché non saltano fuori.", "#8a6a48", "#c0a878", "round", "plain"],
  ["Rhinella proboscidea", "Rospo Pinocchio", "Bufonidae", "Sudamerica", 4, "LC", "Nella foga dell'accoppiamento i maschi si appendono al naso a uncino del rivale: è così che l'hanno scoperto.", "#8a7048", "#c0a870", "round", "mottled"],
  ["Chacophrys pierottii", "Rana cornuta del Chaco", "Ceratophryidae", "Sudamerica", 7, "NT", "Sorella argentina delle rane cornute: aspetta le prede sepolta con solo gli occhi fuori.", "#8a7a48", "#c8b078", "wide", "mottled"],
  ["Telmatobius macrostomus", "Rana del lago Junín", "Telmatobiidae", "Sudamerica", 15, "EN", "I girini restano girini per anni, giganti, nelle acque fredde del lago Junín a 4.000 metri.", "#6a7a48", "#a8b068", "wide", "mottled"],
  ["Gracixalus supercornutus", "Raganella con le corna", "Rhacophoridae", "Asia", 4, "NT", "Escrescenze a corna su naso e occhi: una delle rane più bizzarre del Vietnam.", "#6a9a48", "#b8c870", "slim", "plain"],
  // ——— Urodela: salamandre, tritoni e affini ———
  ["Ambystoma mexicanum", "Axolotl", "Ambystomatidae", "America Centrale", 30, "CR", "L'eterno girino: non diventa mai adulto e rigenera arti, midollo e perfino pezzi di cuore.", "#c8b8a8", "#d87878", "caudata", "plain", "Urodela"],
  ["Proteus anguinus", "Proteo, il «pesce umano»", "Proteidae", "Europa", 40, "VU", "Cieco, rosa e immortale quasi: vive 100 anni nelle grotte delle Alpi Dinariche senza mangiare per anni.", "#e8d0c8", "#c8a8a0", "caudata", "plain", "Urodela"],
  ["Andrias davidianus", "Salamandra gigante cinese", "Cryptobranchidae", "Asia", 180, "CR", "Il più grande anfibio vivente: quasi due metri di «fossile vivente» nei fiumi cinesi.", "#7a6a50", "#5a4a38", "caudata", "mottled", "Urodela"],
  ["Andrias japonicus", "Salamandra gigante giapponese", "Cryptobranchidae", "Asia", 150, "VU", "Cugina giapponese da un metro e mezzo: protetta come monumento naturale dal 1927.", "#8a6a48", "#6a5038", "caudata", "mottled", "Urodela"],
  ["Cryptobranchus alleganiensis", "Hellbender", "Cryptobranchidae", "Nordamerica", 74, "NT", "«Lontra mocciosa» per gli americani: respira dalle pieghe della pelle nei fiumi appalachiani.", "#7a6848", "#a89868", "caudata", "mottled", "Urodela"],
  ["Salamandra salamandra", "Salamandra pezzata", "Salamandridae", "Europa", 25, "LC", "Nera e gialla, partorisce nei ruscelli: in Italia è la regina dei boschi dopo la pioggia.", "#2a2a22", "#e8c828", "caudata", "spotted", "Urodela"],
  ["Salamandrina terdigitata", "Salamandrina dagli occhiali", "Salamandridae", "Italia", 12, "LC", "Endemica dell'Appennino: piedi rossi, mascherina sugli occhi e quattro dita, unica al mondo.", "#2e2a24", "#d84838", "caudata", "plain", "Urodela"],
  ["Salamandra atra", "Salamandra alpina", "Salamandridae", "Europa", 15, "LC", "Nera come la roccia delle Alpi: salta l'acqua e partorisce piccoli già formati, in quota.", "#1e1e1c", "#3a3a34", "caudata", "plain", "Urodela"],
  ["Siren lacertina", "Grande sirena", "Sirenidae", "Nordamerica", 90, "LC", "Quasi un metro, solo le zampe davanti e branchie a ciuffo: un anfibio rimasto a metà.", "#8a8a70", "#a8a888", "caudata", "plain", "Urodela"],
  ["Pseudobranchus striatus", "Sirena nana", "Sirenidae", "Nordamerica", 25, "LC", "Sorellina della grande sirena: un verme con le branchie degli stagni della Florida.", "#9a9070", "#b8a888", "caudata", "striped", "Urodela"],
  ["Necturus maculosus", "Mudpuppy", "Proteidae", "Nordamerica", 40, "LC", "Branchie rosse a piuma che non perde mai: il «cucciolo di fango» dei laghi americani.", "#7a6a50", "#c86848", "caudata", "spotted", "Urodela"],
  ["Pleurodeles waltl", "Tritone iberico", "Salamandridae", "Europa", 30, "NT", "Sotto stress le punte delle costole bucano la pelle senza ferirlo: poi tutto si richiude.", "#6a6a58", "#e0a038", "caudata", "spotted", "Urodela"],
  ["Hydromantes strinatii", "Geotritone di Strinati", "Plethodontidae", "Italia", 14, "VU", "Senza polmoni e senza fase acquatica: vive nelle grotte liguri e lancia la lingua come un camaleonte.", "#9a8870", "#c0a888", "caudata", "plain", "Urodela"],
  ["Amphiuma means", "Anfiuma", "Amphiumidae", "Nordamerica", 75, "LC", "Un'anguilla con quattro zampe minuscole e un morso da non sottovalutare: notti di palude.", "#3a3a34", "#5a5a50", "caudata", "plain", "Urodela"],
  ["Taricha granulosa", "Tritone dalla pelle ruvida", "Salamandridae", "Nordamerica", 22, "LC", "Contiene tetrodotossina, il veleno del pesce palla: un tritone basta per dieci predatori.", "#6a6050", "#e08838", "caudata", "plain", "Urodela"],
  ["Ensatina eschscholtzii", "Ensatina", "Plethodontidae", "Nordamerica", 14, "LC", "Il caso da manuale di «specie ad anello»: gira attorno alla valle e ai due capi non si riconosce più.", "#c08840", "#e0b878", "caudata", "spotted", "Urodela"],
  ["Triturus carnifex", "Tritone crestato italiano", "Salamandridae", "Italia", 16, "LC", "In primavera il maschio sfoggia una cresta da drago con dentellature bianche e nere.", "#4a4a3a", "#e08838", "caudata", "striped", "Urodela"],
  ["Ichthyosaura alpestris", "Tritone alpestre", "Salamandridae", "Europa", 12, "LC", "In amore il maschio diventa azzurro cielo con macchie nere: il più elegante degli stagni alpini.", "#3a5a8a", "#e07838", "caudata", "plain", "Urodela"],
  ["Ambystoma andersoni", "Salamandra di Anderson", "Ambystomatidae", "America Centrale", 25, "CR", "Branchie rosse a piuma che non riassorbe mai: vive in un solo lago messicano, Zacapu.", "#5a5a52", "#d06858", "caudata", "spotted", "Urodela"],
  ["Onychodactylus japonicus", "Salamandra artigliata giapponese", "Hynobiidae", "Asia", 17, "LC", "Artigli veri, coda prensile e branchie da giovane: vive nei torrenti gelidi delle montagne.", "#a88048", "#3a2e22", "caudata", "spotted", "Urodela"],
  ["Mertensiella luschani", "Salamandra di Licia", "Salamandridae", "Asia", 17, "EN", "Relitto del Mediterraneo orientale: partorisce piccoli già formati sui monti della Turchia.", "#2e2a22", "#e0a838", "caudata", "spotted", "Urodela"],
  ["Hemidactylium scutatum", "Salamandra a quattro dita", "Plethodontidae", "Nordamerica", 9, "LC", "Stacca la coda che continua a ballare per distrarre i predatori: ricresce, quasi sempre storta.", "#9a7850", "#c8a878", "caudata", "plain", "Urodela"],
];

/* paracadute: se per errore una specie fosse elencata due volte, ne mostriamo una sola */
const VISTI = new Set<string>();

export const ARCHIVE: ArchiveSpecies[] = ROWS.filter((r) => {
  if (VISTI.has(r[0])) return false;
  VISTI.add(r[0]);
  return true;
}).map((r) => ({
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
  order: r[11] ?? "Anura",
}));

export const FAMILIES: string[] = [...new Set(ARCHIVE.map((s) => s.family))].sort((a, b) =>
  a.localeCompare(b, "it")
);
