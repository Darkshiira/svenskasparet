
export type DailyWord = {
  word: string;
  description: string;
  emoji: string;
  exerciseTitle: string;
  exerciseLink: string;
};

export const dailyWords: DailyWord[] = [
  {
    word: "äpple",
    description: "Ett äpple som är gott och nyttigt.",
    emoji: "🍎",
    exerciseTitle: "En eller ett?",
    exerciseLink: "/exercises/en-eller-ett",
  },
  {
    word: "nyfiken",
    description: "När du vill veta mer om något.",
    emoji: "🔎",
    exerciseTitle: "Träna på ord",
    exerciseLink: "/exercises/en-eller-ett",
  },
  {
    word: "skog",
    description: "En plats där många träd växer.",
    emoji: "🌲",
    exerciseTitle: "En eller ett?",
    exerciseLink: "/exercises/en-eller-ett",
  },
  {
    word: "fönster",
    description: "En öppning i en vägg som släpper in ljus.",
    emoji: "🪟",
    exerciseTitle: "En eller ett?",
    exerciseLink: "/exercises/en-eller-ett",
  },
  {
    word: "glädje",
    description: "En varm och positiv känsla.",
    emoji: "😊",
    exerciseTitle: "Träna på ord",
    exerciseLink: "/exercises/en-eller-ett",
  },
  {
    word: "äventyr",
    description: "En spännande upplevelse eller resa.",
    emoji: "🧭",
    exerciseTitle: "En eller ett?",
    exerciseLink: "/exercises/en-eller-ett",
  },
  {
    word: "upptäcka",
    description: "Att hitta eller lära sig något nytt.",
    emoji: "🔍",
    exerciseTitle: "Träna på ord",
    exerciseLink: "/exercises/en-eller-ett",
  },
];

function getSwedishDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const part = (type: string) =>
    parts.find((item) => item.type === type)?.value ?? "";

  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function getDailyWord(date = new Date()): DailyWord {
  const dateKey = getSwedishDateKey(date);
  const [year, month, day] = dateKey.split("-").map(Number);

  const dayNumber = Math.floor(
    Date.UTC(year, month - 1, day) / 86_400_000
  );

  const index =
    ((dayNumber % dailyWords.length) + dailyWords.length) %
    dailyWords.length;

  return dailyWords[index];
}
