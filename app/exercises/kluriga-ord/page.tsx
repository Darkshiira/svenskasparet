
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { enEttQuestions, type Article } from "@/app/data/enEtt";
import { recordAnswer } from "@/app/lib/progress";

const TRICKY_WORDS_KEY = "svenskasparet-tricky-words";

type Question = (typeof enEttQuestions)[number];

export default function KlurigaOrdPage() {
  const [trickyWords, setTrickyWords] = useState<string[] | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentWord, setCurrentWord] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<Article | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);

  const currentQuestion = currentWord;
  const answered = selectedAnswer !== null;
  const isCorrect =
    selectedAnswer === currentQuestion?.correctArticle;

  // Läs ordlistan när sidan har laddats i webbläsaren.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(TRICKY_WORDS_KEY);
        const parsed: unknown = saved ? JSON.parse(saved) : [];

        const words: string[] = Array.isArray(parsed)
          ? parsed.filter(
              (word): word is string => typeof word === "string",
            )
          : [];

        setTrickyWords(
          Array.from(new Set(words)).filter((word) =>
            enEttQuestions.some((question) => question.word === word),
          ),
        );
      } catch {
        setTrickyWords([]);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const availableQuestions =
    trickyWords?.length
      ? enEttQuestions.filter((question) =>
          trickyWords.includes(question.word),
        )
      : [];

  function saveTrickyWords(words: string[]) {
    setTrickyWords(words);

    try {
      localStorage.setItem(TRICKY_WORDS_KEY, JSON.stringify(words));
    } catch {
      // Sidan kan fortfarande användas även om lagringen misslyckas.
    }
  }

 
function chooseNextWord(excludeWord?: string) {
  const remaining = availableQuestions.filter(
    (question) => question.word !== excludeWord,
  );

  const choices =
    remaining.length > 0 ? remaining : availableQuestions;

  if (choices.length === 0) {
    setCurrentWord(null);
    setPracticeMode(false);
    return;
  }

  // Använd ett slumpat index från Web Crypto i stället för Math.random().
  const randomValues = new Uint32Array(1);
  window.crypto.getRandomValues(randomValues);

  const randomIndex = randomValues[0] % choices.length;
  const next = choices[randomIndex];

  setCurrentWord(next);
  setSelectedAnswer(null);
}


  function startPractice() {
    if (availableQuestions.length === 0) return;

    setCorrectCount(0);
    setSessionCount(0);
    setPracticeMode(true);
    chooseNextWord();
  }

  function handleAnswer(answer: Article) {
    if (!currentQuestion || answered) return;

    const correct = answer === currentQuestion.correctArticle;

    setSelectedAnswer(answer);
    setSessionCount((count) => count + 1);

    if (correct) {
      setCorrectCount((count) => count + 1);
      saveTrickyWords(
        (trickyWords ?? []).filter(
          (word) => word !== currentQuestion.word,
        ),
      );
    }

    recordAnswer(correct);
  }

  function continuePractice() {
    if (!currentQuestion || !answered) return;

    if (trickyWords && trickyWords.length === 0) {
      setPracticeMode(false);
      setCurrentWord(null);
      return;
    }

    chooseNextWord(currentQuestion.word);
  }

  function stopPractice() {
    setPracticeMode(false);
    setCurrentWord(null);
    setSelectedAnswer(null);
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

  return (
    <main className="min-h-screen bg-[#f3f7f9] px-4 py-6 text-[#173f45] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">

        <section className="rounded-3xl border border-white bg-white p-6 shadow-sm sm:p-9">
          {!practiceMode ? (
            <>
              <div className="mb-6 flex items-start gap-4">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#fff0e9] text-[#bd6248]">
                  <Sparkles size={28} />
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">
                    Mina kluriga ord
                  </h1>
                  <p className="mt-2 leading-7 text-[#496c72]">
                    Här samlas orden du har svarat fel på. Öva på dem
                    igen och rensa listan allt eftersom du blir säkrare.
                  </p>
                </div>
              </div>

              <div className="mb-7 rounded-2xl bg-[#f0f6f4] p-5">
                <p className="text-sm font-semibold text-[#648083]">
                  Ord att öva på
                </p>
                <p className="mt-1 text-4xl font-extrabold text-[#17665d]">
                  {availableQuestions.length}
                </p>
              </div>

              {availableQuestions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#bcd9ce] px-5 py-10 text-center">
                  <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-[#e5f5ec] text-[#17665d]">
                    <CheckCircle2 size={28} />
                  </div>
                  <h2 className="text-xl font-bold">
                    Inga kluriga ord just nu!
                  </h2>
                  <p className="mx-auto mt-2 max-w-md leading-7 text-[#496c72]">
                    När du svarar fel på ett ord i En eller ett? eller
                    Snabbspåret hamnar det här. Kom tillbaka när du har
                    några ord att träna på.
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
                    {availableQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-[#e0eae7] p-4"
                      >
                        <div>
                          <p className="text-lg font-bold">
                            {question.correctArticle} {question.word}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#648083]">
                            {question.explanation}
                          </p>
                          <p className="mt-1 text-sm italic text-[#496c72]">
                            {question.example}
                          </p>
                        </div>
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

              {currentQuestion ? (
                <>
                  <h2 className="text-2xl font-extrabold">
                    Vilket passar?
                  </h2>

                  <div className="my-7 rounded-2xl bg-[#f0f6f4] px-5 py-10 text-center">
                    <p className="text-4xl font-extrabold">
                      {currentQuestion.word}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {(["en", "ett"] as Article[]).map((article) => {
                      const chosen = selectedAnswer === article;
                      const correctChoice =
                        currentQuestion.correctArticle === article;

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
                          key={article}
                          type="button"
                          disabled={answered}
                          onClick={() => handleAnswer(article)}
                          className={`min-h-20 rounded-2xl border-2 px-4 py-5 text-2xl font-extrabold transition disabled:cursor-default ${style}`}
                        >
                          {article}
                          {answered && correctChoice && (
                            <CheckCircle2
                              className="ml-2 inline"
                              size={20}
                            />
                          )}
                          {chosen && !isCorrect && (
                            <XCircle className="ml-2 inline" size={20} />
                          )}
                        </button>
                      );
                    })}
                  </div>

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
                        {isCorrect ? "Rätt! Ordet är avklarat! 🎉" : "Inte riktigt!"}
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {currentQuestion.explanation}
                      </p>
                      <p className="mt-2 text-sm italic">
                        {currentQuestion.example}
                      </p>
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
                        : "Nästa ord"}
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
                  <h2 className="text-2xl font-extrabold">
                    Snyggt jobbat!
                  </h2>
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
