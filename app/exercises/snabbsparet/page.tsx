
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Leaf,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import { enEttQuestions, type Article } from "@/app/data/enEtt";
import { recordAnswer } from "@/app/lib/progress";

const ROUND_SECONDS = 60;
const TRICKY_WORDS_KEY = "svenskasparet-tricky-words";

type Question = (typeof enEttQuestions)[number];

function shuffleQuestions(): Question[] {
  return [...enEttQuestions].sort(() => Math.random() - 0.5);
}

export default function SnabbsparetPage() {
  const [answeredCount, setAnsweredCount] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(enEttQuestions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [selectedAnswer, setSelectedAnswer] = useState<Article | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const question = questions[questionIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question?.correctArticle;

  function resetRound() {
  setAnsweredCount(0);
  setQuestions(enEttQuestions);
  setQuestionIndex(0);
  setScore(0);
  setSecondsLeft(ROUND_SECONDS);
  setSelectedAnswer(null);
  setStarted(false);
  setFinished(false);
}

useEffect(() => {
  window.addEventListener("popstate", resetRound);

  return () => {
    window.removeEventListener("popstate", resetRound);
  };
}, []);

function startRound() {
  setQuestions(shuffleQuestions());
  setQuestionIndex(0);
  setScore(0);
  setSecondsLeft(ROUND_SECONDS);
  setSelectedAnswer(null);
  setFinished(false);
  setStarted(true);
  setAnsweredCount(0);
}

useEffect(() => {
  if (!started || finished) return;

  const timer = window.setInterval(() => {
    setSecondsLeft((current) => Math.max(0, current - 1));
  }, 1000);

  return () => window.clearInterval(timer);
}, [started, finished]);

useEffect(() => {
  if (!started || finished || secondsLeft !== 0) return;

  const timeout = window.setTimeout(() => {
    setFinished(true);
  }, 0);

  return () => window.clearTimeout(timeout);
}, [started, finished, secondsLeft]);

  function handleAnswer(answer: Article) {
    if (!started || finished || answered || !question) return;

    const correct = answer === question.correctArticle;

    setSelectedAnswer(answer);
    setAnsweredCount((current) => current + 1);

    if (correct) {
      setScore((current) => current + 1);
    }

    recordAnswer(correct);

    try {
      const saved = localStorage.getItem(TRICKY_WORDS_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];

      const words: string[] = Array.isArray(parsed)
        ? parsed.filter((word): word is string => typeof word === "string")
        : [];

      const updatedWords = correct
        ? words.filter((word) => word !== question.word)
        : Array.from(new Set([...words, question.word]));

      localStorage.setItem(
        TRICKY_WORDS_KEY,
        JSON.stringify(updatedWords),
      );
    } catch {
      // Övningen fungerar även om ordlistan inte kan sparas.
    }
  }


  function nextQuestion() {  
    if (!answered) return;
    if (questionIndex + 1 >= questions.length) {
    // Alla ord har visats. Blanda dem och fortsätt!
        setQuestions(shuffleQuestions());
        setQuestionIndex(0);
      } else {
        setQuestionIndex((current) => current + 1);
      }
        setSelectedAnswer(null);
      
  }


  const accuracy =
  answeredCount > 0
    ? Math.round((score / answeredCount) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#f3f7f9] px-4 py-6 text-[#173f45] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">

        <section className="rounded-3xl border border-white bg-white p-6 shadow-sm sm:p-9">
          {!started && !finished && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 grid size-20 place-items-center rounded-3xl bg-[#e1f1e9] text-[#17665d]">
                <Clock3 size={42} />
              </div>

              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#398577]">
                Dags för en utmaning!
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Snabbspåret
              </h1>

              <p className="mx-auto mt-4 max-w-lg leading-7 text-[#496c72]">
                Hur många frågor klarar du på 60 sekunder? Svara så snabbt
                du kan, samla poäng och se hur det gick.
              </p>

              <div className="my-7 flex flex-wrap justify-center gap-3 text-sm font-semibold">
                <span className="rounded-full bg-[#edf6f1] px-4 py-2">
                  ⏱️ 60 sekunder
                </span>
                <span className="rounded-full bg-[#edf6f1] px-4 py-2">
                  ⭐ 1 poäng per rätt svar
                </span>
                <span className="rounded-full bg-[#edf6f1] px-4 py-2">
                  📚 Blandade frågor
                </span>
              </div>

              <button
                type="button"
                onClick={startRound}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17665d] px-8 py-3 font-bold text-white transition hover:bg-[#124e48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d]"
              >
                Starta utmaningen
                <Clock3 size={18} />
              </button>
            </div>
          )}

          {started && !finished && question && (
            <>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#648083]">
                    Din poäng
                  </p>
                  <p className="text-3xl font-extrabold">{score}</p>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-extrabold ${
                    secondsLeft <= 10
                      ? "bg-[#fff0e9] text-[#c45d42]"
                      : "bg-[#e6f3ed] text-[#17665d]"
                  }`}
                  aria-live="polite"
                >
                  <Clock3 size={20} />
                  <span className="text-2xl tabular-nums">
                    {secondsLeft}s
                  </span>
                </div>
              </div>

              <div className="mb-8 h-2 overflow-hidden rounded-full bg-[#e7eeee]">
                <div
                  className="h-full rounded-full bg-[#58a995] transition-all"
                  style={{
                    width: `${(secondsLeft / ROUND_SECONDS) * 100}%`,
                  }}
                />
              </div>

              <p className="mb-3 text-sm font-semibold text-[#648083]">
                Fråga {questionIndex + 1} av {questions.length}
              </p>

              <h2 className="text-2xl font-extrabold sm:text-3xl">
                Vilket passar?
              </h2>

              <div className="my-7 rounded-2xl bg-[#f0f6f4] px-5 py-8 text-center sm:py-10">
                <p className="text-3xl font-extrabold sm:text-4xl">
                  {question.word}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(["en", "ett"] as Article[]).map((article) => {
                  const chosen = selectedAnswer === article;
                  const correctChoice = question.correctArticle === article;

                  let buttonStyle =
                    "border-[#d7e5e3] bg-white hover:border-[#58a995] hover:bg-[#f5faf8]";

                  if (answered && correctChoice) {
                    buttonStyle = "border-[#58a995] bg-[#e5f5ec] text-[#17665d]";
                  } else if (chosen && !isCorrect) {
                    buttonStyle = "border-[#e7a18d] bg-[#fff0e9] text-[#a94732]";
                  }

                  return (
                    <button
                      key={article}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswer(article)}
                      className={`min-h-20 rounded-2xl border-2 px-4 py-5 text-2xl font-extrabold transition disabled:cursor-default ${buttonStyle}`}
                    >
                      {article}
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
                    {isCorrect ? "Rätt! Snyggt jobbat! 🎉" : "Inte riktigt!"}
                  </p>
                  <p className="mt-1 text-sm leading-6">
                    {question.explanation}
                  </p>
                </div>
              )}

              <div className="mt-7 flex justify-end">
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={!answered}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Nästa fråga
                  <ArrowLeft className="rotate-180" size={18} />
                </button>
              </div>
            </>
          )}

          {finished && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-5 grid size-20 place-items-center rounded-3xl bg-[#fff3d9] text-[#a46b12]">
                <Trophy size={42} />
              </div>

              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#398577]">
                Utmaningen är klar
              </p>

              <h1 className="text-3xl font-extrabold sm:text-4xl">
                Bra kämpat!
              </h1>

              <p className="mt-4 text-[#496c72]">
                Du fick
              </p>

              <p className="my-2 text-6xl font-extrabold text-[#17665d]">
                {score}
              </p>

              <p className="text-lg font-bold">
                {score} poäng av {answeredCount} besvarade frågor
              </p>

              <p className="mt-3 text-sm text-[#648083]">
                Träffsäkerhet: {accuracy}%
              </p>

              <p className="mx-auto mt-5 max-w-md leading-7 text-[#496c72]">
                {answeredCount > 0 && score === answeredCount
                ? "Fantastiskt! Du svarade rätt på alla frågor!"
                : accuracy >= 50
                ? "Riktigt bra jobbat! Fortsätt öva så blir du ännu säkrare."
                : "Varje fråga är en chans att lära sig något nytt. Försök gärna igen!"}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={startRound}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48]"
                >
                  <RotateCcw size={18} />
                  Spela igen
                </button>

                <Link
                href="/"
                onClick={resetRound}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d7e5e3] px-6 py-3 font-bold text-[#315d61] transition hover:bg-[#f0f6f4]"
                >
                  Till startsidan
                </Link>
              </div>
            </div>
          )}
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-[#648083]">
          Dina svar sparas lokalt i webbläsaren på den här enheten.
        </p>
      </div>
    </main>
  );
}