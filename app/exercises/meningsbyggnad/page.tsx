"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  Trophy,
  Star,
  X,
} from "lucide-react";
import {
  getTrickyWords,
  saveTrickyWord,
  removeTrickyWord,
} from "@/app/lib/trickyWords";
import { recordAnswer } from "@/app/lib/progress";
import { recordCompletedRound } from "@/app/lib/exerciseProgress";
import { questions, type Mode, type Question } from "@/app/data/meningsbyggnad";

const modes = [
  {
    id: "build" as const,
    title: "Bygg en mening",
    description: "Tryck på orden och lägg dem i rätt ordning.",
    image: "/images/bygg-en-mening-icon.png",
    colour: "border-[#ecdba9] bg-[#fcf7e9]",
  },
  {
    id: "choice" as const,
    title: "Välj rätt mening",
    description: "Upptäck vilken mening som har rätt ordföljd.",
    image: "/images/valj-ratt-mening-icon.png",
    colour: "border-[#e6ce91] bg-[#f8efd9]",
  },
  {
    id: "missing" as const,
    title: "Ordet som saknas",
    description: "Välj ordet som gör meningen komplett.",
    image: "/images/ordet-som-saknas-icon.png",
    colour: "border-[#dfbf78] bg-[#f2e5c6]",
  },
];

// The starting word is specified because Swedish often allows several word orders.

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
type RoundQuestion = Question & {
  tiles: { id: number; word: string }[];
  choices: string[];
};

export default function MeningsbyggnadPage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [round, setRound] = useState<RoundQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [option, setOption] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isWordSaved, setIsWordSaved] = useState(false);
  const [savedAutomatically, setSavedAutomatically] = useState(false);
  const current = round[index];
  const active = modes.find((item) => item.id === mode);
  const answer =
    mode === "build"
      ? selected
          .map((id) => current.tiles.find((tile) => tile.id === id)!.word)
          .join(" ")
      : option;
  const correct = Boolean(current && answer === current.answer);
  const ready = Boolean(
    current &&
    (mode === "build" ? selected.length === current.tiles.length : option),
  );
  const roundRecorded = useRef(false);

  // Randomness runs only in a click handler, never during rendering.
  function start(nextMode: Mode) {
    roundRecorded.current = false;
    setRound(
      shuffle(questions[nextMode])
        .slice(0, 10)
        .map((q) => ({
          ...q,
          tiles: shuffle((q.words ?? []).map((word, id) => ({ id, word }))),
          choices: shuffle(q.options ?? []),
        })),
    );
    setMode(nextMode);
    setIndex(0);
    setSelected([]);
    setOption("");
    setChecked(false);
    setScore(0);
    setFinished(false);
    setShowHint(false);
    setIsWordSaved(false);
    setSavedAutomatically(false);
  }
  function syncSavedStatus() {
    setIsWordSaved(
      getTrickyWords().some(
        (item) => item.id === current.id && item.exercise === "meningsbyggnad",
      ),
    );
  }

  function saveCurrentQuestion() {
    if (!current || !mode) return;
    saveTrickyWord({
      id: current.id,
      word: mode === "missing" ? current.prompt : "Ordföljd att träna på",
      exercise: "meningsbyggnad",
      mode,
      prompt: current.prompt,
      answer: current.answer,
      options: current.options,
      words: current.words,
      explanation: current.explanation,
      description: mode === "build" ? "Lägg orden i rätt ordning." : undefined,
    });
  }

  function handleToggleTrickyWord() {
    if (!current || !mode || !checked) return;
    const saved = getTrickyWords().some(
      (item) => item.id === current.id && item.exercise === "meningsbyggnad",
    );
    if (saved) {
      removeTrickyWord(current.id, "meningsbyggnad");
    } else {
      saveCurrentQuestion();
    }
    setSavedAutomatically(false);
    syncSavedStatus();
  }

  function check() {
    if (!ready || checked) return;
    recordAnswer(correct);
    // Count the round once all 10 questions have been answered.
    if (index === round.length - 1 && !roundRecorded.current) {
      roundRecorded.current = true;
      recordCompletedRound("meningsbyggnad");
    }
    if (correct) {
      removeTrickyWord(current.id, "meningsbyggnad");
    } else {
      saveCurrentQuestion();
    }
    setSavedAutomatically(!correct);
    syncSavedStatus();
    if (correct) setScore((value) => value + 1);
    setChecked(true);
  }
  function next() {
    if (index === round.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected([]);
    setOption("");
    setChecked(false);
    setShowHint(false);
    setIsWordSaved(false);
    setSavedAutomatically(false);
  }
  const button =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#96691e] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#795317] disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <main className="min-h-screen bg-[#f3f7f8] px-4 py-8 text-[#183f47] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#ovningar"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#54727b]"
        >
          <ArrowLeft size={18} /> Alla övningar
        </Link>
        <section className="rounded-[28px] border border-[#ecdba9] bg-gradient-to-br from-[#fcf7e9] to-[#f2ead7] p-6 sm:p-9">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#96691e]">
            <BookOpen size={15} /> Grammatik · Medelnivå
          </span>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-7">
            <span className="flex size-28 shrink-0 items-center justify-center sm:size-36 md:size-40">
              <Image
                src="/images/meningsbyggnad-icon.png"
                alt=""
                width={460}
                height={460}
                priority
                className="h-full w-full object-contain"
                sizes="(min-width: 768px) 160px, (min-width: 640px) 144px, 112px"
              />
            </span>

            <div className="min-w-0">
              <h1 className="break-words text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">
                Meningsbyggnad
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#54727b] sm:text-base">
                Bygg meningar och upptäck svenskans mönster. Träna på ordföljd
                och små ord som gör stor skillnad.
              </p>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-2 text-xs font-bold text-[#96691e]">
            {[
              "10 frågor per omgång",
              "Direkt feedback",
              "Förklaring ingår",
            ].map((text) => (
              <span key={text} className="rounded-full bg-white/80 px-4 py-3">
                {text}
              </span>
            ))}
          </div>
        </section>

        <section
          aria-label="Meningsövningar"
          className="mt-8 rounded-[26px] border border-[#dfe8eb] bg-white p-5 shadow-[0_12px_40px_#183f4708] sm:p-8"
        >
          {!mode ? (
            <>
              <h2 className="text-2xl font-extrabold">Vad vill du träna på?</h2>
              <p className="mt-2 text-sm text-[#54727b]">
                Välj en övning för att komma igång. Ta den tid du behöver.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {modes.map(({ id, title, description, image, colour }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => start(id)}
                    className={`group relative flex h-full flex-col items-start rounded-[22px] border p-6 text-left transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#96691e] ${colour}`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#96691e]"
                    >
                      <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mb-4 flex h-28 w-40 max-w-full shrink-0 items-center justify-start">
                      <Image
                        src={image}
                        alt=""
                        width={460}
                        height={460}
                        className="h-full w-full object-contain object-left transition-transform duration-200 group-hover:scale-105"
                        sizes="160px"
                      />
                    </span>
                    <h3 className="text-lg font-extrabold leading-7 tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#54727b]">{description}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-extrabold text-[#96691e]">
                      Börja öva
                      <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : finished ? (
            <div className="mx-auto max-w-xl py-6 text-center" role="status">
              <Trophy size={56} className="mx-auto text-[#b8862d]" />
              <h2 className="mt-5 text-3xl font-extrabold">Bra jobbat!</h2>
              <p className="mt-3 text-[#54727b]">
                Du fick {score} av {round.length} rätt i{" "}
                {active?.title.toLowerCase()}.
              </p>
              <p className="mt-2 text-sm text-[#54727b]">
                Varje mening du övar på hjälper dig vidare.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => start(mode)}
                  className={button}
                >
                  <RotateCcw size={18} /> Öva igen
                </button>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="min-h-12 rounded-full border border-[#dfcfaa] px-6 text-sm font-bold text-[#96691e]"
                >
                  Välj en annan övning
                </button>
              </div>
            </div>
          ) : (
            current && (
              <div className="mx-auto max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setMode(null)}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#96691e]"
                  >
                    <ArrowLeft size={16} /> Byt övning
                  </button>
                  <span className="text-sm font-bold text-[#54727b]">
                    Fråga {index + 1} av {round.length}
                  </span>
                </div>
                <progress
                  aria-label="Besvarade frågor"
                  max={round.length}
                  value={index + (checked ? 1 : 0)}
                  className="mt-3 h-2 w-full overflow-hidden rounded-full accent-[#b8862d]"
                />
                <p className="mt-7 text-xs font-bold uppercase tracking-wide text-[#96691e]">
                  {active?.title}
                </p>
                <h2 className="mt-2 text-xl font-extrabold leading-relaxed sm:text-2xl">
                  {current.prompt}
                </h2>
                {mode === "build" ? (
                  <>
                    <p className="mt-2 text-sm text-[#54727b]">
                      Tryck på ett valt ord för att lägga tillbaka det. Punkt
                      läggs till automatiskt.
                    </p>
                    <div
                      aria-label="Din mening"
                      className="mt-6 flex min-h-24 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-[#dfcfaa] bg-[#fcfaf5] p-4"
                    >
                      {!selected.length && (
                        <span className="text-sm text-[#6a7474]">
                          Din mening hamnar här…
                        </span>
                      )}
                      {selected.map((id) => (
                        <button
                          type="button"
                          key={id}
                          disabled={checked}
                          onClick={() =>
                            setSelected((items) =>
                              items.filter((item) => item !== id),
                            )
                          }
                          aria-label={`Ta bort ${current.tiles.find((tile) => tile.id === id)!.word}`}
                          className="min-h-11 rounded-xl border border-[#dfcfaa] bg-white px-4 py-2 font-bold disabled:opacity-80"
                        >
                          {current.tiles.find((tile) => tile.id === id)!.word}
                        </button>
                      ))}
                      {selected.length > 0 && <span aria-hidden="true">.</span>}
                    </div>
                    <div
                      aria-label="Ord att välja"
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      {current.tiles
                        .filter((tile) => !selected.includes(tile.id))
                        .map((tile) => (
                          <button
                            type="button"
                            key={tile.id}
                            disabled={checked}
                            onClick={() =>
                              setSelected((items) => [...items, tile.id])
                            }
                            className="min-h-12 rounded-xl border border-[#e6ce91] bg-[#f8efd9] px-5 py-3 font-bold transition hover:bg-[#f2e5c6] disabled:opacity-50"
                          >
                            {tile.word}
                          </button>
                        ))}
                    </div>
                  </>
                ) : (
                  <fieldset className="mt-6 grid gap-3">
                    <legend className="sr-only">Välj ett svar</legend>
                    {current.choices.map((value) => (
                      <label
                        key={value}
                        className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border p-4 font-bold ${option === value ? "border-[#b8862d] bg-[#f8efd9]" : "border-[#dfe8eb] bg-[#fbfcfc]"}`}
                      >
                        <input
                          type="radio"
                          name={current.id}
                          value={value}
                          checked={option === value}
                          disabled={checked}
                          onChange={() => setOption(value)}
                          className="size-4 shrink-0 accent-[#96691e]"
                        />
                        {value}
                      </label>
                    ))}
                  </fieldset>
                )}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowHint((value) => !value)}
                    aria-expanded={showHint}
                    className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#96691e]"
                  >
                    <CircleHelp size={17} />{" "}
                    {showHint ? "Dölj hjälp" : "Visa hjälp"}
                  </button>
                  {showHint && (
                    <p className="mt-1 rounded-xl bg-[#fcf7e9] p-4 text-sm leading-6">
                      {current.explanation}
                    </p>
                  )}
                </div>
                <div aria-live="polite" aria-atomic="true">
                  {checked && (
                    <div
                      className={`mt-5 rounded-2xl border p-5 ${correct ? "border-[#b8ded0] bg-[#edf7f1]" : "border-[#edcda7] bg-[#fff6e9]"}`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <p className="flex items-center gap-2 font-extrabold">
                          {correct ? <Check size={20} /> : <X size={20} />}
                          {correct
                            ? "Precis rätt!"
                            : "Nästan! Titta på meningen nedan."}
                        </p>
                        <button
                          type="button"
                          onClick={handleToggleTrickyWord}
                          aria-pressed={isWordSaved}
                          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#dfcfaa] bg-white/80 px-4 py-2 text-sm font-bold text-[#80652b] transition hover:bg-[#fcf7e9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#96691e]"
                        >
                          <Star
                            size={16}
                            className={isWordSaved ? "fill-current" : ""}
                          />
                          {isWordSaved
                            ? "Sparat – ta bort"
                            : "Spara som klurigt ord"}
                        </button>
                      </div>
                      <p className="mt-3 font-bold">
                        {current.answer}
                        {mode === "build" ? "." : ""}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#54727b]">
                        {current.explanation}
                      </p>
                      {isWordSaved && (
                        <p className="mt-3 flex items-start gap-2 text-xs font-semibold text-[#80652b]">
                          <Star
                            size={14}
                            className="mt-0.5 shrink-0 fill-current"
                          />
                          {savedAutomatically
                            ? "Frågan har sparats automatiskt under Mina kluriga ord."
                            : "Frågan har sparats under Mina kluriga ord."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-7 flex justify-end">
                  {checked ? (
                    <button type="button" onClick={next} className={button}>
                      {index === round.length - 1
                        ? "Visa resultat"
                        : "Nästa fråga"}
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={check}
                      disabled={!ready}
                      className={button}
                    >
                      Kontrollera <Check size={18} />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </section>
      </div>
    </main>
  );
}
