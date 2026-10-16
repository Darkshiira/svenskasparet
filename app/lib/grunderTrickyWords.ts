import type { Situation, PositionQuestion, Vocabulary } from "@/app/data/grunder";
import type { TrickyWord } from "@/app/lib/trickyWords";

type GrunderRound =
  | { mode: "situations"; data: Situation; choices: string[] }
  | { mode: "positions"; data: PositionQuestion; choices: string[] }
  | { mode: "listen"; data: Vocabulary; choices: Vocabulary[] };

export function toGrunderTrickyWord(round: GrunderRound): TrickyWord {
  const identity = {
    id: `grunder:${round.mode}:${round.data.id}`,
    exercise: "grunder" as const,
    mode: round.mode,
    grunderId: round.data.id,
  };
  if (round.mode === "situations") return {
    ...identity,
    word: round.data.title,
    prompt: "Vad säger du?",
    description: `${round.data.context}\nPersonen säger: ”${round.data.speech}”`,
    answer: round.data.answer,
    options: [...round.choices],
    explanation: round.data.explanation,
    example: `Personen svarar: ”${round.data.reply}”`,
  };
  if (round.mode === "positions") return {
    ...identity,
    word: `Lägesord: ${round.data.answer}`,
    prompt: round.data.prompt,
    answer: round.data.answer,
    options: [...round.choices],
    explanation: round.data.explanation,
  };
  return {
    ...identity,
    word: round.data.word,
    prompt: "Lyssna och hitta rätt bild",
    answer: round.data.word,
    options: round.choices.map(item => item.word),
    explanation: `Ordet du hörde var ”${round.data.word}”. Lyssna gärna igen och koppla ihop ordet med bilden.`,
  };
}
