// Exercise content and shared types for Grunder & hälsningar.
// Icon references are included; JSX rendering stays in the page.

import {
  Apple,
  Bird,
  BookOpen,
  Bus,
  Car,
  Cat,
  Coffee,
  Dog,
  Fish,
  Flower2,
  House,
  KeyRound,
  Milk,
  Shirt,
  ShoppingBasket,
  Sofa,
  TreePine,
  Umbrella,
} from "lucide-react";

export type Mode = "situations" | "positions" | "listen";
export type Place = "park" | "shop" | "restaurant" | "home" | "bus";
export type Position =
  | "på"
  | "under"
  | "i"
  | "bredvid"
  | "mellan"
  | "ovanför"
  | "bakom"
  | "framför"
  | "till vänster om"
  | "till höger om";
export type Situation = {
  id: string;
  place: Place;
  title: string;
  context: string;
  speech: string;
  answer: string;
  options: string[];
  reply: string;
  explanation: string;
};
export type PositionQuestion = {
  id: string;
  position: Position;
  prompt: string;
  answer: Position;
  options: Position[];
  explanation: string;
};
export const vocabulary = [
  { id: "apple", word: "ett äpple", Icon: Apple, color: "#bd6559" },
  { id: "book", word: "en bok", Icon: BookOpen, color: "#6c80a3" },
  { id: "coffee", word: "en kopp kaffe", Icon: Coffee, color: "#a1744e" },
  { id: "key", word: "en nyckel", Icon: KeyRound, color: "#ad883a" },
  { id: "bus", word: "en buss", Icon: Bus, color: "#c49a3b" },
  { id: "car", word: "en bil", Icon: Car, color: "#5a82a6" },
  { id: "cat", word: "en katt", Icon: Cat, color: "#b17c56" },
  { id: "dog", word: "en hund", Icon: Dog, color: "#89705c" },
  { id: "bird", word: "en fågel", Icon: Bird, color: "#73966f" },
  { id: "fish", word: "en fisk", Icon: Fish, color: "#619ca8" },
  { id: "flower", word: "en blomma", Icon: Flower2, color: "#b26c8b" },
  { id: "house", word: "ett hus", Icon: House, color: "#b87b58" },
  { id: "milk", word: "mjölk", Icon: Milk, color: "#6b8fa5" },
  { id: "shirt", word: "en tröja", Icon: Shirt, color: "#9478a7" },
  { id: "sofa", word: "en soffa", Icon: Sofa, color: "#6f9689" },
  { id: "tree", word: "ett träd", Icon: TreePine, color: "#48836c" },
  { id: "umbrella", word: "ett paraply", Icon: Umbrella, color: "#af7b9c" },
  { id: "basket", word: "en korg", Icon: ShoppingBasket, color: "#a48a51" },
];
export type Vocabulary = (typeof vocabulary)[number];
export const situations: Situation[] = [
  {
    id: "hello",
    place: "park",
    title: "Möt en granne",
    context:
      "Du möter din granne i parken. Du vill hälsa och fråga hur grannen mår.",
    speech: "Hej!",
    answer: "Hej! Hur mår du?",
    options: [
      "Hej! Hur mår du?",
      "Hej då! Vi ses snart!",
      "Tack, jag mår bra.",
      "Jag heter Sam.",
    ],
    reply: "Jag mår bra, tack! Och du?",
    explanation:
      "Börja med att hälsa tillbaka. Frågan ”Hur mår du?” visar att du vill veta hur personen känner sig. ”Jag mår bra” är ett svar på frågan.",
  },
  {
    id: "feeling",
    place: "park",
    title: "Hur mår du?",
    context:
      "Du träffar en vän. Du mår bra och vill också fråga hur din vän mår.",
    speech: "Hur mår du?",
    answer: "Jag mår bra, tack! Och du?",
    options: [
      "Jag mår bra, tack! Och du?",
      "Jag heter Sam. Och du?",
      "Jag bor i Stockholm. Och du?",
      "Jag kommer från Sverige. Och du?",
    ],
    reply: "Jag mår också bra!",
    explanation:
      "”Hur mår du?” handlar om hur du känner dig. ”Och du?” är ett kort sätt att ställa samma fråga tillbaka. Namn, bostadsort och ursprung svarar på andra frågor.",
  },
  {
    id: "name",
    place: "park",
    title: "En ny bekantskap",
    context:
      "Du heter Sam och träffar Alex för första gången. Alex frågar efter ditt namn.",
    speech: "Jag heter Alex. Vad heter du?",
    answer: "Jag heter Sam. Trevligt att träffas!",
    options: [
      "Jag heter Sam. Trevligt att träffas!",
      "Jag mår bra. Trevligt att träffas!",
      "Jag bor här. Trevligt att träffas!",
      "Jag kommer hit ofta. Trevligt att träffas!",
    ],
    reply: "Trevligt att träffas, Sam!",
    explanation:
      "Frågan ”Vad heter du?” handlar om ditt namn. Svara med ”Jag heter” och ditt namn. ”Trevligt att träffas” är en vänlig fras när ni möts för första gången.",
  },
  {
    id: "goodbye",
    place: "park",
    title: "Dags att gå",
    context:
      "Din vän ska gå hem. Du vill säga hej då och bekräfta att ni ses nästa dag.",
    speech: "Nu måste jag gå. Vi ses i morgon!",
    answer: "Hej då! Vi ses i morgon!",
    options: [
      "Hej då! Vi ses i morgon!",
      "Välkommen! Kom och sätt dig!",
      "Hej! Vad roligt att du kom!",
      "God morgon! Har du sovit gott?",
    ],
    reply: "Ja, det gör vi. Hej då!",
    explanation:
      "”Hej då” avslutar mötet. Med ”Vi ses i morgon” bekräftar du att ni ska träffas nästa dag. ”Välkommen” använder du när någon kommer.",
  },
  {
    id: "repeat",
    place: "park",
    title: "Kan du säga det igen?",
    context:
      "En person berättar sitt namn, men du hör inte vad personen säger. Du vill höra namnet igen.",
    speech: "Hej! Jag heter …",
    answer: "Ursäkta, kan du säga ditt namn igen?",
    options: [
      "Ursäkta, kan du säga ditt namn igen?",
      "Kan du skriva min adress?",
      "Vill du veta vad jag heter?",
      "Kan du berätta var du bor?",
    ],
    reply: "Självklart! Jag heter Robin.",
    explanation:
      "”Kan du säga … igen?” ber personen att upprepa något. ”Ursäkta” är ett vänligt sätt att inleda frågan när du inte hörde.",
  },
  {
    id: "speak-slowly",
    place: "park",
    title: "Lite långsammare",
    context:
      "Du övar på svenska. Personen pratar så fort att du har svårt att förstå. Du vill fortsätta samtalet på svenska.",
    speech: "Jag kan berätta hur du hittar till biblioteket.",
    answer: "Tack! Kan du prata lite långsammare?",
    options: [
      "Tack! Kan du prata lite långsammare?",
      "Tack! Kan du prata lite snabbare?",
      "Tack! Kan du byta till engelska?",
      "Tack! Vill du att jag visar vägen?",
    ],
    reply: "Absolut. Jag tar det långsamt.",
    explanation:
      "”Långsammare” betyder att prata i lägre tempo. Frasen hjälper dig att fortsätta öva på svenska när någon pratar för fort.",
  },
  {
    id: "store-find",
    place: "shop",
    title: "Hitta i affären",
    context:
      "Du vill köpa mjölk men hittar den inte. Du ber personalen visa var den finns.",
    speech: "Hej! Behöver du hjälp?",
    answer: "Ja tack, var finns mjölken?",
    options: [
      "Ja tack, var finns mjölken?",
      "Ja tack, vad kostar mjölken?",
      "Ja tack, kan jag betala mjölken här?",
      "Ja tack, hur länge håller mjölken?",
    ],
    reply: "Mjölken finns i kylen längst bort.",
    explanation:
      "”Var finns …?” frågar efter en plats. ”Vad kostar …?” frågar efter priset. Här behöver du hitta mjölken, så du frågar var den finns.",
  },
  {
    id: "store-price",
    place: "shop",
    title: "Vad kostar det?",
    context:
      "Du vill köpa ett äpple, men du ser ingen prislapp. Du vill veta priset.",
    speech: "Hej! Kan jag hjälpa dig?",
    answer: "Ja, vad kostar det här äpplet?",
    options: [
      "Ja, vad kostar det här äpplet?",
      "Ja, varifrån kommer det här äpplet?",
      "Ja, var finns fler sådana här äpplen?",
      "Ja, kan jag få en påse till äpplet?",
    ],
    reply: "Det kostar fem kronor.",
    explanation:
      "”Vad kostar …?” använder du när du vill veta priset på något. Svaret brukar innehålla ett belopp, till exempel ”fem kronor”.",
  },
  {
    id: "store-bag",
    place: "shop",
    title: "En egen påse",
    context:
      "Du står i kassan. Du har med dig en tygpåse och vill inte köpa någon ny.",
    speech: "Vill du ha en påse?",
    answer: "Nej tack, jag har en egen.",
    options: [
      "Nej tack, jag har en egen.",
      "Ja tack, en liten påse.",
      "Ja tack, jag behöver två.",
      "Ja tack, vad kostar den?",
    ],
    reply: "Då kan du packa varorna i din påse.",
    explanation:
      "”Nej tack” är ett vänligt sätt att tacka nej. ”Jag har en egen” förklarar att du redan har en påse med dig.",
  },
  {
    id: "store-card",
    place: "shop",
    title: "Betala med kort",
    context: "Du ska betala för dina varor. Du vill använda ditt bankkort.",
    speech: "Vill du betala med kort eller kontanter?",
    answer: "Med kort, tack.",
    options: [
      "Med kort, tack.",
      "Med kontanter, tack.",
      "Jag vill lämna tillbaka varorna.",
      "Jag vill hämta en vara till först.",
    ],
    reply: "Då kan du använda kortläsaren här.",
    explanation:
      "”Med kort” betyder att du använder ett bankkort. ”Kontanter” är sedlar och mynt. Frågan handlar om vilket betalningssätt du vill använda.",
  },
  {
    id: "store-receipt",
    place: "shop",
    title: "Spara kvittot",
    context:
      "Du har betalat. Du vill ha ett kvitto för att kunna se vad du har köpt.",
    speech: "Vill du ha kvittot?",
    answer: "Ja tack, jag vill gärna ha det.",
    options: [
      "Ja tack, jag vill gärna ha det.",
      "Nej tack, du kan slänga det.",
      "Nej tack, jag behöver inget kvitto.",
      "Jag vill betala med ett annat kort.",
    ],
    reply: "Varsågod, här är ditt kvitto.",
    explanation:
      "Ett kvitto visar vad du har köpt och betalat. ”Jag vill gärna ha det” betyder att du tackar ja. Ordet ”det” syftar här på kvittot.",
  },
  {
    id: "table",
    place: "restaurant",
    title: "Ett bord för två",
    context:
      "Du och en vän vill äta på restaurangen. Ni är två personer och har inte bokat bord.",
    speech: "Hej och välkomna! Hur många är ni?",
    answer: "Vi är två. Har ni ett ledigt bord?",
    options: [
      "Vi är två. Har ni ett ledigt bord?",
      "Vi är tre. Har ni ett ledigt bord?",
      "Jag har bokat ett bord för två.",
      "Jag vill boka ett bord till i morgon.",
    ],
    reply: "Ja, det har vi. Följ med mig!",
    explanation:
      "”Hur många är ni?” frågar efter antalet personer. ”Vi är två” svarar på frågan. Ett ”ledigt bord” är ett bord som ni kan få sitta vid.",
  },
  {
    id: "menu",
    place: "restaurant",
    title: "Titta på menyn",
    context:
      "Du har precis satt dig vid bordet. Du vill läsa vilka maträtter som finns innan du beställer.",
    speech: "Hej! Vad kan jag hjälpa dig med?",
    answer: "Kan jag få menyn, tack?",
    options: [
      "Kan jag få menyn, tack?",
      "Kan jag få notan, tack?",
      "Kan jag få ett kvitto, tack?",
      "Kan jag boka ett bord till i morgon?",
    ],
    reply: "Självklart, här är menyn.",
    explanation:
      "Menyn visar vilken mat och dryck du kan beställa. Notan visar vad du ska betala efter måltiden. ”Kan jag få …?” är ett vanligt sätt att be om något.",
  },
  {
    id: "order",
    place: "restaurant",
    title: "Något att dricka",
    context: "Du vill beställa ett glas vatten till maten.",
    speech: "Vad vill du dricka?",
    answer: "Ett glas vatten, tack.",
    options: [
      "Ett glas vatten, tack.",
      "En kopp kaffe, tack.",
      "Ett glas mjölk, tack.",
      "En kopp te, tack.",
    ],
    reply: "Absolut, jag kommer med vatten.",
    explanation:
      "Frågan handlar om dryck. Alla alternativen är beställningar, men ”ett glas vatten” passar det du vill ha i situationen. ”Tack” gör beställningen vänlig.",
  },
  {
    id: "restaurant-missing",
    place: "restaurant",
    title: "Något saknas",
    context: "Din mat har kommit, men du har ingen gaffel. Du vill be om en.",
    speech: "Är det något du behöver?",
    answer: "Ja tack, kan jag få en gaffel?",
    options: [
      "Ja tack, kan jag få en gaffel?",
      "Ja tack, kan jag få en sked?",
      "Ja tack, kan jag få en servett?",
      "Ja tack, kan jag få ett glas?",
    ],
    reply: "Självklart! Jag hämtar en gaffel.",
    explanation:
      "En gaffel är ett bestick som du använder för att ta upp mat. En sked används till exempel till soppa. Be om det föremål som saknas.",
  },
  {
    id: "bill",
    place: "restaurant",
    title: "Dags att betala",
    context:
      "Du och din vän har ätit färdigt. Ni vill inte beställa mer och vill nu betala.",
    speech: "Är det något mer ni önskar?",
    answer: "Nej tack. Kan vi få notan?",
    options: [
      "Nej tack. Kan vi få notan?",
      "Ja tack. Kan vi få dessertmenyn?",
      "Ja tack. Vi vill beställa mer mat.",
      "Ja tack. Två koppar kaffe, tack.",
    ],
    reply: "Självklart, jag hämtar den.",
    explanation:
      "”Nej tack” visar att ni inte vill beställa mer. Med ”Kan vi få notan?” ber ni att få veta vad måltiden kostar så att ni kan betala.",
  },
  {
    id: "guest",
    place: "home",
    title: "En kopp te",
    context: "Du besöker en vän som erbjuder dig te. Du vill gärna ha en kopp.",
    speech: "Vill du ha en kopp te?",
    answer: "Ja tack, gärna!",
    options: [
      "Ja tack, gärna!",
      "Nej tack, inte just nu.",
      "Nej tack, jag dricker inte te.",
      "Nej tack, jag har precis druckit.",
    ],
    reply: "Då sätter jag på vatten.",
    explanation:
      "”Ja tack” betyder att du tackar ja till erbjudandet. ”Gärna” förstärker att du vill ha det som erbjuds. De andra svaren tackar nej.",
  },
  {
    id: "guest-decline",
    place: "home",
    title: "Tacka nej",
    context:
      "Din vän erbjuder dig mer kaffe. Du har druckit tillräckligt och vill inte ha mer.",
    speech: "Vill du ha lite mer kaffe?",
    answer: "Nej tack, det är bra.",
    options: [
      "Nej tack, det är bra.",
      "Ja tack, gärna lite till.",
      "Ja tack, en halv kopp räcker.",
      "Ja tack, men utan mjölk.",
    ],
    reply: "Då säger du till om du vill ha något annat.",
    explanation:
      "”Nej tack, det är bra” är ett vanligt sätt att vänligt tacka nej. Här betyder ”det är bra” att du är nöjd och inte behöver mer.",
  },
  {
    id: "guest-thanks",
    place: "home",
    title: "Tack för maten",
    context:
      "Du har ätit middag hos en vän. Du vill tacka vännen för måltiden.",
    speech: "Vad trevligt att du kunde komma och äta med oss!",
    answer: "Tack för maten! Det var jättegott.",
    options: [
      "Tack för maten! Det var jättegott.",
      "Tack för inbjudan! Vilken tid ska jag komma?",
      "Tack för hjälpen! Nu klarar jag uppgiften.",
      "Tack för presenten! Den var jättefin.",
    ],
    reply: "Vad roligt att du tyckte om maten!",
    explanation:
      "”Tack för maten” använder du för att tacka efter en måltid. Efter ”tack för” kan du säga vad du uppskattar, till exempel maten, hjälpen eller presenten.",
  },
  {
    id: "guest-goodnight",
    place: "home",
    title: "Dags att sova",
    context: "Det är sent på kvällen. Du och din familj ska gå och lägga er.",
    speech: "Nu går jag och lägger mig.",
    answer: "God natt! Sov gott!",
    options: [
      "God natt! Sov gott!",
      "God morgon! Har du sovit gott?",
      "Välkommen hem! Hur var dagen?",
      "Trevlig resa! Vi hörs när du är framme.",
    ],
    reply: "God natt! Sov gott du också.",
    explanation:
      "”God natt” säger vi när någon ska sova. ”Sov gott” är en önskan om att personen ska få en bra natts sömn. ”God morgon” passar när dagen börjar.",
  },
  {
    id: "bus",
    place: "bus",
    title: "Rätt buss?",
    context:
      "Du står vid en buss och vill åka till centrum. Du behöver veta om bussen åker dit.",
    speech: "Hej! Kan jag hjälpa dig?",
    answer: "Ja, går den här bussen till centrum?",
    options: [
      "Ja, går den här bussen till centrum?",
      "Ja, när går nästa buss till centrum?",
      "Ja, vad kostar en biljett till centrum?",
      "Ja, hur lång tid tar resan till centrum?",
    ],
    reply: "Ja, det gör den. Välkommen ombord!",
    explanation:
      "”Går den här bussen till …?” frågar om bussens destination. De andra frågorna handlar om avgångstid, pris och restid.",
  },
  {
    id: "bus-ticket",
    place: "bus",
    title: "En biljett",
    context: "Du är vid en biljettlucka. Du vill köpa en biljett för en vuxen.",
    speech: "Vill du köpa en vuxenbiljett eller en barnbiljett?",
    answer: "En vuxenbiljett, tack.",
    options: [
      "En vuxenbiljett, tack.",
      "En barnbiljett, tack.",
      "Två vuxenbiljetter, tack.",
      "En vuxenbiljett och en barnbiljett, tack.",
    ],
    reply: "Absolut, en vuxenbiljett.",
    explanation:
      "”En vuxenbiljett” betyder en biljett för en vuxen person. Både antalet biljetter och typen av biljett behöver stämma med det du vill köpa.",
  },
  {
    id: "bus-time",
    place: "bus",
    title: "När går bussen?",
    context:
      "Du väntar på bussen till centrum. Du vill veta vilken tid den avgår.",
    speech: "Hej! Vad undrar du?",
    answer: "När går nästa buss till centrum?",
    options: [
      "När går nästa buss till centrum?",
      "Varifrån går nästa buss till centrum?",
      "Hur lång tid tar bussen till centrum?",
      "Vad kostar bussen till centrum?",
    ],
    reply: "Den går om tio minuter.",
    explanation:
      "”När” frågar efter en tid. ”Varifrån” frågar efter en plats och ”hur lång tid” efter resans längd. ”Om tio minuter” betyder tio minuter från nu.",
  },
  {
    id: "bus-seat",
    place: "bus",
    title: "Är platsen ledig?",
    context:
      "Du är på bussen och vill sätta dig. En person har en väska på sätet bredvid sig.",
    speech: "Hej!",
    answer: "Hej! Är den här platsen ledig?",
    options: [
      "Hej! Är den här platsen ledig?",
      "Hej! Är den här väskan till salu?",
      "Hej! Är det här sista hållplatsen?",
      "Hej! Är den här bussen försenad?",
    ],
    reply: "Ja, absolut! Jag flyttar min väska.",
    explanation:
      "”Är den här platsen ledig?” frågar om du kan sitta där. En ”ledig” plats är en plats som ingen annan använder eller har reserverat.",
  },
];
export const positions: PositionQuestion[] = [
  {
    id: "on",
    position: "på",
    prompt: "Var är bollen? Bollen är ___ bordet.",
    answer: "på",
    options: ["på", "under", "bredvid", "ovanför"],
    explanation: "Bollen ligger på bordsskivan och rör vid den.",
  },
  {
    id: "under",
    position: "under",
    prompt: "Var är bollen? Bollen är ___ bordet.",
    answer: "under",
    options: ["under", "på", "ovanför", "bredvid"],
    explanation: "Bollen ligger under bordsskivan, mellan bordsbenen.",
  },
  {
    id: "above",
    position: "ovanför",
    prompt: "Var är bollen? Bollen är ___ bordet.",
    answer: "ovanför",
    options: ["ovanför", "på", "under", "bredvid"],
    explanation:
      "Bollen är ovanför bordet. Det finns ett mellanrum mellan bollen och bordsskivan.",
  },
  {
    id: "in",
    position: "i",
    prompt: "Var är bollen? Bollen är ___ lådan.",
    answer: "i",
    options: ["i", "under", "ovanför", "bredvid"],
    explanation: "Bollen finns inuti den öppna lådan.",
  },
  {
    id: "beside",
    position: "bredvid",
    prompt: "Var är bollen? Bollen är ___ lådan.",
    answer: "bredvid",
    options: ["bredvid", "i", "bakom", "ovanför"],
    explanation: "Bollen ligger vid sidan av lådan.",
  },
  {
    id: "between",
    position: "mellan",
    prompt: "Var är bollen? Bollen är ___ lådorna.",
    answer: "mellan",
    options: ["mellan", "i", "bakom", "ovanför"],
    explanation: "Det står en låda på varje sida om bollen.",
  },
  {
    id: "behind",
    position: "bakom",
    prompt: "Var är bollen? Bollen är ___ lådan.",
    answer: "bakom",
    options: ["bakom", "framför", "i", "ovanför"],
    explanation:
      "Lådan skymmer den nedre delen av bollen. Bollen ligger bakom lådan, sett från oss.",
  },
  {
    id: "front",
    position: "framför",
    prompt: "Var är bollen? Bollen är ___ lådan.",
    answer: "framför",
    options: ["framför", "bakom", "i", "ovanför"],
    explanation:
      "Bollen skymmer en del av lådan. Den ligger framför lådan, sett från oss.",
  },
  {
    id: "left",
    position: "till vänster om",
    prompt: "Var är bollen? Bollen är ___ lådan.",
    answer: "till vänster om",
    options: ["till vänster om", "till höger om", "i", "ovanför"],
    explanation: "Bollen ligger på bildens vänstra sida om lådan.",
  },
  {
    id: "right",
    position: "till höger om",
    prompt: "Var är bollen? Bollen är ___ lådan.",
    answer: "till höger om",
    options: ["till höger om", "till vänster om", "i", "ovanför"],
    explanation: "Bollen ligger på bildens högra sida om lådan.",
  },
];
