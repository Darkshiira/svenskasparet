export type Mode = "build" | "choice" | "missing";

export type Question = {
  id: string;
  prompt: string;
  answer: string;
  explanation: string;
  words?: string[];
  options?: string[];
};

// Keep the existing rows in order: their positions determine saved question IDs.
const buildRows = [
  [
    "Jag dricker vatten",
    "Jag",
    "I en vanlig påståendemening kommer subjektet först och verbet sedan: Jag dricker."
  ],
  [
    "Hon läser en bok",
    "Hon",
    "Hon är subjekt och läser är verb. En bok berättar vad hon läser."
  ],
  [
    "Vi går till skolan",
    "Vi",
    "Efter subjektet vi kommer verbet går. Till skolan berättar vart vi går."
  ],
  [
    "Barnen leker i parken",
    "Barnen",
    "Barnen är subjekt. Leker är verb och i parken berättar var de leker."
  ],
  [
    "Han lagar mat hemma",
    "Han",
    "Efter han kommer verbet lagar. Hemma berättar var han lagar mat."
  ],
  [
    "Idag arbetar jag hemma",
    "Idag",
    "När meningen börjar med idag kommer det finita verbet före subjektet: arbetar jag."
  ],
  [
    "Imorgon ska vi bada",
    "Imorgon",
    "Efter imorgon kommer det finita verbet ska, sedan vi och sist bada."
  ],
  [
    "På kvällen läser hon",
    "På kvällen",
    "På kvällen är ett sammanhållet tidsuttryck. Sedan kommer verbet läser och subjektet hon."
  ],
  [
    "Jag tycker om musik",
    "Jag",
    "Tycker om hör ihop och betyder att man gillar något."
  ],
  [
    "Vi vill köpa glass",
    "Vi",
    "Vill är hjälpverb. Efter vill använder vi grundformen köpa."
  ],
  [
    "Hon kan inte simma",
    "Hon",
    "I den här huvudsatsen står inte efter det finita verbet kan och före simma."
  ],
  [
    "De har en hund",
    "De",
    "De är subjekt, har är verb och en hund berättar vad de har."
  ],
  [
    "Du öppnar dörren",
    "Du",
    "Du är subjekt och öppnar är verb. Dörren berättar vad du öppnar."
  ],
  [
    "Katten sover på soffan",
    "Katten",
    "Efter subjektet katten kommer verbet sover. På soffan berättar var katten sover."
  ],
  [
    "Hunden jagar en boll",
    "Hunden",
    "Hunden är subjekt, jagar är verb och en boll är objekt."
  ],
  [
    "Min syster bakar bröd",
    "Min syster",
    "Min syster är subjektet. Därefter kommer verbet bakar och objektet bröd."
  ],
  [
    "Pojken ritar ett hus",
    "Pojken",
    "Pojken berättar vem som gör något. Ritar berättar vad han gör."
  ],
  [
    "Flickan skriver ett brev",
    "Flickan",
    "Efter subjektet flickan kommer verbet skriver och sedan objektet ett brev."
  ],
  [
    "Vi behöver nya skor",
    "Vi",
    "Vi är subjekt, behöver är verb och nya skor berättar vad vi behöver."
  ],
  [
    "De spelar fotboll",
    "De",
    "I den här påståendemeningen kommer subjektet de före verbet spelar."
  ],
  [
    "Jag måste städa rummet",
    "Jag",
    "Efter hjälpverbet måste använder vi grundformen städa."
  ],
  [
    "Du får låna cykeln",
    "Du",
    "Efter hjälpverbet får använder vi grundformen låna."
  ],
  [
    "Hon brukar dricka te",
    "Hon",
    "Efter brukar använder vi grundformen dricka."
  ],
  [
    "Vi ska besöka mormor",
    "Vi",
    "Ska följs av grundformen besöka. Mormor berättar vem vi ska besöka."
  ],
  [
    "Han har tappat nyckeln",
    "Han",
    "Har följs av supinumformen tappat."
  ],
  [
    "De har köpt biljetter",
    "De",
    "Efter har använder vi supinum: köpt."
  ],
  [
    "Jag är mycket hungrig",
    "Jag",
    "Efter är kommer beskrivningen mycket hungrig. Mycket förstärker hungrig."
  ],
  [
    "Soppan är för varm",
    "Soppan",
    "För varm betyder att soppan är varmare än man önskar. För står före varm."
  ],
  [
    "Idag regnar det",
    "Idag",
    "När idag står först kommer verbet regnar före subjektet det."
  ],
  [
    "Imorgon börjar skolan",
    "Imorgon",
    "Tidsordet imorgon följs av verbet börjar och subjektet skolan."
  ],
  [
    "Snart kommer bussen",
    "Snart",
    "När snart står först kommer verbet kommer före subjektet bussen."
  ],
  [
    "Nu stänger affären",
    "Nu",
    "Efter nu kommer verbet stänger och därefter subjektet affären."
  ],
  [
    "Igår ringde mamma",
    "Igår",
    "Igår berättar när det hände. Sedan kommer verbet ringde och subjektet mamma."
  ],
  [
    "På morgonen duschar jag",
    "På morgonen",
    "Tidsuttrycket på morgonen tar första platsen. Sedan kommer duschar jag."
  ],
  [
    "Efter maten diskar vi",
    "Efter maten",
    "Efter maten är ett sammanhållet tidsuttryck. Verbet diskar kommer före vi."
  ],
  [
    "I köket sitter pappa",
    "I köket",
    "När platsuttrycket i köket står först kommer verbet sitter före subjektet pappa."
  ],
  [
    "Jag vill inte gå",
    "Jag",
    "I den här huvudsatsen står inte mellan hjälpverbet vill och grundformen gå."
  ],
  [
    "Han äter inte fisk",
    "Han",
    "I den här huvudsatsen står inte efter verbet äter och före objektet fisk."
  ],
  [
    "Vi kan inte komma",
    "Vi",
    "I den här huvudsatsen står inte efter hjälpverbet kan och före komma."
  ],
  [
    "Hon måste gå hem",
    "Hon",
    "Efter måste kommer grundformen gå. Gå hem berättar att hon går till sitt hem."
  ]
];

const choiceRows = [
  [
    "Jag äter frukost.",
    "Jag frukost äter.",
    "I en enkel påståendemening kommer subjektet jag före verbet äter."
  ],
  [
    "Idag går jag till skolan.",
    "Idag jag går till skolan.",
    "När idag står först kommer det finita verbet direkt efter: går jag."
  ],
  [
    "Hon tycker inte om kaffe.",
    "Hon inte tycker om kaffe.",
    "I en huvudsats står inte vanligtvis efter det finita verbet: tycker inte."
  ],
  [
    "Var bor du?",
    "Var du bor?",
    "I en direkt fråga med var kommer verbet före subjektet: bor du."
  ],
  [
    "Vi ska laga mat.",
    "Vi ska lagar mat.",
    "Efter ska använder vi verbets grundform: laga."
  ],
  [
    "Imorgon kommer min vän.",
    "Imorgon min vän kommer.",
    "Efter det inledande tidsordet kommer det finita verbet, sedan subjektet."
  ],
  [
    "Kan du hjälpa mig?",
    "Du kan hjälpa mig?",
    "Den neutrala ja- eller nej-frågan börjar med verbet kan. Den andra formen kan användas som en förvånad bekräftelsefråga."
  ],
  [
    "Barnen vill leka ute.",
    "Barnen vill leker ute.",
    "Efter vill använder vi grundformen leka."
  ],
  [
    "På lördag arbetar hon.",
    "På lördag hon arbetar.",
    "På lördag tar första platsen. Därefter kommer verbet arbetar."
  ],
  [
    "Jag vet att hon inte kommer.",
    "Jag vet att hon kommer inte.",
    "I den här bisatsen med att står inte före det finita verbet kommer."
  ],
  [
    "Vad heter du?",
    "Vad du heter?",
    "I en direkt fråga står verbet efter frågeordet: Vad heter du?"
  ],
  [
    "Han har köpt en cykel.",
    "Han har köpa en cykel.",
    "Efter har använder vi supinum: köpt."
  ],
  [
    "Du behöver en jacka.",
    "Du en jacka behöver.",
    "I den här påståendemeningen kommer verbet behöver efter subjektet du."
  ],
  [
    "Katten sover på stolen.",
    "Katten på stolen sover.",
    "Den vanliga ordföljden här är subjekt, verb och plats: Katten sover på stolen."
  ],
  [
    "Nu börjar filmen.",
    "Nu filmen börjar.",
    "När nu står först kommer det finita verbet börjar före subjektet filmen."
  ],
  [
    "Snart kommer tåget.",
    "Snart tåget kommer.",
    "Efter snart kommer verbet kommer och sedan subjektet tåget."
  ],
  [
    "Igår köpte jag mjölk.",
    "Igår jag köpte mjölk.",
    "När igår står först kommer verbet köpte före jag."
  ],
  [
    "På morgonen dricker vi te.",
    "På morgonen vi dricker te.",
    "På morgonen tar första platsen. Sedan kommer verbet dricker och subjektet vi."
  ],
  [
    "I parken leker barnen.",
    "I parken barnen leker.",
    "När platsen står först kommer det finita verbet före subjektet: leker barnen."
  ],
  [
    "Efter jobbet handlar hon.",
    "Efter jobbet hon handlar.",
    "Efter jobbet är ett tidsuttryck. Därefter kommer verbet handlar."
  ],
  [
    "Jag kan inte komma.",
    "Jag inte kan komma.",
    "I den här huvudsatsen står inte efter det finita verbet kan."
  ],
  [
    "Vi ska inte resa.",
    "Vi inte ska resa.",
    "I den här huvudsatsen står inte mellan ska och resa."
  ],
  [
    "Han vill inte äta.",
    "Han vill äta inte.",
    "Här står inte efter hjälpverbet vill och före grundformen äta."
  ],
  [
    "Du måste vänta.",
    "Du måste väntar.",
    "Efter måste använder vi grundformen vänta."
  ],
  [
    "Hon brukar cykla.",
    "Hon brukar cyklar.",
    "Efter brukar använder vi grundformen cykla."
  ],
  [
    "Vi får låna bilen.",
    "Vi får lånar bilen.",
    "Efter hjälpverbet får använder vi grundformen låna."
  ],
  [
    "Jag har skrivit ett brev.",
    "Jag har skriva ett brev.",
    "Efter har använder vi supinumformen skrivit."
  ],
  [
    "De har ätit lunch.",
    "De har äter lunch.",
    "Har följs av supinum: ätit."
  ],
  [
    "Hon hade glömt nyckeln.",
    "Hon hade glömma nyckeln.",
    "Efter hade använder vi supinumformen glömt."
  ],
  [
    "När börjar lektionen?",
    "När lektionen börjar?",
    "I en direkt fråga kommer verbet efter frågeordet: När börjar lektionen?"
  ],
  [
    "Hur mår du?",
    "Hur du mår?",
    "I en direkt fråga kommer verbet mår före subjektet du."
  ],
  [
    "Varför skrattar hon?",
    "Varför hon skrattar?",
    "Efter frågeordet varför kommer verbet skrattar och sedan subjektet hon."
  ],
  [
    "Vart ska vi gå?",
    "Vart vi ska gå?",
    "Efter vart kommer det finita verbet ska före subjektet vi."
  ],
  [
    "Vilken bok läser du?",
    "Vilken bok du läser?",
    "Vilken bok är frågeuttrycket. Därefter kommer verbet läser och subjektet du."
  ],
  [
    "Jag undrar var hon bor.",
    "Jag undrar var bor hon.",
    "I den indirekta frågan var hon bor står subjektet hon före verbet bor."
  ],
  [
    "Hon frågar vad du heter.",
    "Hon frågar vad heter du.",
    "I den indirekta frågan står subjektet du före verbet heter."
  ],
  [
    "Vi stannar hemma eftersom det regnar.",
    "Vi stannar hemma eftersom regnar det.",
    "Efter eftersom står subjektet det före verbet regnar."
  ],
  [
    "Jag tror att hon kan simma.",
    "Jag tror att hon kan simmar.",
    "Efter kan använder vi grundformen simma, även i en bisats."
  ],
  [
    "Han säger att han inte vet.",
    "Han säger att han vet inte.",
    "I den här bisatsen står inte före det finita verbet vet."
  ],
  [
    "Jag är trött men glad.",
    "Jag är trött men glada.",
    "Adjektivet glad beskriver jag och står här i singular."
  ]
];

const missingRows = [
  [
    "Jag ___ en bok.",
    "läser",
    "läsa|läser|läst",
    "Läser är presens och passar när vi berättar vad jag gör nu."
  ],
  [
    "Imorgon ___ jag till skolan.",
    "går",
    "går|gå|gående",
    "Efter imorgon kommer verbet går. Presens kan också beskriva en planerad framtid."
  ],
  [
    "Hon kan ___ svenska.",
    "tala",
    "talar|talat|tala",
    "Efter kan använder vi grundformen tala."
  ],
  [
    "Vi bor ___ Stockholm.",
    "i",
    "på|i|till",
    "Vi använder i framför namnet på en stad när vi berättar var vi bor."
  ],
  [
    "Jag har ___ en film.",
    "sett",
    "ser|se|sett",
    "Efter har använder vi supinum: sett."
  ],
  [
    "Han är trött ___ han går och lägger sig.",
    "så",
    "så|att|men",
    "Så visar en följd: han är trött och därför går han och lägger sig."
  ],
  [
    "___ bor du? – I Malmö.",
    "Var",
    "Vem|Var|När",
    "Var frågar efter en plats."
  ],
  [
    "Vi ska ___ middag.",
    "laga",
    "lagar|laga|lagat",
    "Efter ska använder vi grundformen laga."
  ],
  [
    "Jag vet att han ___ är hemma.",
    "inte",
    "inte|ingen|inget",
    "Inte nekar handlingen. I den här bisatsen står inte före verbet är."
  ],
  [
    "Hon vill ___ en cykel.",
    "köpa",
    "köper|köpa|köpt",
    "Efter vill använder vi grundformen köpa."
  ],
  [
    "Jag tar bussen ___ jobbet.",
    "till",
    "på|till|hos",
    "Till visar vart jag är på väg."
  ],
  [
    "___ heter du? – Jag heter Sara.",
    "Vad",
    "Var|När|Vad",
    "Vi frågar efter någons namn med Vad heter du?"
  ],
  [
    "Du måste ___ här.",
    "vänta",
    "väntar|vänta|väntat",
    "Efter måste använder vi grundformen vänta."
  ],
  [
    "Hon brukar ___ till jobbet.",
    "cykla",
    "cyklat|cyklar|cykla",
    "Efter brukar använder vi grundformen cykla."
  ],
  [
    "Vi får ___ bilen.",
    "låna",
    "låna|lånar|lånat",
    "Efter hjälpverbet får använder vi grundformen låna."
  ],
  [
    "De har ___ lunch.",
    "ätit",
    "äta|äter|ätit",
    "Efter har använder vi supinumformen ätit."
  ],
  [
    "Jag har ___ ett brev.",
    "skrivit",
    "skriver|skrivit|skriva",
    "Har följs av supinum: skrivit."
  ],
  [
    "Hon hade ___ nyckeln.",
    "glömt",
    "glömmer|glömma|glömt",
    "Efter hade använder vi supinumformen glömt."
  ],
  [
    "Igår ___ jag en jacka.",
    "köpte",
    "köpa|köpte|köpt",
    "Igår visar att det hände i dåtid. Här använder vi preteritum: köpte."
  ],
  [
    "Just nu ___ barnen i parken.",
    "leker",
    "leka|lekt|leker",
    "Just nu beskriver något som pågår. Leker är presens."
  ],
  [
    "På morgonen dricker ___ kaffe.",
    "jag",
    "mig|min|jag",
    "Efter det finita verbet dricker behövs subjektet jag. Mig är objektsform."
  ],
  [
    "Idag ___ hon hemma.",
    "arbetar",
    "arbetar|arbeta|arbetat",
    "Efter idag kommer det finita verbet arbetar och sedan subjektet hon."
  ],
  [
    "Jag tycker ___ musik.",
    "om",
    "till|om|från",
    "Tycker om betyder gillar. Uttrycket behöver ordet om."
  ],
  [
    "Han lyssnar ___ radio.",
    "på",
    "i|på|till",
    "Uttrycket är lyssna på något, till exempel radio."
  ],
  [
    "Vi väntar ___ bussen.",
    "på",
    "hos|från|på",
    "Uttrycket är vänta på någon eller något."
  ],
  [
    "Hon pratar ___ sin syster.",
    "med",
    "att|med|och",
    "Med passar när hon har ett samtal med sin syster."
  ],
  [
    "Jag kommer ___ Sverige.",
    "från",
    "åt|mellan|från",
    "Från berättar vilket land jag kommer ifrån."
  ],
  [
    "Boken ligger ___ bordet.",
    "på",
    "på|till|från",
    "På beskriver här att boken ligger ovanpå bordet."
  ],
  [
    "Jag ger ___ en bok.",
    "henne",
    "hon|henne|hennes",
    "Efter ger använder vi objektsformen henne för personen som får boken."
  ],
  [
    "Kan du hjälpa ___?",
    "mig",
    "jag|min|mig",
    "Efter hjälpa använder vi objektsformen mig."
  ],
  [
    "Det här är ___ bok.",
    "min",
    "mig|min|jag",
    "Min visar vem boken tillhör. Bok är ett en-ord."
  ],
  [
    "Det här är ___ hus.",
    "mitt",
    "min|mitt|mina",
    "Hus är ett ett-ord, så vi använder mitt."
  ],
  [
    "Det här är ___ skor.",
    "mina",
    "mitt|min|mina",
    "Skor är plural, så vi använder mina."
  ],
  [
    "___ mår du? – Bra, tack!",
    "Hur",
    "Hur|Vem|Var",
    "Hur mår du? frågar hur någon känner sig."
  ],
  [
    "___ börjar filmen? – Klockan sju.",
    "När",
    "Var|När|Vem",
    "När frågar efter en tidpunkt."
  ],
  [
    "___ är det? – Det är min bror.",
    "Vem",
    "När|Vart|Vem",
    "Vem frågar efter en person."
  ],
  [
    "Jag undrar var hon ___.",
    "bor",
    "bo|bor|bott",
    "Här behövs ett finit verb. Bor är presens."
  ],
  [
    "Han säger att han ___ vet.",
    "inte",
    "ingen|inget|inte",
    "I den här bisatsen står inte före verbet vet."
  ],
  [
    "Jag är trött ___ jag vill vila.",
    "och",
    "att|och|som",
    "Och binder ihop två påståenden: jag är trött och jag vill vila."
  ],
  [
    "Hon stannar hemma ___ hon är sjuk.",
    "eftersom",
    "trots|eftersom|utan",
    "Eftersom inleder en bisats som förklarar orsaken till att hon stannar hemma."
  ]
];

export const questions: Record<Mode, Question[]> = {
  build: buildRows.map(([answer, start, explanation], i) => ({
    id: `build-${i}`,
    prompt: `Bygg en mening som börjar med ”${start}”.`,
    answer,
    explanation,
    words: answer.split(" "),
  })),
  choice: choiceRows.map(([answer, other, explanation], i) => ({
    id: `choice-${i}`,
    prompt:
      i === 6
        ? "Vilken är en neutral ja- eller nej-fråga?"
        : "Vilken mening har rätt ordföljd?",
    answer,
    explanation,
    options: [answer, other],
  })),
  missing: missingRows.map(([prompt, answer, options, explanation], i) => ({
    id: `missing-${i}`,
    prompt,
    answer,
    explanation,
    options: options.split("|"),
  })),
};
