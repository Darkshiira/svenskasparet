"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import {
  getTrickyWords,
  removeTrickyWord,
  TRICKY_WORDS_EVENT,
  type TrickyWord,
} from "@/app/lib/trickyWords";
import { recordAnswer } from "@/app/lib/progress";
import { GrunderTrickyPractice } from "@/app/components/grunder/GrunderTrickyPractice";

function exerciseLabel(exercise: TrickyWord["exercise"]) {
  switch (exercise) {
    case "en-eller-ett":
      return "En eller ett?";
    case "snabbspåret":
      return "Snabbspåret";
    case "stavning":
      return "Stavning";
    case "grunder":
      return "Grunder & hälsningar";
    case "meningsbyggnad":
      return "Meningsbyggnad";
    default:
      return exercise;
  }
}

function sameWord(a: TrickyWord, b: TrickyWord) {
  return a.id === b.id && a.exercise === b.exercise;
}

function normalizeAnswer(value: string) {
  return value.trim().toLocaleLowerCase("sv-SE");
}

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const random = new Uint32Array(1);
    window.crypto.getRandomValues(random);
    const j = random[0] % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function KlurigaOrdPage() {
  const [trickyWords, setTrickyWords] = useState<TrickyWord[] | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentWord, setCurrentWord] = useState<TrickyWord | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [tiles, setTiles] = useState<{ id: number; word: string }[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const answerLock = useRef(false);
  const sessionActive = useRef(false);
  const answered = selectedAnswer !== null;
  const isCorrect =
    currentWord !== null &&
    selectedAnswer !== null &&
    normalizeAnswer(selectedAnswer) === normalizeAnswer(currentWord.answer);

  useEffect(() => {
    function loadTrickyWords() {
      setTrickyWords(getTrickyWords());
    }

    loadTrickyWords();

    window.addEventListener(TRICKY_WORDS_EVENT, loadTrickyWords);
    window.addEventListener("storage", loadTrickyWords);

    return () => {
      window.removeEventListener(TRICKY_WORDS_EVENT, loadTrickyWords);
      window.removeEventListener("storage", loadTrickyWords);
    };
  }, []);

  useEffect(() => {
    function leaveExercise() {
      sessionActive.current = false;
      answerLock.current = true;
      setPracticeMode(false);
      setCurrentWord(null);
      setSelectedAnswer(null);
      setTypedAnswer("");
      setSelectedTiles([]);
      setTiles([]);
      setPracticeOptions([]);
    }
    window.addEventListener("exercise:leave", leaveExercise);
    window.addEventListener("popstate", leaveExercise);
    window.addEventListener("pagehide", leaveExercise);
    return () => {
      sessionActive.current = false;
      window.removeEventListener("exercise:leave", leaveExercise);
      window.removeEventListener("popstate", leaveExercise);
      window.removeEventListener("pagehide", leaveExercise);
    };
  }, []);

  function chooseNextWord(exclude?: TrickyWord) {
    answerLock.current = false;
    const words = getTrickyWords();
    setTrickyWords(words);

    const remaining = exclude
      ? words.filter((word) => !sameWord(word, exclude))
      : words;

    const choices = remaining.length > 0 ? remaining : words;

    if (choices.length === 0) {
      setCurrentWord(null);
      setPracticeMode(false);
      return;
    }

    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const next = choices[randomValues[0] % choices.length];

    setCurrentWord(next);
    setTiles(
      shuffle(
        (next.words ?? next.answer.split(" ")).map((word, id) => ({
          id,
          word,
        })),
      ),
    );
    setSelectedTiles([]);
    setPracticeOptions(
      shuffle(next.options ?? (next.mode === "article" ? ["en", "ett"] : [])),
    );
    setSelectedAnswer(null);
    setTypedAnswer("");
  }

  function startPractice() {
    const words = getTrickyWords();
    setTrickyWords(words);

    if (words.length === 0) return;

    setCorrectCount(0);
    setSessionCount(0);
    sessionActive.current = true;
    setPracticeMode(true);
    chooseNextWord();
  }

  function handleAnswer(answer: string) {
    if (!currentWord || !sessionActive.current || answerLock.current || answered) return;
    answerLock.current = true;

    const correct =
      normalizeAnswer(answer) === normalizeAnswer(currentWord.answer);

    setSelectedAnswer(answer);
    setSessionCount((count) => count + 1);

    if (correct) {
      setCorrectCount((count) => count + 1);
      removeTrickyWord(currentWord.id, currentWord.exercise);

      setTrickyWords((previous) =>
        (previous ?? []).filter((word) => !sameWord(word, currentWord)),
      );
    }

    recordAnswer(correct);
  }

  function submitTypedAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!typedAnswer.trim()) return;
    handleAnswer(typedAnswer);
  }

  function continuePractice() {
    if (!currentWord || !sessionActive.current || !answered) return;

    const remaining = getTrickyWords();
    setTrickyWords(remaining);

    if (remaining.length === 0) {
      setCurrentWord(null);
      return;
    }

    chooseNextWord(currentWord);
  }

  function stopPractice() {
    sessionActive.current = false;
    answerLock.current = true;
    setPracticeMode(false);
    setCurrentWord(null);
    setSelectedAnswer(null);
    setTypedAnswer("");
  }

  if (trickyWords === null) {
    return (
      <main className="min-h-screen bg-[#f3f7f9] px-4 py-10 text-[#173f45]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[#496c72]">Hämtar dina kluriga ord...</p>
        </div>
      </main>
    );
  }

  const options = practiceOptions;
  const useWordTiles =
    currentWord?.exercise === "meningsbyggnad" && currentWord.mode === "build";
  const useChoiceButtons =
    currentWord !== null &&
    options.length > 0 &&
    (currentWord.mode === "article" ||
      currentWord.mode === "choice" ||
      currentWord.mode === "missing");
  const builtAnswer = selectedTiles
    .map((id) => tiles.find((tile) => tile.id === id)!.word)
    .join(" ");

  return (
    <main className="min-h-screen bg-[#f3f7f9] px-4 py-6 text-[#173f45] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-3xl border border-white bg-white p-6 shadow-sm sm:p-9">
          {!practiceMode ? (
            <>
              <div className="mb-6 flex items-center gap-4 sm:gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24 md:h-28 md:w-28">
                  <Image
                    src="/images/kluriga-ord-icon-lightbulb.png"
                    alt="Ikon för kluriga ord"
                    width={460}
                    height={460}
                    priority
                    className="h-full w-full object-contain"
                    sizes="(max-width: 639px) 80px, (max-width: 767px) 96px, 112px"
                  />
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    Mina kluriga ord
                  </h1>
                  <p className="mt-2 leading-7 text-[#496c72]">
                    Här samlas ord och meningar du har svarat fel på. Öva på dem
                    igen och rensa listan allt eftersom du blir säkrare.
                  </p>
                </div>
              </div>

              <div className="mb-7 rounded-2xl bg-[#f0f6f4] p-5">
                <p className="text-sm font-semibold text-[#648083]">
                  Ord att öva på
                </p>
                <p className="mt-1 text-4xl font-extrabold text-[#17665d]">
                  {trickyWords.length}
                </p>
              </div>

              {trickyWords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#bcd9ce] px-5 py-10 text-center">
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-[#e5f5ec] text-[#17665d]">
                    <CheckCircle2 size={28} />
                  </div>
                  <h2 className="text-xl font-bold">
                    Inga kluriga ord just nu!
                  </h2>
                  <p className="mx-auto mt-2 max-w-md leading-7 text-[#496c72]">
                    När du svarar fel i en övning sparas frågan här så att du
                    kan träna på den igen.
                  </p>
                  <Link
                    href="/exercises/en-eller-ett"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48]"
                  >
                    Öva En eller ett?
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-3">
                    {trickyWords.map((word) => (
                      <div
                        key={`${word.exercise}-${word.id}`}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-[#e0eae7] p-4"
                      >
                        <div>
                          <p className="text-lg font-bold">{word.word}</p>
                          <p className="mt-1 text-xs font-semibold text-[#17665d]">
                            {exerciseLabel(word.exercise)}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#648083]">
                            {word.prompt}
                          </p>

                          {word.description && (
                            <p className="mt-1 text-sm leading-6 text-[#496c72]">
                              {word.description}
                            </p>
                          )}
                          <p className="mt-1 text-sm leading-6 text-[#496c72]">
                            Rätt svar:{" "}
                            <span className="font-semibold">{word.answer}</span>
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#648083]">
                            {word.explanation}
                          </p>
                          {word.example && (
                            <p className="mt-1 text-sm italic text-[#496c72]">
                              {word.example}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeTrickyWord(word.id, word.exercise)
                          }
                          className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold text-[#648083] transition hover:bg-[#f0f6f4]"
                          aria-label={`Ta bort ${word.word} från listan`}
                        >
                          Ta bort
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={startPractice}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48]"
                  >
                    <RotateCcw size={18} />
                    Öva på mina kluriga ord
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="mb-7 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#648083]">
                    Övning på kluriga ord
                  </p>
                  <p className="mt-1 text-lg font-bold">
                    {trickyWords.length} ord kvar i listan
                  </p>
                </div>

                <button
                  type="button"
                  onClick={stopPractice}
                  className="rounded-full border border-[#d7e5e3] px-4 py-2 text-sm font-semibold transition hover:bg-[#f0f6f4]"
                >
                  Avsluta
                </button>
              </div>

              {currentWord ? (
                <>
                  <p className="mb-2 text-sm font-semibold text-[#648083]">
                    {exerciseLabel(currentWord.exercise)}
                  </p>
                  <h2 className="text-2xl font-extrabold">
                    {currentWord.prompt}
                  </h2>

                  {currentWord.description && (
                    <p className="mt-3 text-sm leading-6 text-[#648083]">
                      {currentWord.description}
                    </p>
                  )}

                  {currentWord.exercise === "stavning" &&
                    currentWord.mode === "fill" && (
                      <p className="mt-3 text-sm font-medium text-[#17665d]">
                        Skriv hela ordet i rutan nedanför.
                      </p>
                    )}
                  {currentWord.mode === "article" && (
                    <div className="my-7 rounded-2xl bg-[#f0f6f4] px-5 py-10 text-center">
                      <p className="text-3xl font-extrabold">
                        {currentWord.word}
                      </p>
                    </div>
                  )}

                  {currentWord.exercise === "grunder" ? (
                    <GrunderTrickyPractice
                      key={`${currentWord.exercise}:${currentWord.id}`}
                      item={currentWord}
                      options={practiceOptions}
                      answered={answered}
                      selectedAnswer={selectedAnswer}
                      onAnswer={handleAnswer}
                    />
                  ) : useWordTiles ? (
                    <div className="mt-6 space-y-4">
                      <p className="text-sm text-[#496c72]">
                        Tryck på orden i rätt ordning. Tryck på ett valt ord för
                        att lägga tillbaka det.
                      </p>
                      <div
                        aria-label="Din mening"
                        className="flex min-h-24 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-[#dfcfaa] bg-[#fcfaf5] p-4"
                      >
                        {selectedTiles.length === 0 && (
                          <span className="text-sm text-[#648083]">
                            Din mening hamnar här…
                          </span>
                        )}
                        {selectedTiles.map((id) => (
                          <button
                            key={id}
                            type="button"
                            disabled={answered}
                            onClick={() =>
                              setSelectedTiles((items) =>
                                items.filter((item) => item !== id),
                              )
                            }
                            aria-label={`Ta bort ${tiles.find((tile) => tile.id === id)!.word}`}
                            className="min-h-11 rounded-xl border border-[#dfcfaa] bg-white px-4 py-2 font-bold"
                          >
                            {tiles.find((tile) => tile.id === id)!.word}
                          </button>
                        ))}
                        {selectedTiles.length > 0 && (
                          <span aria-hidden="true">.</span>
                        )}
                      </div>
                      <div
                        aria-label="Ord att välja"
                        className="flex flex-wrap gap-2"
                      >
                        {tiles
                          .filter((tile) => !selectedTiles.includes(tile.id))
                          .map((tile) => (
                            <button
                              key={tile.id}
                              type="button"
                              disabled={answered}
                              onClick={() =>
                                setSelectedTiles((items) => [...items, tile.id])
                              }
                              className="min-h-12 rounded-xl border border-[#dfcfaa] bg-[#f8efd9] px-4 py-3 font-bold"
                            >
                              {tile.word}
                            </button>
                          ))}
                      </div>
                      {!answered && (
                        <button
                          type="button"
                          disabled={selectedTiles.length !== tiles.length}
                          onClick={() => handleAnswer(builtAnswer)}
                          className="min-h-12 w-full rounded-full bg-[#17665d] px-6 py-3 font-bold text-white disabled:opacity-50"
                        >
                          Kontrollera svar
                        </button>
                      )}
                    </div>
                  ) : useChoiceButtons ? (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {options.map((option) => {
                        const chosen = selectedAnswer === option;
                        const correctChoice =
                          normalizeAnswer(option) ===
                          normalizeAnswer(currentWord.answer);

                        let style =
                          "border-[#d7e5e3] bg-white hover:border-[#58a995]";

                        if (answered && correctChoice) {
                          style =
                            "border-[#58a995] bg-[#e5f5ec] text-[#17665d]";
                        } else if (chosen && !isCorrect) {
                          style =
                            "border-[#e7a18d] bg-[#fff0e9] text-[#a94732]";
                        }

                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={answered}
                            onClick={() => handleAnswer(option)}
                            className={`min-h-16 rounded-2xl border-2 px-4 py-4 text-lg font-extrabold transition disabled:cursor-default ${style}`}
                          >
                            {option}
                            {answered && correctChoice && (
                              <CheckCircle2 className="ml-2 inline" size={20} />
                            )}
                            {chosen && !isCorrect && (
                              <XCircle className="ml-2 inline" size={20} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <form onSubmit={submitTypedAnswer} className="space-y-3">
                      <label
                        htmlFor="typed-answer"
                        className="block text-sm font-semibold text-[#496c72]"
                      >
                        Skriv ditt svar
                      </label>
                      <input
                        id="typed-answer"
                        value={typedAnswer}
                        onChange={(event) => setTypedAnswer(event.target.value)}
                        disabled={answered}
                        autoComplete="off"
                        className="min-h-12 w-full rounded-2xl border border-[#d7e5e3] px-4 py-3 outline-none focus:border-[#58a995]"
                        placeholder="Ditt svar..."
                      />
                      {!answered && (
                        <button
                          type="submit"
                          disabled={!typedAnswer.trim()}
                          className="min-h-12 w-full rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Kontrollera svar
                        </button>
                      )}
                    </form>
                  )}

                  {answered && (
                    <div
                      className={`mt-5 rounded-2xl p-4 ${
                        isCorrect
                          ? "bg-[#e5f5ec] text-[#17665d]"
                          : "bg-[#fff0e9] text-[#a94732]"
                      }`}
                      aria-live="polite"
                    >
                      <p className="font-bold">
                        {isCorrect
                          ? "Rätt! Frågan är avklarad! 🎉"
                          : "Inte riktigt!"}
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {currentWord.explanation}
                      </p>
                      {!isCorrect && (
                        <p className="mt-2 text-sm font-semibold">
                          Rätt svar: {currentWord.answer}
                        </p>
                      )}
                      {currentWord.example && (
                        <p className="mt-2 text-sm italic">
                          {currentWord.example}
                        </p>
                      )}
                    </div>
                  )}

                  {answered && (
                    <button
                      type="button"
                      onClick={continuePractice}
                      className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48]"
                    >
                      {trickyWords.length === 0
                        ? "Visa sammanfattning"
                        : "Nästa fråga"}
                      <ArrowLeft className="rotate-180" size={18} />
                    </button>
                  )}
                </>
              ) : (
                <div className="py-8 text-center">
                  <CheckCircle2
                    className="mx-auto mb-4 text-[#58a995]"
                    size={48}
                  />
                  <h2 className="text-2xl font-extrabold">Snyggt jobbat!</h2>
                  <p className="mt-3 leading-7 text-[#496c72]">
                    Du svarade rätt på {correctCount} av {sessionCount} frågor.
                    Alla ord du klarade är borttagna från listan.
                  </p>
                  <button
                    type="button"
                    onClick={stopPractice}
                    className="mt-6 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48]"
                  >
                    Till ordlistan
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-[#648083]">
          Dina ord sparas lokalt i webbläsaren på den här enheten.
        </p>
      </div>
    </main>
  );
}
