import type { Place } from "@/app/data/grunder";

export type ConversationLine = { role: "other" | "you" | "time"; text: string };
export type ConversationStep = {
  cue: string;
  hint: string;
  hintEn: string;
  prompt: string;
  answer: string;
  alternative: string;
  reply: string;
  timeBreakBefore?: boolean;
  choiceReplies?: { answer: string; alternative: string };
};
export type Conversation = {
  id: string;
  title: string;
  titleEn: string;
  emoji: string;
  place: Place;
  other: string;
  steps: ConversationStep[];
};

// Alternatives deliberately answer a different question; natural variants are
// not presented as errors. Picture cues show the intention before each choice.
export const conversations: Conversation[] = [
  {
    id: "greeting", title: "Hälsa på någon", titleEn: "Say hello", emoji: "👋", place: "park", other: "Alex",
    steps: [
      { cue: "👋", hint: "Hälsa", hintEn: "Say hello", prompt: "Hej!", answer: "Hej!", alternative: "God natt!", reply: "Jag heter Alex. Vad heter du?" },
      { cue: "📛 Sam", hint: "Du är Sam", hintEn: "You are Sam", prompt: "Jag heter Alex. Vad heter du?", answer: "Jag heter Sam.", alternative: "En kaffe, tack.", reply: "Trevligt att träffas! Hur mår du?" },
      { cue: "🙂 ↔ 🙂", hint: "Svara och fråga tillbaka", hintEn: "You feel good. Ask how Alex is too", prompt: "Trevligt att träffas! Hur mår du?", answer: "Bra, tack! Och du?", alternative: "Jag heter Sam.", reply: "Jag mår också bra, tack!" },
    ],
  },
  {
    id: "clothes", title: "I klädaffären", titleEn: "At the clothes shop", emoji: "👕", place: "shop", other: "Personal",
    steps: [
      { cue: "👕 🏷️ ❓", hint: "Fråga om priset", hintEn: "Ask the price of the sweater", prompt: "Hej!", answer: "Hej! Hur mycket kostar tröjan?", alternative: "God natt!", reply: "Den kostar 200 kronor." },
      { cue: "👕 ✅", hint: "Köp tröjan", hintEn: "You would like to buy the sweater", prompt: "Den kostar 200 kronor.", answer: "Jag tar den, tack.", alternative: "Vad heter du?", reply: "Vill du betala med kort eller kontanter?" },
      { cue: "💳 ✅", hint: "Betala med kort", hintEn: "Pay by card", prompt: "Vill du betala med kort eller kontanter?", answer: "Med kort, tack.", alternative: "Jag heter Sam.", reply: "Tack så mycket!" },
    ],
  },
  {
    id: "cafe", title: "På café", titleEn: "At a café", emoji: "☕", place: "restaurant", other: "Personal",
    steps: [
      { cue: "☕ ✅", hint: "Beställ kaffe", hintEn: "Order a coffee", prompt: "Hej! Vad vill du ha?", answer: "En kaffe, tack.", alternative: "Jag heter Sam.", reply: "Vill du ha mjölk i kaffet?" },
      { cue: "☕ 🥛 ❓", hint: "Vill du ha mjölk? Du väljer.", hintEn: "Would you like milk? You choose.", prompt: "Vill du ha mjölk i kaffet?", answer: "Ja tack, gärna.", alternative: "Nej tack.", reply: "Varsågod!", choiceReplies: { answer: "Varsågod! Kaffe med mjölk.", alternative: "Varsågod! Kaffe utan mjölk." } },
      { cue: "☕ 🤲 🙂", hint: "Tacka", hintEn: "Thank the person for your coffee", prompt: "Varsågod!", answer: "Tack så mycket!", alternative: "Hur mår du?", reply: "Ha en fin dag!" },
    ],
  },
  {
    id: "visit", title: "Hos en vän", titleEn: "Visiting a friend", emoji: "🏠", place: "home", other: "Din vän",
    steps: [
      { cue: "👋 🏠", hint: "Hälsa", hintEn: "Say hello to your friend", prompt: "Hej! Välkommen!", answer: "Hej!", alternative: "En biljett, tack.", reply: "Vill du ha en kopp te?" },
      { cue: "🍵 ❓", hint: "Vill du ha te? Du väljer.", hintEn: "Would you like tea? You choose.", prompt: "Vill du ha en kopp te?", answer: "Ja tack, gärna!", alternative: "Nej tack.", reply: "Varsågod, här är ditt te.", choiceReplies: { answer: "Varsågod, här är ditt te.", alternative: "Ingen fara!" } },
      { timeBreakBefore: true, cue: "👋 🚪", hint: "Säg hej då", hintEn: "It is time to leave. Say goodbye", prompt: "Vad roligt att du kom! Vi ses!", answer: "Hej då! Vi ses!", alternative: "God morgon!", reply: "Hej då!" },
    ],
  },
];

export function exampleLines(conversation: Conversation): ConversationLine[] {
  const result: ConversationLine[] = [];
  conversation.steps.forEach((step) => {
    if (step.timeBreakBefore) result.push({ role: "time", text: "En stund senare" });
    if (result[result.length - 1]?.text !== step.prompt) result.push({ role: "other", text: step.prompt });
    result.push({ role: "you", text: step.answer });
    result.push({ role: "other", text: step.reply });
  });
  return result;
}

// Keep these filenames stable once recordings have been uploaded.
// Explicit ordering also preserves recordings for removed dialogue.
export const conversationAudio: string[] = [
  "Hej!",
  "God natt!",
  "Jag heter Alex. Vad heter du?",
  "Jag heter Sam.",
  "En kaffe, tack.",
  "Trevligt att träffas! Hur mår du?",
  "Bra, tack! Och du?",
  "Jag mår också bra, tack!",
  "Hej! Hur mycket kostar tröjan?",
  "Den kostar 200 kronor.",
  "Kan jag prova den?",
  "Vad heter du?",
  "Ja, provrummet är där borta.",
  "Vill du betala med kort eller kontanter?",
  "Med kort, tack.",
  "Tack så mycket!",
  "Hej! Vad vill du ha?",
  "Vill du ha mjölk i kaffet?",
  "Ja tack, gärna.",
  "Nej tack.",
  "Varsågod!",
  "Hur mår du?",
  "Ha en fin dag!",
  "Hej! Välkommen!",
  "En biljett, tack.",
  "Vill du ha en kopp te?",
  "Ja tack, gärna!",
  "Varsågod, här är ditt te.",
  "Vad roligt att du kom! Vi ses!",
  "Hej då! Vi ses!",
  "God morgon!",
  "Hej då!",
  "Varsågod! Kaffe med mjölk.",
  "Varsågod! Kaffe utan mjölk.",
  "Jag tar den, tack.",
  "Ingen fara!"
];
export function conversationAudioPath(text: string): string {
  return `/audio/grunder/samtal/phrase-${String(conversationAudio.indexOf(text) + 1).padStart(3, "0")}.mp3`;
}
