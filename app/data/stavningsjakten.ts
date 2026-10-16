export type Mode = "choice" | "fill" | "double";

export type Question = {
  id: string;
  type: Mode;
  prompt: string;
  description?: string;
  answer: string;
  options?: string[];
  explanation: string;
};

export const questions: Record<Mode, Question[]> = {
  choice: [
    {
      id: "choice-jättebra",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["jätte bra", "jättebra", "jäte bra"],
      answer: "jättebra",
      explanation: "Jättebra skrivs som ett ord.",
    },
    {
      id: "choice-intressant",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["intresant", "intressant", "interresant"],
      answer: "intressant",
      explanation: "Intressant stavas med två s.",
    },
    {
      id: "choice-manniska",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["människa", "mäniska", "männischa"],
      answer: "människa",
      explanation: "Människa stavas med två n och ett k.",
    },
    {
      id: "choice-verkligen",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["värkligen", "verkligen", "värklijen"],
      answer: "verkligen",
      explanation: "Verkligen stavas med e, inte ä.",
    },
    {
      id: "choice-plötsligt",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["plötsigt", "plötsligt", "plöttsligt"],
      answer: "plötsligt",
      explanation: "Plötsligt stavas med l efter t.",
    },
    {
      id: "choice-kanske",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["kanshe", "kansje", "kanske"],
      answer: "kanske",
      explanation: "Kanske stavas med k och s.",
    },
    {
      id: "choice-överraskning",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["överaskning", "övraskning", "överraskning"],
      answer: "överraskning",
      explanation: "Överraskning stavas med dubbel-r.",
    },
    {
      id: "choice-absolut",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["apsolut", "absolutt", "absolut"],
      answer: "absolut",
      explanation: "Absolut stavas med b och ett t på slutet.",
    },
    {
      id: "choice-egentligen",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["igentligen", "egentlien", "egentligen"],
      answer: "egentligen",
      explanation: "Egentligen börjar med e-ge.",
    },
    {
      id: "choice-fortfarande",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["fortfarande", "fortfarnde", "fortfarandde"],
      answer: "fortfarande",
      explanation:
        "Fortfarande innehåller alla bokstäver i fort-farande en gång.",
    },
    {
      id: "choice-möjlighet",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["möjlighet", "mujlihet", "mujlighet"],
      answer: "möjlighet",
      explanation: "Möjlighet stavas med g efter i.",
    },
    {
      id: "choice-bibliotek",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["biblotek", "bibliotek", "biblijotek"],
      answer: "bibliotek",
      explanation: "Bibliotek stavas med i efter biblio.",
    },
    {
      id: "choice-försöka",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["försöka", "försöcka", "förschöka"],
      answer: "försöka",
      explanation: "Försöka stavas med k, inte ck.",
    },
    {
      id: "choice-beskriva",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["beskriva", "beskriffa", "bäskriva"],
      answer: "beskriva",
      explanation: "Beskriva stavas med v.",
    },
    {
      id: "choice-berätta",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["bereta", "berätta", "beräta"],
      answer: "berätta",
      explanation: "Berätta stavas med ä och dubbel-t.",
    },
    {
      id: "choice-förklara",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["förklara", "förklahra", "furklara"],
      answer: "förklara",
      explanation: "Förklara stavas utan h efter k.",
    },
    {
      id: "choice-vanligt",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["vanlit", "vanlijt", "vanligt"],
      answer: "vanligt",
      explanation: "Vanligt slutar på -ligt.",
    },
    {
      id: "choice-plats",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["plats", "plaz", "platts"],
      answer: "plats",
      explanation: "Plats stavas med ett t på slutet.",
    },
    {
      id: "choice-vänskap",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["vännskap", "vänskap", "vänskapp"],
      answer: "vänskap",
      explanation: "Vänskap stavas med ett n och ett p.",
    },
    {
      id: "choice-födelsedag",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["födelsedag", "födelsedagg", "fudelsedag"],
      answer: "födelsedag",
      explanation: "Födelsedag är sammansatt av födelse och dag.",
    },
    {
      id: "choice-plötsligen",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["plötsligen", "plutsligen", "plätsligen"],
      answer: "plötsligen",
      explanation: "Plötsligen är ett korrekt ord som betyder helt oväntat.",
    },
    {
      id: "choice-favorit",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["favorit", "favvorit", "favurit"],
      answer: "favorit",
      explanation: "Favorit stavas med ett v.",
    },
    {
      id: "choice-äntligen",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["äntligen", "ändtligen", "entligen"],
      answer: "äntligen",
      explanation: "Äntligen börjar med ä.",
    },
    {
      id: "choice-åtminstone",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["åtminstone", "åtminstonde", "åtminstånde"],
      answer: "åtminstone",
      explanation: "Åtminstone stavas med e i slutet.",
    },
    {
      id: "choice-egenskap",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["egenskap", "ägenskap", "igenskap"],
      answer: "egenskap",
      explanation: "Egenskap börjar med e.",
    },
    {
      id: "choice-vanligtvis",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["vanligtvis", "vanlitvis", "vanligt viss"],
      answer: "vanligtvis",
      explanation: "Vanligtvis skrivs som ett ord.",
    },
    {
      id: "choice-förvånad",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["förvånad", "furvånnad", "furvånad"],
      answer: "förvånad",
      explanation: "Förvånad stavas med ett n.",
    },
    {
      id: "choice-ögonblick",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["ögonblick", "ögonblickk", "ögonblikk"],
      answer: "ögonblick",
      explanation: "Ögonblick stavas med ck i slutet.",
    },
    {
      id: "choice-särskilt",
      type: "choice",
      prompt: "Vilket ord är rätt stavat?",
      options: ["särskillt", "särskilt", "serkilt"],
      answer: "särskilt",
      explanation: "Särskilt stavas med ett l efter k.",
    },
  ],
  fill: [
    {
      id: "fill-smör",
      type: "fill",
      prompt: "sm__",
      description: "Något du kan ha på en macka.",
      answer: "smör",
      explanation: "Smör stavas med ö.",
    },
    {
      id: "fill-fisk",
      type: "fill",
      prompt: "f__k",
      description: "Ett djur som lever i vatten.",
      answer: "fisk",
      explanation: "Fisk stavas f-i-s-k.",
    },
    {
      id: "fill-hjärta",
      type: "fill",
      prompt: "hj__ta",
      description: "Något som slår i kroppen.",
      answer: "hjärta",
      explanation: "Hjärta börjar med hj och har ä i mitten.",
    },
    {
      id: "fill-vänner",
      type: "fill",
      prompt: "v__ner",
      description: "Personer du tycker om.",
      answer: "vänner",
      explanation: "Vänner stavas med ä och dubbel-n.",
    },
    {
      id: "fill-fönster",
      type: "fill",
      prompt: "f__ster",
      description: "Något du kan titta ut genom.",
      answer: "fönster",
      explanation: "Fönster stavas med ö.",
    },
    {
      id: "fill-bänk",
      type: "fill",
      prompt: "b__k",
      description: "Något du kan sitta på.",
      answer: "bänk",
      explanation: "Bänk stavas med ä.",
    },
    {
      id: "fill-skugga",
      type: "fill",
      prompt: "sk__ga",
      description: "Ett mörkare område där ljuset inte når fram.",
      answer: "skugga",
      explanation: "Skugga stavas med u och dubbel-g.",
    },
    {
      id: "fill-morgon",
      type: "fill",
      prompt: "m__gon",
      description: "Den första delen av dagen.",
      answer: "morgon",
      explanation: "Morgon stavas m-o-r-g-o-n.",
    },
    {
      id: "fill-känna",
      type: "fill",
      prompt: "k__na",
      description: "Att uppleva en känsla.",
      answer: "känna",
      explanation: "Känna stavas med ä och dubbel-n.",
    },
    {
      id: "fill-sommar",
      type: "fill",
      prompt: "so__ar",
      description: "Årstiden då det oftast är varmast.",
      answer: "sommar",
      explanation: "Sommar stavas med dubbel-m.",
    },
    {
      id: "fill-vinter",
      type: "fill",
      prompt: "v__ter",
      description: "Årstiden då det oftast är kallast.",
      answer: "vinter",
      explanation: "Vinter stavas med i efter v.",
    },
    {
      id: "fill-fjäril",
      type: "fill",
      prompt: "fj__il",
      description: "En insekt med stora, färgglada vingar.",
      answer: "fjäril",
      explanation: "Fjäril stavas med ä.",
    },
    {
      id: "fill-blomma",
      type: "fill",
      prompt: "bl__ma",
      description: "En växt som ofta har färgglada kronblad.",
      answer: "blomma",
      explanation: "Blomma stavas med dubbel-m.",
    },
    {
      id: "fill-bibliotek",
      type: "fill",
      prompt: "biblio___",
      description: "En plats där du kan låna böcker.",
      answer: "bibliotek",
      explanation: "Bibliotek stavas med bokstavsföljden -tek på slutet.",
    },
    {
      id: "fill-nyckel",
      type: "fill",
      prompt: "ny__el",
      description: "Något du använder för att låsa upp en dörr.",
      answer: "nyckel",
      explanation: "Nyckel stavas med ck.",
    },
    {
      id: "fill-födelsedag",
      type: "fill",
      prompt: "f_delse___",
      description: "Dagen då du firar att du blivit ett år äldre.",
      answer: "födelsedag",
      explanation: "Födelsedag består av orden födelse och dag.",
    },
    {
      id: "fill-ugn",
      type: "fill",
      prompt: "u__",
      description: "Något du kan baka bröd eller laga mat i.",
      answer: "ugn",
      explanation: "Ugn stavas med g och sedan n.",
    },
    {
      id: "fill-regn",
      type: "fill",
      prompt: "r__n",
      description: "Vattendroppar som faller från molnen.",
      answer: "regn",
      explanation: "Regn stavas r-e-g-n.",
    },
    {
      id: "fill-roligt",
      type: "fill",
      prompt: "r__igt",
      description: "Något som är kul att göra.",
      answer: "roligt",
      explanation: "Roligt stavas med o efter r.",
    },
    {
      id: "fill-nyfiken",
      type: "fill",
      prompt: "ny__ken",
      description: "När du gärna vill veta eller lära dig mer.",
      answer: "nyfiken",
      explanation: "Nyfiken stavas med y och k.",
    },
    {
      id: "fill-skriva",
      type: "fill",
      prompt: "sk__va",
      description: "Att skapa ord med en penna eller ett tangentbord.",
      answer: "skriva",
      explanation: "Skriva stavas med r efter k.",
    },
    {
      id: "fill-börja",
      type: "fill",
      prompt: "b___a",
      description: "Motsatsen till att sluta.",
      answer: "börja",
      explanation: "Börja stavas med ö och j.",
    },
    {
      id: "fill-försiktig",
      type: "fill",
      prompt: "förs__tig",
      description: "När du gör något varsamt och är uppmärksam.",
      answer: "försiktig",
      explanation: "Försiktig stavas med i och k.",
    },
    {
      id: "fill-berätta",
      type: "fill",
      prompt: "ber__ta",
      description: "Att säga eller beskriva något för någon.",
      answer: "berätta",
      explanation: "Berätta stavas med ä och dubbel-t.",
    },
    {
      id: "fill-äventyrlig",
      type: "fill",
      prompt: "_ventyrlig",
      description: "Någon som tycker om spännande upplevelser.",
      answer: "äventyrlig",
      explanation: "Äventyrlig börjar med ä.",
    },
    {
      id: "fill-människor",
      type: "fill",
      prompt: "männi__or",
      description: "Ett annat ord för flera personer.",
      answer: "människor",
      explanation: "Människor stavas med sk i mitten.",
    },
    {
      id: "fill-överraska",
      type: "fill",
      prompt: "överra__a",
      description: "Att göra något som någon inte väntat sig.",
      answer: "överraska",
      explanation: "Överraska stavas med dubbel-r och sk.",
    },
    {
      id: "fill-stjärna",
      type: "fill",
      prompt: "s__ärna",
      description: "Något som lyser på natthimlen.",
      answer: "stjärna",
      explanation: "Stjärna stavas med stj i början och ä.",
    },
  ],
  double: [
    {
      id: "double-vila",
      type: "double",
      prompt: "Jag la mig för att ___ .",
      options: ["vila", "villa"],
      answer: "vila",
      explanation: "Vila betyder att ta det lugnt. Villa är ett hus.",
    },
    {
      id: "double-glas-glass",
      type: "double",
      prompt: "Jag dricker vatten ur ett ___.",
      options: ["glas", "glass"],
      answer: "glas",
      explanation: "Ett glas kan man dricka ur. Glass är en efterrätt.",
    },
    {
      id: "double-villa",
      type: "double",
      prompt: "Vi bor i en ___.",
      options: ["vila", "villa"],
      answer: "villa",
      explanation: "En villa är ett hus. Vila betyder att ta det lugnt.",
    },
    {
      id: "double-glass",
      type: "double",
      prompt: "Jag äter ___ på sommaren.",
      options: ["glas", "glass"],
      answer: "glass",
      explanation: "Glass är något man äter. Glas kan vara ett dricksglas.",
    },
    {
      id: "double-läsa",
      type: "double",
      prompt: "Jag ska ___ en bok.",
      options: ["läsa", "lässa"],
      answer: "läsa",
      explanation: "Läsa stavas med ett s.",
    },
    {
      id: "double-matta",
      type: "double",
      prompt: "Katten ligger på min ___.",
      options: ["matt", "matta"],
      answer: "matta",
      explanation: "Matta stavas med dubbel-t och a på slutet.",
    },
    {
      id: "double-trött",
      type: "double",
      prompt: "Jag är ___ på kvällen.",
      options: ["trött", "tröt"],
      answer: "trött",
      explanation: "Trött stavas med dubbel-t på slutet.",
    },
    {
      id: "double-dricka",
      type: "double",
      prompt: "Kan du ___ lite vatten?",
      options: ["drika", "dricka"],
      answer: "dricka",
      explanation: "Dricka stavas med ck.",
    },
    {
      id: "double-röd",
      type: "double",
      prompt: "Hon har en ___ cykel.",
      options: ["röd", "rödd"],
      answer: "röd",
      explanation: "Röd stavas med ett d.",
    },
    {
      id: "double-hall-hallå",
      type: "double",
      prompt: "När jag svarar i telefon säger jag ofta ___.",
      options: ["halå", "hallå"],
      answer: "hallå",
      explanation: "Hallå stavas med dubbel-l.",
    },
    {
      id: "double-kassa",
      type: "double",
      prompt: "Vi betalar varorna i en ___.",
      options: ["kasa", "kassa"],
      answer: "kassa",
      explanation: "Kassa stavas med dubbel-s.",
    },
    {
      id: "double-komma",
      type: "double",
      prompt: "Du måste ___ ihåg din väska.",
      options: ["komma", "koma"],
      answer: "komma",
      explanation: "Komma stavas med dubbel-m.",
    },
    {
      id: "double-lärare",
      type: "double",
      prompt: "Min ___ hjälper mig att lära mig.",
      options: ["lärare", "lärrare"],
      answer: "lärare",
      explanation: "Lärare stavas med ett r efter ä.",
    },
    {
      id: "double-kudde",
      type: "double",
      prompt: "Jag lägger huvudet på en ___.",
      options: ["kude", "kudde"],
      answer: "kudde",
      explanation: "Kudde stavas med dubbel-d.",
    },
    {
      id: "double-nummer",
      type: "double",
      prompt: "Vilket ___ har du i kön?",
      options: ["numer", "nummer"],
      answer: "nummer",
      explanation: "Nummer stavas med dubbel-m.",
    },
    {
      id: "double-äpple",
      type: "double",
      prompt: "Jag äter ett ___.",
      options: ["äple", "äpple"],
      answer: "äpple",
      explanation: "Äpple stavas med dubbel-p.",
    },
    {
      id: "double-klocka",
      type: "double",
      prompt: "Jag tittar på min ___.",
      options: ["kloka", "klocka"],
      answer: "klocka",
      explanation: "Klocka stavas med ck.",
    },
    {
      id: "double-tack",
      type: "double",
      prompt: "Jag säger ___ när någon hjälper mig.",
      options: ["tak", "tack"],
      answer: "tack",
      explanation: "Tack stavas med ck. Tak är det som finns ovanför ett rum.",
    },
    {
      id: "double-ryggsäck",
      type: "double",
      prompt: "Jag packar böckerna i min ___.",
      options: ["rygsäck", "ryggsäck"],
      answer: "ryggsäck",
      explanation: "Ryggsäck stavas med dubbel-g.",
    },
    {
      id: "double-katt",
      type: "double",
      prompt: "Min ___ sover på soffan.",
      options: ["kat", "katt"],
      answer: "katt",
      explanation: "Katt stavas med dubbel-t.",
    },
    {
      id: "double-sitta",
      type: "double",
      prompt: "Jag vill ___ bredvid dig.",
      options: ["sita", "sitta"],
      answer: "sitta",
      explanation: "Sitta stavas med dubbel-t.",
    },
    {
      id: "double-hinna",
      type: "double",
      prompt: "Vi måste skynda oss för att ___ med bussen.",
      options: ["hina", "hinna"],
      answer: "hinna",
      explanation: "Hinna stavas med dubbel-n.",
    },
    {
      id: "double-simma",
      type: "double",
      prompt: "Jag tycker om att ___.",
      options: ["sima", "simma"],
      answer: "simma",
      explanation: "Simma stavas med dubbel-m.",
    },
    {
      id: "double-vinna",
      type: "double",
      prompt: "Jag hoppas att mitt lag ska ___.",
      options: ["vina", "vinna"],
      answer: "vinna",
      explanation: "Vinna stavas med dubbel-n.",
    },
    {
      id: "double-hitta",
      type: "double",
      prompt: "Kan du hjälpa mig att ___ nyckeln?",
      options: ["hita", "hitta"],
      answer: "hitta",
      explanation: "Hitta stavas med dubbel-t.",
    },
    {
      id: "double-ramlar",
      type: "double",
      prompt: "Akta så att du inte ___.",
      options: ["ramlar", "rammlar"],
      answer: "ramlar",
      explanation: "Ramlar stavas med ett m.",
    },
    {
      id: "double-äta",
      type: "double",
      prompt: "Vi ska ___ middag tillsammans.",
      options: ["äta", "ätta"],
      answer: "äta",
      explanation: "Äta stavas med ett t.",
    },
    {
      id: "double-vatten",
      type: "double",
      prompt: "Jag dricker ett glas ___.",
      options: ["vaten", "vatten"],
      answer: "vatten",
      explanation: "Vatten stavas med dubbel-t.",
    },
    {
      id: "double-hellre",
      type: "double",
      prompt: "Jag vill ___ läsa än titta på tv.",
      options: ["helre", "hellre"],
      answer: "hellre",
      explanation: "Hellre stavas med dubbel-l.",
    },
  ],
};

/**
 * Validates spelling questions in "Fyll i bokstäverna".
 *
 * Each underscore represents exactly one missing letter.
 * All visible letters must match the correct answer.
 *
 * Runs only in development.
 */
export function validateFillQuestions(): void {
  if (process.env.NODE_ENV !== "development") return;

  const errors: string[] = [];

  for (const question of questions.fill) {
    const prompt = Array.from(question.prompt.toLocaleLowerCase("sv-SE"));
    const answer = Array.from(question.answer.toLocaleLowerCase("sv-SE"));

    // 1. Check that the lengths match
    if (prompt.length !== answer.length) {
      errors.push(
        `[${question.id}] Length mismatch: "${question.prompt}" has ${prompt.length} characters, but "${question.answer}" has ${answer.length}.`,
      );

      continue;
    }

    // 2. Check that the question contains missing letters
    if (!prompt.includes("_")) {
      errors.push(
        `[${question.id}] No missing letters found in "${question.prompt}".`,
      );
    }

    // 3. Check that visible letters match the answer
    for (let i = 0; i < prompt.length; i++) {
      if (prompt[i] !== "_" && prompt[i] !== answer[i]) {
        errors.push(
          `[${question.id}] Wrong letter at position ${i + 1}: "${prompt[i]}" should be "${answer[i]}".`,
        );
      }
    }

    // 4. Check that a description exists
    if (!question.description?.trim()) {
      errors.push(`[${question.id}] Missing description.`);
    }
  }

  if (errors.length > 0) {
    console.error(
      `❌ Found ${errors.length} spelling question error(s):\n\n${errors.join("\n")}`,
    );
  } else {
    console.info(
      `✅ All ${questions.fill.length} fill-in spelling questions are valid!`,
    );
  }
}
