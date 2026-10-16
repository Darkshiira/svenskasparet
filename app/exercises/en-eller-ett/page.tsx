"use client";

import { recordAnswer } from "@/app/lib/progress";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Star,
  XCircle,
} from "lucide-react";
import { enEttQuestions, type Article } from "@/app/data/enEtt";
import { saveTrickyWord, removeTrickyWord } from "@/app/lib/trickyWords";
import {
  recordCompletedRound,
  recordExerciseResult,
} from "@/app/lib/exerciseProgress";

const TRICKY_WORDS_KEY = "svenskasparet-tricky-words";

const QUESTIONS_PER_GAME = 10;

function getRandomQuestions() {
  const shuffled = [...enEttQuestions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, QUESTIONS_PER_GAME);
}

function saveAnswer(word: string, isCorrect: boolean) {
  recordAnswer(isCorrect);

  // Automatically save incorrect answers to Mina kluriga ord.
  if (!isCorrect) {
    const question = enEttQuestions.find((item) => item.word === word);

    if (!question) return;

    saveTrickyWord({
      id: question.id,
      word: question.word,
      exercise: "en-eller-ett",
      mode: "article",
      prompt: `Vilket passar: en eller ett ${question.word}?`,
      answer: question.correctArticle,
      options: ["en", "ett"],
      explanation: question.explanation,
      example: question.example,
    });
  }
}

function toggleTrickyWord(word: string): boolean {
  const question = enEttQuestions.find((item) => item.word === word);

  if (!question) return false;

  try {
    const stored = localStorage.getItem(TRICKY_WORDS_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];

    const words: unknown[] = Array.isArray(parsed) ? parsed : [];

    const isSaved = words.some((item) => {
      if (typeof item === "string") return item === word;

      if (typeof item === "object" && item !== null && "id" in item) {
        const saved = item as { id?: unknown; exercise?: unknown };

        return saved.id === question.id && saved.exercise === "en-eller-ett";
      }

      return false;
    });

    if (isSaved) {
      removeTrickyWord(question.id, "en-eller-ett");
      return false;
    }

    saveTrickyWord({
      id: question.id,
      word: question.word,
      exercise: "en-eller-ett",
      mode: "article",
      prompt: `Vilket passar: en eller ett ${question.word}?`,
      answer: question.correctArticle,
      options: ["en", "ett"],
      explanation: question.explanation,
      example: question.example,
    });

    return true;
  } catch {
    return false;
  }
}

export default function EnEllerEttPage() {
  const pathname = usePathname();
  const [questions, setQuestions] = useState<typeof enEttQuestions>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Article | null>(null);
  const [score, setScore] = useState(0);
  const [savedWords, setSavedWords] = useState<string[]>([]);

  useEffect(() => {
    function handleLeave() {
      setQuestions([]);
      setGameStarted(false);
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
    }

    window.addEventListener("exercise:leave", handleLeave);

    return () => {
      window.removeEventListener("exercise:leave", handleLeave);
    };
  }, []);

  useEffect(() => {
    function updateSavedWords() {
      try {
        const stored = localStorage.getItem(TRICKY_WORDS_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : [];

        const words: string[] = Array.isArray(parsed)
          ? parsed
              .map((item) => {
                if (typeof item === "string") {
                  return item;
                }

                if (
                  typeof item === "object" &&
                  item !== null &&
                  "word" in item &&
                  typeof item.word === "string"
                ) {
                  return item.word;
                }

                return null;
              })
              .filter((word): word is string => word !== null)
          : [];

        setSavedWords(words);
      } catch {
        setSavedWords([]);
      }
    }

    updateSavedWords();

    window.addEventListener(
      "svenskasparet-tricky-words-updated",
      updateSavedWords,
    );
    window.addEventListener("storage", updateSavedWords);

    return () => {
      window.removeEventListener(
        "svenskasparet-tricky-words-updated",
        updateSavedWords,
      );
      window.removeEventListener("storage", updateSavedWords);
    };
  }, []);
  useEffect(() => {
    if (pathname !== "/exercises/en-eller-ett") return;

    const start = () => {
      setQuestions(getRandomQuestions());
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setGameStarted(true);
    };

    start();
  }, [pathname]);
  const finished =
    gameStarted && questions.length > 0 && questionIndex >= questions.length;
  const question = questions[questionIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = answered && selectedAnswer === question?.correctArticle;

  const isWordSaved = question ? savedWords.includes(question.word) : false;

  const progress =
    questions.length === 0
      ? 0
      : finished
        ? 100
        : (questionIndex / questions.length) * 100;

  function handleAnswer(answer: Article) {
    if (answered || !question) return;

    const correct = answer === question.correctArticle;

    setSelectedAnswer(answer);

    if (correct) {
      setScore((current) => current + 1);
    }

    saveAnswer(question.word, correct);
  }

  function handleToggleTrickyWord() {
    if (!question) return;

    const wasSaved = savedWords.includes(question.word);
    const saved = toggleTrickyWord(question.word);

    // Update the UI only when the storage operation succeeds.
    if (saved !== wasSaved) {
      setSavedWords((current) =>
        saved
          ? [...current.filter((word) => word !== question.word), question.word]
          : current.filter((word) => word !== question.word),
      );
    }
  }

  function handleNext() {
    if (selectedAnswer === null || finished || questions.length === 0) {
      return;
    }

    if (questionIndex === questions.length - 1) {
      recordCompletedRound("en-eller-ett");

      recordExerciseResult("en-eller-ett", score, questions.length);
    }

    setSelectedAnswer(null);
    setQuestionIndex((current) => current + 1);
  }

  function handleRestart() {
    setQuestions(getRandomQuestions());
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setGameStarted(true);
  }

  return (
    <main className="min-h-screen bg-[#f3f7f9] px-4 py-5 text-[#173f45] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#ovningar"
          className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#54727b]"
        >
          <ArrowLeft size={18} /> Alla övningar
        </Link>
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-[#fff0eb] via-[#fdf2ef] to-[#f9e9e3] p-6 sm:p-9">
          <div className="relative z-10 flex items-center gap-3 sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#92533f]">
                <BookOpen size={15} />
                Grammatik · Grundnivå
              </div>

              <h1 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                En eller ett?
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#795b57] sm:text-base">
                Vilket ord passar? Ta en fråga i taget och lär dig varför svaret
                är rätt. Det är helt okej att göra misstag längs vägen!
              </p>
            </div>

            <div className="relative hidden h-32 w-32 shrink-0 items-center justify-center sm:flex sm:h-40 sm:w-40 md:h-48 md:w-48">
              <Image
                src="/images/En-eller-ett-icon.png"
                alt=""
                width={192}
                height={192}
                priority
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-3 text-sm font-medium text-[#795b57]">
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-2">
              {questions.length} frågor
            </span>
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-2">
              Direkt feedback
            </span>
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-2">
              Förklaringar ingår
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-[#e1e9eb] bg-white p-5 shadow-[0_12px_40px_rgba(30,70,75,0.05)] sm:p-8">
          {!gameStarted || questions.length === 0 ? (
            <div className="py-12 text-center text-[#617c81]">
              Förbereder övningen...
            </div>
          ) : !finished ? (
            <>
              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                  <span className="font-bold text-[#42656b]">
                    Fråga {questionIndex + 1} av {questions.length}
                  </span>
                  <span className="font-semibold text-[#6c8589]">
                    {score} rätt hittills
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-[#e9efef]"
                  role="progressbar"
                  aria-label="Framsteg i övningen"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#398577] to-[#79b99d] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="py-5 text-center sm:py-8">
                <p className="text-sm font-semibold text-[#668187]">
                  Vilket alternativ är rätt?
                </p>

                <h2 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  {question.word}
                </h2>

                <p className="mt-3 text-sm text-[#71888d]">
                  Välj det ord som passar bäst framför substantivet.
                </p>
              </div>

              <div className="mx-auto grid max-w-xl grid-cols-2 gap-3 sm:gap-5">
                {(["en", "ett"] as Article[]).map((article) => {
                  const isSelected = selectedAnswer === article;
                  const isRightAnswer = question.correctArticle === article;

                  let buttonStyle =
                    "border-[#dce8e8] bg-[#f8fbfa] text-[#244f54] hover:border-[#79b6a3] hover:bg-[#f0f8f4]";

                  if (answered && isRightAnswer) {
                    buttonStyle =
                      "border-[#83bea1] bg-[#e8f6ed] text-[#246849]";
                  } else if (answered && isSelected && !isRightAnswer) {
                    buttonStyle =
                      "border-[#e6a29a] bg-[#fff0ed] text-[#a33e35]";
                  }

                  return (
                    <button
                      key={article}
                      type="button"
                      onClick={() => handleAnswer(article)}
                      disabled={answered}
                      aria-pressed={isSelected}
                      className={`min-h-24 rounded-2xl border-2 p-5 text-2xl font-extrabold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d] disabled:cursor-default sm:min-h-28 sm:text-3xl ${buttonStyle}`}
                    >
                      {article}

                      {answered && isRightAnswer && (
                        <CheckCircle2
                          className="mx-auto mt-2"
                          size={20}
                          aria-label="Rätt svar"
                        />
                      )}

                      {answered && isSelected && !isRightAnswer && (
                        <XCircle
                          className="mx-auto mt-2"
                          size={20}
                          aria-label="Ditt svar var fel"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div
                  className={`mt-6 rounded-2xl border p-5 sm:p-6 ${
                    isCorrect
                      ? "border-[#c8e7d4] bg-[#f0faf3]"
                      : "border-[#f0d6c7] bg-[#fff7f1]"
                  }`}
                  aria-live="polite"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${
                        isCorrect
                          ? "bg-[#d6efdf] text-[#26704c]"
                          : "bg-[#f9e2d4] text-[#a64e34]"
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <BookOpen size={20} />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      {/* Header: feedback title on the left, save button on the right */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <h3 className="font-extrabold">
                          {isCorrect ? "Snyggt jobbat!" : "Bra att du övar!"}
                        </h3>

                        {isCorrect && (
                          <button
                            type="button"
                            onClick={handleToggleTrickyWord}
                            aria-pressed={isWordSaved}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#cbdedd] bg-white/80 px-4 py-2 text-sm font-bold text-[#285b5b] transition hover:bg-[#f0f8f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d] sm:ml-4"
                          >
                            <Star
                              size={16}
                              className={isWordSaved ? "fill-current" : ""}
                            />
                            {isWordSaved
                              ? "Sparat – ta bort"
                              : "Spara som klurigt ord"}
                          </button>
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-[#49676a]">
                        Rätt svar är{" "}
                        <strong>
                          {question.correctArticle} {question.word}
                        </strong>
                        .
                      </p>

                      <p className="mt-3 text-sm leading-6 text-[#49676a]">
                        {question.explanation}
                      </p>

                      <div className="mt-4 rounded-xl bg-white/75 p-3 text-sm text-[#345c60]">
                        <span className="font-bold">Exempel: </span>
                        <span>{question.example}</span>
                      </div>

                      {!isCorrect && (
                        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#8b5a43]">
                          <Star size={14} />
                          Ordet har sparats automatiskt under Mina kluriga ord.
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#17665d] px-5 py-3 font-bold text-white shadow-sm transition hover:bg-[#104f49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d] sm:w-auto"
                  >
                    {questionIndex === questions.length - 1
                      ? "Se resultat"
                      : "Nästa fråga"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center sm:py-12">
              <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#e0f2e7] text-[#287453]">
                <Star size={38} />
              </span>

              <p className="mt-6 text-sm font-bold uppercase tracking-wider text-[#528176]">
                Övningen är klar
              </p>

              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                Bra kämpat!
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-7 text-[#617c81]">
                Du har gått igenom alla frågor. Varje gång du övar blir du lite
                säkrare på svenskan.
              </p>

              <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-[#f0f7f4] p-6">
                <p className="text-sm font-semibold text-[#52716f]">
                  Dina resultat
                </p>
                <p className="mt-2 text-5xl font-extrabold text-[#17665d]">
                  {score} / {questions.length}
                </p>
                <p className="mt-2 text-sm text-[#617c81]">
                  rätt svar · {Math.round((score / questions.length) * 100)}%
                </p>
              </div>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#104f49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d]"
                >
                  <RotateCcw size={17} />
                  Öva igen
                </button>

                <Link
                  href="/"
                  onClick={() => {
                    setQuestions([]);
                    setGameStarted(false);
                    setQuestionIndex(0);
                    setSelectedAnswer(null);
                    setScore(0);
                  }}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#cbdedd] bg-white px-6 py-3 font-bold text-[#285b5b] transition hover:bg-[#f4f9f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d]"
                >
                  Till startsidan
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
