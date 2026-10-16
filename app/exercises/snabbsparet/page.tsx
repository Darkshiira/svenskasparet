"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";

import { enEttQuestions } from "@/app/data/enEtt";
import { questions as spellingQuestions } from "@/app/data/stavningsjakten";
import { questions as sentenceQuestions } from "@/app/data/meningsbyggnad";
import { situations, positions, type Position } from "@/app/data/grunder";
import { PositionPicture } from "@/app/components/grunder/GrunderPictures";
import { recordAnswer } from "@/app/lib/progress";
import { saveTrickyWord, type TrickyWord } from "@/app/lib/trickyWords";

const ROUND_SECONDS = 60;

type SpeedQuestion = {
  key: string;
  category: string;
  prompt: string;
  text?: string;
  context?: string;
  speech?: string;
  position?: Position;
  options: string[];
  answer: string;
  explanation: string;
  trickyWord: TrickyWord;
};

function shuffle<T>(items: readonly T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

const questionGroups: SpeedQuestion[][] = [
  enEttQuestions.map((question) => ({
    key: `article:${question.id}`,
    category: "En eller ett?",
    prompt: "Vilket passar?",
    text: question.word,
    options: ["en", "ett"],
    answer: question.correctArticle,
    explanation: question.explanation,
    trickyWord: {
      id: question.id,
      word: question.word,
      exercise: "en-eller-ett",
      mode: "article",
      prompt: `Vilket passar: en eller ett ${question.word}?`,
      answer: question.correctArticle,
      options: ["en", "ett"],
      explanation: question.explanation,
      example: question.example,
    },
  })),

  ...(["choice", "double"] as const).map((mode) =>
    spellingQuestions[mode]
      .filter((question) => question.options?.length)
      .map(
        (question): SpeedQuestion => ({
          key: `spelling:${question.id}`,
          category: mode === "choice" ? "Rätt stavning" : "En eller två?",
          prompt:
            mode === "choice"
              ? question.prompt
              : "Vilket ord passar i meningen?",
          text: mode === "double" ? question.prompt : undefined,
          options: question.options!,
          answer: question.answer,
          explanation: question.explanation,
          trickyWord: {
            id: question.id,
            word: question.answer,
            exercise: "stavning",
            mode,
            prompt: question.prompt,
            answer: question.answer,
            options: question.options,
            explanation: question.explanation,
            description: question.description,
          },
        }),
      ),
  ),

  ...(["choice", "missing"] as const).map((mode) =>
    sentenceQuestions[mode]
      .filter((question) => question.options?.length)
      .map(
        (question): SpeedQuestion => ({
          key: `sentence:${question.id}`,
          category: mode === "choice" ? "Välj rätt mening" : "Ordet som saknas",
          prompt: mode === "choice" ? question.prompt : "Vilket ord saknas?",
          text: mode === "missing" ? question.prompt : undefined,
          options: question.options!,
          answer: question.answer,
          explanation: question.explanation,
          trickyWord: {
            id: question.id,
            word: question.answer,
            exercise: "meningsbyggnad",
            mode,
            prompt: question.prompt,
            answer: question.answer,
            options: question.options,
            explanation: question.explanation,
          },
        }),
      ),
  ),

  situations.map((question) => ({
    key: `situation:${question.id}`,
    category: "Vad säger du?",
    prompt: "Vad säger du?",
    context: question.context,
    speech: question.speech,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
    trickyWord: {
      id: question.id,
      word: question.title,
      exercise: "grunder",
      mode: "situations",
      prompt: question.context,
      answer: question.answer,
      options: question.options,
      explanation: question.explanation,
      grunderId: question.id,
    },
  })),

  positions.map((question) => ({
    key: `position:${question.id}`,
    category: "Lägesord",
    prompt: question.prompt,
    position: question.position,
    options: question.options,
    answer: question.answer,
    explanation: question.explanation,
    trickyWord: {
      id: question.id,
      word: question.answer,
      exercise: "grunder",
      mode: "positions",
      prompt: question.prompt,
      answer: question.answer,
      options: question.options,
      explanation: question.explanation,
      grunderId: question.id,
    },
  })),
];

/**
 * Each block contains one question from every category.
 * Smaller banks are reshuffled when they run out.
 * Answer options are also shuffled.
 */
function createRoundQuestions(): SpeedQuestion[] {
  const groups = questionGroups
    .filter((group) => group.length > 0)
    .map((group) => shuffle(group));

  const blockCount = Math.max(0, ...groups.map((group) => group.length));
  const result: SpeedQuestion[] = [];

  for (let block = 0; block < blockCount; block++) {
    const nextBlock = groups.map((group, groupIndex) => {
      if (block > 0 && block % group.length === 0) {
        groups[groupIndex] = shuffle(group);
      }

      const currentGroup = groups[groupIndex];
      const question = currentGroup[block % currentGroup.length];

      return {
        ...question,
        options: shuffle(question.options),
      };
    });

    result.push(...shuffle(nextBlock));
  }

  return result;
}

export default function SnabbsparetPage() {
  const [questions, setQuestions] = useState<SpeedQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const deadlineRef = useRef<number | null>(null);
  const answerLockedRef = useRef(false);

  const question = questions[questionIndex];
  const answered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question?.answer;

  function resetRound() {
    deadlineRef.current = null;
    answerLockedRef.current = false;
    setQuestions([]);
    setQuestionIndex(0);
    setAnsweredCount(0);
    setScore(0);
    setSecondsLeft(ROUND_SECONDS);
    setSelectedAnswer(null);
    setStarted(false);
    setFinished(false);
  }

  useEffect(() => {
    window.addEventListener("exercise:leave", resetRound);
    window.addEventListener("popstate", resetRound);

    return () => {
      window.removeEventListener("exercise:leave", resetRound);
      window.removeEventListener("popstate", resetRound);
    };
  }, []);

  function startRound() {
    const nextQuestions = createRoundQuestions();

    if (nextQuestions.length === 0) return;

    deadlineRef.current = Date.now() + ROUND_SECONDS * 1000;
    answerLockedRef.current = false;

    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setAnsweredCount(0);
    setScore(0);
    setSecondsLeft(ROUND_SECONDS);
    setSelectedAnswer(null);
    setFinished(false);
    setStarted(true);
  }

  useEffect(() => {
    if (!started || finished) return;

    function updateTimer() {
      if (deadlineRef.current === null) return;

      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      );

      setSecondsLeft(remaining);

      if (remaining === 0) {
        answerLockedRef.current = true;
        setFinished(true);
      }
    }

    const timer = window.setInterval(updateTimer, 100);

    return () => window.clearInterval(timer);
  }, [started, finished]);

  function handleAnswer(answer: string) {
    if (
      !started ||
      finished ||
      secondsLeft <= 0 ||
      answerLockedRef.current ||
      !question
    ) {
      return;
    }

    answerLockedRef.current = true;

    const correct = answer === question.answer;

    setSelectedAnswer(answer);
    setAnsweredCount((current) => current + 1);

    if (correct) {
      setScore((current) => current + 1);
    } else {
      saveTrickyWord(question.trickyWord);
    }

    recordAnswer(correct);
  }

  function nextQuestion() {
    if (!started || !answered || finished || secondsLeft <= 0) {
      return;
    }

    if (questionIndex + 1 >= questions.length) {
      setQuestions(createRoundQuestions());
      setQuestionIndex(0);
    } else {
      setQuestionIndex((current) => current + 1);
    }

    setSelectedAnswer(null);
    answerLockedRef.current = false;
  }
  
  const accuracy =
    answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f3f7f9] px-4 py-6 text-[#173f45] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <section className="rounded-3xl border border-white bg-white p-5 shadow-sm sm:p-9">
          {!started && !finished && (
            <div className="py-6 text-center">
              <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center sm:h-48 sm:w-48 md:h-56 md:w-56">
                <Image
                  src="/images/snabbsparet-icon.png"
                  alt=""
                  width={460}
                  height={460}
                  priority
                  className="h-full w-full object-contain"
                  sizes="(max-width: 639px) 144px, (max-width: 767px) 192px, 224px"
                />
              </div>

              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#398577]">
                Dags för en utmaning!
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Snabbspåret
              </h1>

              <p className="mx-auto mt-4 max-w-lg leading-7 text-[#496c72]">
                Hur många frågor klarar du på 60 sekunder? Öva på en och ett,
                stavning, meningar, vardagssamtal och lägesord.
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

              <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-[#648083]">
                Frågor du svarar fel på sparas i Mina kluriga ord, så att du kan
                öva på dem i lugn och ro.
              </p>
            </div>
          )}

          {started && !finished && question && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
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
                  role="timer"
                  aria-label={`${secondsLeft} sekunder kvar`}
                >
                  <Clock3 size={20} aria-hidden="true" />
                  <span className="text-2xl tabular-nums">{secondsLeft}s</span>
                </div>
              </div>

              <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#e7eeee]">
                <div
                  className={`h-full rounded-full transition-all ${
                    secondsLeft <= 10 ? "bg-[#d98668]" : "bg-[#58a995]"
                  }`}
                  style={{
                    width: `${(secondsLeft / ROUND_SECONDS) * 100}%`,
                  }}
                />
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#edf6f1] px-3 py-1.5 text-xs font-extrabold text-[#17665d]">
                  {question.category}
                </span>

                <p className="text-sm font-semibold text-[#648083]">
                  Fråga {answeredCount + (answered ? 0 : 1)}
                </p>
              </div>

              <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">
                {question.prompt}
              </h2>

              {question.context && (
                <p className="mt-4 text-sm leading-7 text-[#496c72] sm:text-base">
                  {question.context}
                </p>
              )}

              {question.speech && (
                <div className="mt-4 rounded-2xl border border-[#d7e8df] bg-[#f0f6f4] px-5 py-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#648083]">
                    Personen säger
                  </p>
                  <p className="text-lg font-extrabold leading-relaxed">
                    ”{question.speech}”
                  </p>
                </div>
              )}

              {question.position && (
                <div className="mt-5">
                  <PositionPicture position={question.position} />
                </div>
              )}

              {question.text && (
                <div className="mt-5 rounded-2xl bg-[#f0f6f4] px-5 py-7 text-center sm:py-9">
                  <p className="break-words text-2xl font-extrabold leading-relaxed sm:text-3xl">
                    {question.text}
                  </p>
                </div>
              )}

              <div
                className={`mt-6 grid gap-3 ${
                  question.category === "En eller ett?"
                    ? "grid-cols-2"
                    : question.category === "Vad säger du?" ||
                        question.category === "Välj rätt mening"
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {question.options.map((option) => {
                  const chosen = selectedAnswer === option;
                  const correctChoice = question.answer === option;

                  let buttonStyle =
                    "border-[#d7e5e3] bg-white hover:border-[#58a995] hover:bg-[#f5faf8]";

                  if (answered && correctChoice) {
                    buttonStyle =
                      "border-[#58a995] bg-[#e5f5ec] text-[#17665d]";
                  } else if (chosen && !isCorrect) {
                    buttonStyle =
                      "border-[#e7a18d] bg-[#fff0e9] text-[#a94732]";
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={answered}
                      onClick={() => handleAnswer(option)}
                      className={`flex min-h-16 items-center justify-center gap-2 rounded-2xl border-2 px-4 py-4 font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d] disabled:cursor-default ${
                        question.category === "En eller ett?"
                          ? "text-2xl"
                          : "text-base leading-6 sm:text-lg"
                      } ${buttonStyle}`}
                    >
                      <span className="min-w-0 break-words">{option}</span>

                      {answered && correctChoice && (
                        <CheckCircle2
                          className="shrink-0"
                          size={20}
                          aria-hidden="true"
                        />
                      )}

                      {chosen && !isCorrect && (
                        <XCircle
                          className="shrink-0"
                          size={20}
                          aria-hidden="true"
                        />
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

                  {!isCorrect && (
                    <p className="mt-2 text-sm font-bold leading-6">
                      Rätt svar: {question.answer}
                    </p>
                  )}

                  <p className="mt-1 text-sm leading-6">
                    {question.explanation}
                  </p>

                  {!isCorrect && (
                    <p className="mt-3 border-t border-[#e7a18d]/40 pt-3 text-xs font-semibold leading-5">
                      Frågan sparas i Mina kluriga ord för mer övning.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={!answered}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Nästa fråga
                  <ArrowRight size={18} />
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

              <p className="mt-4 text-[#496c72]">Du fick</p>

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
                {answeredCount === 0
                  ? "Redo för ett nytt försök? Välj ett svar och tryck sedan på Nästa fråga."
                  : score === answeredCount
                    ? "Fantastiskt! Du svarade rätt på alla frågor!"
                    : accuracy >= 50
                      ? "Riktigt bra jobbat! Fortsätt öva så blir du ännu säkrare."
                      : "Varje fråga är en chans att lära sig något nytt. Försök gärna igen!"}
              </p>

              {answeredCount > score && (
                <Link
                  href="/exercises/kluriga-ord"
                  onClick={resetRound}
                  className="mt-5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#17665d] underline decoration-[#b8d5c9] underline-offset-4"
                >
                  Öva på Mina kluriga ord
                  <ArrowRight size={16} />
                </Link>
              )}

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={startRound}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#17665d] px-6 py-3 font-bold text-white transition hover:bg-[#124e48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17665d]"
                >
                  <RotateCcw size={18} />
                  Spela igen
                </button>

                <Link
                  href="/"
                  onClick={resetRound}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d7e5e3] px-6 py-3 font-bold text-[#315d61] transition hover:bg-[#f0f6f4]"
                >
                  <ArrowLeft size={18} />
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
