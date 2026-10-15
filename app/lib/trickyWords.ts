import { enEttQuestions } from "@/app/data/enEtt";

export type TrickyExercise = "en-eller-ett" | "snabbspåret" | "stavning" | "meningsbyggnad";
export type TrickyMode = "choice" | "fill" | "double" | "article" | "build" | "missing";
export type TrickyWord = {
  id: string;
  word: string;
  exercise: TrickyExercise;
  mode: TrickyMode;
  prompt: string;
  answer: string;
  options?: string[];
  words?: string[];
  explanation: string;
  example?: string;
  description?: string;
};
export const TRICKY_WORDS_KEY = "svenskasparet-tricky-words";
export const TRICKY_WORDS_EVENT = "svenskasparet-tricky-words-updated";
function notifyUpdated() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(TRICKY_WORDS_EVENT));
}
function isTrickyWord(value: unknown): value is TrickyWord {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<TrickyWord>;
  return typeof item.id === "string" && typeof item.word === "string" &&
    typeof item.exercise === "string" && typeof item.mode === "string" &&
    typeof item.prompt === "string" && typeof item.answer === "string" &&
    typeof item.explanation === "string" &&
    (item.options === undefined || (Array.isArray(item.options) && item.options.every((word) => typeof word === "string"))) &&
    (item.words === undefined || (Array.isArray(item.words) && item.words.every((word) => typeof word === "string")));
}
function migrateLegacyWords(value: unknown): TrickyWord[] {
  if (!Array.isArray(value)) return [];
  const migrated: TrickyWord[] = [];
  for (const entry of value) {
    if (isTrickyWord(entry)) { migrated.push(entry); continue; }
    if (typeof entry === "string") {
      const question = enEttQuestions.find((question) => question.word === entry);
      if (question) migrated.push({
        id: question.id, word: question.word, exercise: "en-eller-ett", mode: "article",
        prompt: `Vilket passar: en eller ett ${question.word}?`, answer: question.correctArticle,
        options: ["en", "ett"], explanation: question.explanation, example: question.example,
      });
    }
  }
  return migrated;
}
export function getTrickyWords(): TrickyWord[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TRICKY_WORDS_KEY);
    return stored ? migrateLegacyWords(JSON.parse(stored)) : [];
  } catch { return []; }
}
export function saveTrickyWord(item: TrickyWord) {
  if (typeof window === "undefined") return;
  try {
    const words = getTrickyWords();
    const exists = words.some((word) => word.id === item.id && word.exercise === item.exercise);
    const updated = exists ? words.map((word) => word.id === item.id && word.exercise === item.exercise ? item : word) : [...words, item];
    localStorage.setItem(TRICKY_WORDS_KEY, JSON.stringify(updated));
    notifyUpdated();
  } catch (error) { console.error("Kunde inte spara det kluriga ordet:", error); }
}
export function removeTrickyWord(id: string, exercise: TrickyExercise) {
  if (typeof window === "undefined") return;
  try {
    const updated = getTrickyWords().filter((word) => !(word.id === id && word.exercise === exercise));
    localStorage.setItem(TRICKY_WORDS_KEY, JSON.stringify(updated));
    notifyUpdated();
  } catch (error) { console.error("Kunde inte ta bort det kluriga ordet:", error); }
}
