export type IUCN = "LC" | "NT" | "VU" | "EN" | "CR" | "EX";
export type Pattern = "plain" | "spotted" | "striped" | "mottled";
export type Shape = "round" | "wide" | "slim";

export interface ArchiveSpecies {
  name: string;
  latin: string;
  family: string;
  region: string;
  sizeCm: number;
  status: IUCN;
  c1: string; // colore base
  c2: string; // colore accento/pattern
  pattern: Pattern;
  shape: Shape;
  note: string;
}

export const STATUS_META: Record<IUCN, { color: string; label: string }> = {
  LC: { color: "#86b832", label: "Minor preoccupazione" },
  NT: { color: "#c4cf3f", label: "Quasi minacciata" },
  VU: { color: "#e4c03a", label: "Vulnerabile" },
  EN: { color: "#e08e2e", label: "In pericolo" },
  CR: { color: "#d8542e", label: "In pericolo critico" },
  EX: { color: "#8f939b", label: "Estinta" },
};

export const STATUS_ORDER: IUCN[] = ["LC", "NT", "VU", "EN", "CR", "EX"];

type Row = [string, string, string, string, number, IUCN, string, string, Pattern, Shape, string];

const RAW: Row[] = [
  /* ---- Europa ---- */
  ["Raganella europea", "Hyla arborea", "Hylidae", "Europa", 5, "LC", "#6fae3c", "#d8ec9a", "plain", "round", "fischio da uccellino, ventose sulle dita"],
  ["Raganella tirrenica", "Hyla meridionalis", "Hylidae", "Europa", 6, "LC", "#7cb544", "#e6f2b0", "striped", "round", "una striscia scura le attraversa il fianco"],
  ["Raganella sarda", "Hyla sarda", "Hylidae", "Europa", 5, "LC", "#74a945", "#dce8a2", "plain", "round", "endemica di Sardegna, Corsica e Arcipelago Toscano"],
  ["Rana ridibonda", "Pelophylax ridibundus", "Ranidae", "Europa", 15, "LC", "#5f8f3e", "#cfe3a0", "spotted", "wide", "il gigante verde degli stagni europei"],
  ["Rana dei fossi", "Pelophylax lessonae", "Ranidae", "Europa", 7, "LC", "#7aa343", "#e2ee9e", "spotted", "round", "spesso si ibrida con la vicina di stagno"],
  ["Rana di Lataste", "Rana latastei", "Ranidae", "Europa", 7, "VU", "#a5764a", "#e0c9a0", "plain", "slim", "endemica della Pianura Padana"],
  ["Rana appenninica", "Rana italica", "Ranidae", "Europa", 6, "LC", "#8a6b46", "#d9c49a", "mottled", "slim", "vive nei ruscelli limpidi dell'Appennino"],
  ["Rana di monte", "Rana arvalis", "Ranidae", "Europa", 8, "NT", "#9a7a4e", "#a8c8e8", "plain", "round", "i maschi si tingono di blu in amore"],
  ["Rana iberica", "Rana iberica", "Ranidae", "Europa", 5, "NT", "#8a5f42", "#d8b090", "mottled", "slim", "la rana più piccola d'Europa"],
  ["Ululone ventrerosso", "Bombina bombina", "Bombinatoridae", "Europa", 5, "LC", "#6b7a4a", "#e8b33c", "mottled", "round", "ventre di fiamma per spaventare i predoni"],
  ["Rospo ostetrico", "Alytes obstetricans", "Alytidae", "Europa", 5, "LC", "#93845c", "#d8cba0", "spotted", "round", "il maschio porta le uova sulle zampe"],
  ["Discoglosso dipinto", "Discoglossus pictus", "Alytidae", "Europa", 7, "LC", "#a08a4e", "#e8d68e", "spotted", "round", "pupille a cuore e lingua rotonda"],
  ["Rospo spinoso", "Bufo spinosus", "Bufonidae", "Europa", 15, "LC", "#8a6a48", "#cbb188", "mottled", "wide", "pelle verrucosa, passo da filosofo"],
  ["Rospo smeraldino", "Bufotes balearicus", "Bufonidae", "Europa", 9, "LC", "#b5a66a", "#6f9a55", "mottled", "wide", "macchie smeraldo su fondo sabbia"],
  ["Pelodite punteggiato", "Pelodytes punctatus", "Pelodytidae", "Europa", 4, "LC", "#7d8f5a", "#d8e0b0", "spotted", "slim", "puntini verdi come prezzemolo"],
  ["Pelobate fosco", "Pelobates fuscus", "Pelobatidae", "Europa", 8, "NT", "#b09a6a", "#7a6a4a", "plain", "round", "scava all'indietro con pale cornee"],

  /* ---- Nord America ---- */
  ["Rana toro americana", "Lithobates catesbeianus", "Ranidae", "Nord America", 20, "LC", "#6e9a4a", "#dce8a0", "plain", "wide", "invasore temuto negli stagni europei"],
  ["Rana leopardo", "Lithobates pipiens", "Ranidae", "Nord America", 10, "LC", "#7fa84e", "#e8e8b0", "spotted", "slim", "macchie scure come un manto felino"],
  ["Rana verde americana", "Lithobates clamitans", "Ranidae", "Nord America", 9, "LC", "#6f9f4e", "#e0e8a0", "plain", "round", "timpano enorme, quasi un occhio in più"],
  ["Rana silvatica", "Lithobates sylvaticus", "Ranidae", "Nord America", 7, "LC", "#a08050", "#d8b070", "plain", "round", "si congela d'inverno e rinasce in primavera"],
  ["Anaxiro americano", "Anaxyrus americanus", "Bufonidae", "Nord America", 10, "LC", "#8a6a4a", "#c8a878", "mottled", "wide", "canta come un trillo telefonico"],
  ["Anaxiro boreale", "Anaxyrus boreas", "Bufonidae", "Nord America", 11, "NT", "#9a8a5a", "#b8a068", "mottled", "wide", "in declino sulle montagne dell'Ovest"],
  ["Pseudacride crocifera", "Pseudacris crucifer", "Hylidae", "Nord America", 3.5, "LC", "#a09070", "#e0d0b0", "striped", "round", "campanellini di aprile nelle paludi"],
  ["Pseudacride del Pacifico", "Pseudacris regilla", "Hylidae", "Nord America", 5, "LC", "#8fae5a", "#e8e8b8", "plain", "round", "la voce più usata nei film"],
  ["Acris crepitante", "Acris crepitans", "Hylidae", "Nord America", 3, "LC", "#9a9a70", "#d8d8b0", "spotted", "slim", "schiocca come un grillo sul pelo dell'acqua"],
  ["Pelobate di Holbrook", "Scaphiopus holbrookii", "Scaphiopodidae", "Nord America", 6, "LC", "#b0a070", "#7a7050", "striped", "round", "esplode in cori dopo i temporali"],
  ["Rospo del Colorado", "Incilius alvarius", "Bufonidae", "Nord America", 15, "LC", "#8f7a50", "#c8b080", "plain", "wide", "pelle psicotropa: vietato leccarla"],
  ["Rana con la coda", "Ascaphus truei", "Ascaphidae", "Nord America", 5, "LC", "#7a7a5a", "#b8b890", "mottled", "slim", "falsa coda per nuotare nei torrenti"],

  /* ---- Centro America ---- */
  ["Raganella di Morelet", "Agalychnis moreletii", "Hylidae", "Centro America", 8, "NT", "#4e9a5a", "#c8e8c0", "plain", "round", "occhi d'oro per cacciare di notte"],
  ["Smilisca di Baudin", "Smilisca baudinii", "Hylidae", "Centro America", 7, "LC", "#7fae60", "#dce8b8", "plain", "round", "si finge un sasso quando piove"],
  ["Rana che abbaia", "Craugastor augusti", "Craugastoridae", "Centro America", 5, "LC", "#8a6a4a", "#c8a878", "spotted", "round", "latra come un cane in miniatura"],
  ["Rospo dorato", "Incilius periglenes", "Bufonidae", "Centro America", 5, "EX", "#e8a020", "#f8c850", "plain", "round", "ultima femmina avvistata nel 1989"],
  ["Atelopo dorato", "Atelopus zeteki", "Bufonidae", "Centro America", 5, "CR", "#e8b820", "#202018", "plain", "round", "simbolo nazionale di Panama"],
  ["Atelopo variopinto", "Atelopus varius", "Bufonidae", "Centro America", 4, "CR", "#e8c830", "#30382a", "mottled", "round", "arlecchino dei torrenti, quasi sparito"],
  ["Rana di Rabbs", "Ecnomiohyla rabborum", "Hylidae", "Centro America", 10, "CR", "#6e8a4e", "#a8b878", "striped", "slim", "l'ultimo maschio è morto in cattività nel 2016"],
  ["Coquí portoricano", "Eleutherodactylus coqui", "Craugastoridae", "Centro America", 5, "LC", "#a89a6a", "#e0d8b0", "striped", "round", "«ko-QUÍ», la voce di Porto Rico"],
  ["Rana di vetro", "Hyalinobatrachium fleischmanni", "Centrolenidae", "Centro America", 3, "LC", "#b8d890", "#e8f8d8", "plain", "round", "il cuore si vede battere dal ventre"],

  /* ---- Sud America ---- */
  ["Rospo delle canne", "Rhinella marina", "Bufonidae", "Sud America", 20, "LC", "#9a8055", "#d0b888", "mottled", "wide", "invasore disastroso in Australia"],
  ["Dendrobate smeraldo", "Dendrobates auratus", "Dendrobatidae", "Sud America", 4, "LC", "#3e8a4a", "#102810", "mottled", "round", "verde e nero come un mosaico"],
  ["Dendrobate a bande", "Dendrobates leucomelas", "Dendrobatidae", "Sud America", 4, "LC", "#e8c820", "#181810", "striped", "round", "giallo e nero, come un cartello di pericolo"],
  ["Oofaga fragola", "Oophaga pumilio", "Dendrobatidae", "Sud America", 2.5, "LC", "#d84020", "#28305a", "plain", "round", "le madri nutrono i girini con uova non fecondate"],
  ["Oofaga granulare", "Oophaga granulifera", "Dendrobatidae", "Sud America", 3, "VU", "#e05020", "#3040a0", "plain", "round", "rosso vivo con zampe blu cobalto"],
  ["Ranitomia imitatrice", "Ranitomeya imitator", "Dendrobatidae", "Sud America", 2, "LC", "#e8b020", "#181810", "striped", "round", "copia le livree dei vicini tossici"],
  ["Fillopate bicolore", "Phyllobates bicolor", "Dendrobatidae", "Sud America", 4, "EN", "#e8a020", "#38301a", "plain", "round", "cugina arancione del dorato letale"],
  ["Amererga striata", "Ameerega trivittata", "Dendrobatidae", "Sud America", 5, "LC", "#28281c", "#e8d030", "striped", "slim", "tre strisce gialle su fondo notte"],
  ["Epipedobate di Anthony", "Epipedobates anthonyi", "Dendrobatidae", "Sud America", 3, "LC", "#8a4030", "#e8d8b0", "striped", "round", "dal suo veleno è nata l'epibatidina"],
  ["Leptodattilo gigante", "Leptodactylus pentadactylus", "Leptodactylidae", "Sud America", 18, "LC", "#8a6a4a", "#c8a878", "spotted", "wide", "muggisce come un giovane toro"],
  ["Fisalemide tungara", "Physalaemus pustulosus", "Leptodactylidae", "Sud America", 3, "LC", "#7a5a3a", "#b89868", "mottled", "round", "aggiunge un «chuck» al canto per sedurre"],
  ["Rana cornuta argentina", "Ceratophrys ornata", "Ceratophryidae", "Sud America", 17, "NT", "#6ea04a", "#d8e890", "mottled", "wide", "bocca più larga che lunga"],
  ["Rana cornuta amazzonica", "Ceratophrys cornuta", "Ceratophryidae", "Sud America", 16, "LC", "#b08040", "#6e5030", "mottled", "wide", "corna di pelle sopra gli occhi"],
  ["Rana del Titicaca", "Telmatobius culeus", "Telmatobiidae", "Sud America", 14, "CR", "#6e7a4a", "#a8b078", "plain", "wide", "respira solo con le pieghe della pelle"],
  ["Boana punteggiata", "Boana punctata", "Hylidae", "Sud America", 7, "LC", "#d8d8c0", "#4e7a9a", "plain", "round", "occhi smeraldo e pelle di pergamena"],
  ["Pipa del Suriname", "Pipa pipa", "Pipidae", "Sud America", 15, "LC", "#7a6a4a", "#a89870", "mottled", "wide", "i girini crescono nella schiena della madre"],
  ["Rana di Darwin", "Rhinoderma darwinii", "Rhinodermatidae", "Sud America", 3, "CR", "#6e8a4e", "#d8e8b0", "plain", "slim", "il padre cova i piccoli nel sacco vocale"],
  ["Pristimante di Gaige", "Pristimantis gaigeae", "Strabomantidae", "Sud America", 3, "LC", "#4a6a5a", "#d83020", "plain", "round", "occhi rossi che brillano nella nebbia"],
  ["Rana zucca", "Brachycephalus ephippium", "Brachycephalidae", "Sud America", 1.5, "LC", "#e88020", "#f8b040", "plain", "round", "così piccola da stare su un'unghia"],
  ["Psillofrine minuscola", "Psyllophryne didactyla", "Brachycephalidae", "Sud America", 1, "LC", "#a08050", "#c8a878", "plain", "round", "tra i vertebrati più piccoli del mondo"],
  ["Odontofrine americano", "Odontophrynus americanus", "Odontophrynidae", "Sud America", 5, "LC", "#6e5a3e", "#a89068", "mottled", "round", "canta sott'acqua nelle pozze fangose"],

  /* ---- Madagascar ---- */
  ["Mantella dorata", "Mantella aurantiaca", "Mantellidae", "Madagascar", 3, "CR", "#e89020", "#f8b848", "plain", "round", "collezionisti e miniere la stringono d'assedio"],
  ["Mantella bruna", "Mantella madagascariensis", "Mantellidae", "Madagascar", 3, "EN", "#8a5a3a", "#c88840", "plain", "round", "zampe arancio come braci"],
  ["Boofide labbra bianche", "Boophis tephraeomystax", "Mantellidae", "Madagascar", 5, "LC", "#7aa85a", "#e8e8d0", "plain", "round", "labbra bianche e occhi di vetro"],
  ["Discofide di Guinet", "Dyscophus guineti", "Microhylidae", "Madagascar", 8, "NT", "#c85028", "#f8a860", "plain", "round", "la «sorella» arancione della rana pomodoro"],
  ["Rana arcobaleno", "Scaphiophryne gottlebei", "Microhylidae", "Madagascar", 3, "EN", "#d84030", "#4a6e4a", "mottled", "round", "si fa rotolare come una pallina nel fango"],
  ["Agliptodattilo", "Aglyptodactylus madagascariensis", "Mantellidae", "Madagascar", 6, "NT", "#8aa05a", "#d8e0a8", "plain", "round", "saltatrice delle risaie malgasce"],
  ["Mantidattilo maggiore", "Mantidactylus grandidieri", "Mantellidae", "Madagascar", 6, "LC", "#7a8a4e", "#b8c888", "striped", "slim", "depone le uova a terra, non in acqua"],

  /* ---- Africa ---- */
  ["Iperolio marmorato", "Hyperolius marmoratus", "Hyperoliidae", "Africa", 4, "LC", "#c8c8a8", "#5a7a4a", "mottled", "round", "pupille orizzontali da canna al sole"],
  ["Iperolio verde", "Hyperolius viridiflavus", "Hyperoliidae", "Africa", 3, "LC", "#a8c840", "#d84830", "striped", "round", "occhi rossi e strisce da semaforo"],
  ["Afracale dorato", "Afrixalus aureus", "Hyperoliidae", "Africa", 3, "LC", "#d8b040", "#6e5030", "striped", "slim", "piega le foglie in culle per le uova"],
  ["Cassina maculata", "Kassina maculata", "Hyperoliidae", "Africa", 5, "LC", "#9a8a6a", "#3a3020", "spotted", "round", "cammina piano, in punta di piedi"],
  ["Chiromantide spumosa", "Chiromantis xerampelina", "Rhacophoridae", "Africa", 9, "LC", "#c8c0a8", "#e8e0c8", "plain", "round", "costruisce nidi di schiuma sugli alberi"],
  ["Pissicefalo commestibile", "Pyxicephalus edulis", "Pyxicephalidae", "Africa", 12, "LC", "#6e8a4e", "#a8b878", "spotted", "wide", "cugina minore del toro africano"],
  ["Xenopo liscio", "Xenopus laevis", "Pipidae", "Africa", 13, "LC", "#8a7a5a", "#b8a880", "plain", "slim", "star dei laboratori di biologia dal 1930"],
  ["Imenochiro di Boettger", "Hymenochirus boettgeri", "Pipidae", "Africa", 4, "LC", "#9a8a6a", "#c8b890", "plain", "slim", "unghie vere, rarità tra gli anfibi"],
  ["Rospo fantasma", "Heleophryne rosei", "Heleophrynidae", "Africa", 5, "CR", "#7a8a6a", "#b8c8a0", "mottled", "slim", "vive solo sotto una cascata del Sudafrica"],
  ["Brevicepite scavatore", "Breviceps adspersus", "Brevicipitidae", "Africa", 6, "LC", "#a09068", "#705f42", "mottled", "round", "una palla di sabbia con gli occhi"],

  /* ---- Asia ---- */
  ["Nasikabatraco purpureo", "Nasikabatrachus sahyadrensis", "Nasikabatrachidae", "Asia", 9, "EN", "#7a4a7a", "#b898c0", "plain", "wide", "passa l'anno sottoterra, esce solo per amare"],
  ["Rana tigre indiana", "Hoplobatrachus tigerinus", "Dicroglossidae", "Asia", 17, "LC", "#5e8a3e", "#c8e0a0", "mottled", "wide", "tigre delle risaie del subcontinente"],
  ["Caloula dipinta", "Kaloula pulchra", "Microhylidae", "Asia", 7, "LC", "#5a4a3a", "#e8c878", "striped", "round", "si gonfia come un palloncino da festa"],
  ["Chaperina fusca", "Chaperina fusca", "Microhylidae", "Asia", 2.5, "LC", "#8a7050", "#b8a080", "plain", "round", "il maschio cova le uova tra le mani"],
  ["Megofride dal naso", "Megophrys nasuta", "Megophryidae", "Asia", 12, "LC", "#8a6a4a", "#5a4530", "striped", "wide", "una foglia morta con le zanne finte"],
  ["Teloderma corticale", "Theloderma corticale", "Rhacophoridae", "Asia", 8, "LC", "#4e6e4a", "#c84030", "mottled", "round", "si camuffa da muschio bagnato"],
  ["Rana volante di Wallace", "Rhacophorus nigropalmatus", "Rhacophoridae", "Asia", 10, "NT", "#3e7a4a", "#e88820", "plain", "round", "planate di 15 metri tra gli alberi"],
  ["Zhangixalus arboricolo", "Zhangixalus arboreus", "Rhacophoridae", "Asia", 8, "LC", "#6ea05a", "#d8e8b8", "plain", "round", "uova in nidi di schiuma sopra l'acqua"],
  ["Euphlyctis pattinatrice", "Euphlyctis cyanophlyctis", "Dicroglossidae", "Asia", 7, "LC", "#5e8a4a", "#b8d890", "striped", "slim", "pattina sulla superficie dell'acqua"],

  /* ---- Oceania ---- */
  ["Littoria gigante", "Litoria infrafrenata", "Hylidae", "Oceania", 14, "LC", "#4e9a4a", "#f8f8e0", "plain", "round", "la rana arboricola più grande del mondo"],
  ["Littoria campanella", "Litoria aurea", "Hylidae", "Oceania", 8, "VU", "#6ea04a", "#e8c820", "striped", "round", "mascotte delle Olimpiadi di Sydney"],
  ["Corroboree meridionale", "Pseudophryne corroboree", "Myobatrachidae", "Oceania", 3, "CR", "#e8d020", "#181810", "striped", "round", "restano meno di 100 adulti in natura"],
  ["Reobatraco gastrico", "Rheobatrachus silus", "Myobatrachidae", "Oceania", 6, "EX", "#8a8a6a", "#b8b890", "plain", "round", "incubava i girini nello stomaco"],
  ["Assa con la borsa", "Assa darlingtoni", "Myobatrachidae", "Oceania", 2.5, "LC", "#a08050", "#c8a878", "striped", "round", "il maschio porta i piccoli nelle tasche"],
  ["Limnodinate banjo", "Limnodynastes dumerilii", "Myobatrachidae", "Oceania", 8, "LC", "#8a7050", "#c8b088", "mottled", "round", "canta come un vecchio banjo"],
];

export const ARCHIVE: ArchiveSpecies[] = RAW.map(
  ([name, latin, family, region, sizeCm, status, c1, c2, pattern, shape, note]) => ({
    name, latin, family, region, sizeCm, status, c1, c2, pattern, shape, note,
  })
);

export const REGIONS = ["Tutte", ...Array.from(new Set(RAW.map((r) => r[3])))];

export const FAMILIES = Array.from(new Set(RAW.map((r) => r[2]))).sort();
