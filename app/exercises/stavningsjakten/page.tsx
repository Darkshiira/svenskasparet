"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  SpellCheck,
  X,
} from "lucide-react";

import { getCurrentStreak, recordAnswer } from "@/app/lib/progress";
import { saveTrickyWord } from "@/app/lib/trickyWords";

import {
  questions,
  type Mode,
  type Question,
} from "@/app/data/stavningsjakten";

const modes: {
  id: Mode;
  title: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    id: "choice",
    title: "Rätt stavning",
    description: "Välj ordet som är rätt stavat.",
    icon: "🔎",
    color: "border-[#ded5f5] bg-gradient-to-br from-[#f5f1fd] via-[#f5f3fc] to-[#e9f1f4]",
  },
  {
    id: "fill",
    title: "Fyll i bokstäverna",
    description: "Skriv ordet och träna på hur det stavas.",
    icon: "✏️",
    color: "border-[#ded5f5] bg-gradient-to-br from-[#f5f1fd] via-[#f5f3fc] to-[#e9f1f4]",
  },
  {
    id: "double",
    title: "En eller två?",
    description: "Öva på dubbelteckning och ord som liknar varandra.",
    icon: "🔤",
    color: "border-[#ded5f5] bg-gradient-to-br from-[#f5f1fd] via-[#f5f3fc] to-[#e9f1f4]",
  },
];

function shuffleQuestions(items: Question[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export default function StavningsjaktenPage() {
  function subscribeToProgress(callback: () => void) {
    window.addEventListener("svenskasparet-progress-updated", callback);
    window.addEventListener("storage", callback);

    return () => {
      window.removeEventListener("svenskasparet-progress-updated", callback);
      window.removeEventListener("storage", callback);
    };
  }

  const streak = useSyncExternalStore(
    subscribeToProgress,
    getCurrentStreak,
    () => 0,
  );

  const [mode, setMode] = useState<Mode | null>(null);
  const [round, setRound] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = round[index];
  const total = round.length;
  const progress =
    total > 0 ? (finished ? 100 : ((index + 1) / total) * 100) : 0;

  function startMode(selectedMode: Mode) {
    setMode(selectedMode);
    setRound(shuffleQuestions(questions[selectedMode]));
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  }

  function submitAnswer(value: string) {
    if (!current || feedback) return;

    const normalizedAnswer = value.trim().toLocaleLowerCase("sv-SE");
    const normalizedCorrect = current.answer.trim().toLocaleLowerCase("sv-SE");
    const isCorrect = normalizedAnswer === normalizedCorrect;

    setAnswer(value);
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      setScore((previous) => previous + 1);
    } else {
      saveTrickyWord({
        id: current.id,
        word: current.answer.trim(),
        exercise: "stavningsjakten",
        mode: current.type,
        prompt: current.prompt,
        answer: current.answer,
        options: current.options,
        explanation: current.explanation,
      });
    }

    recordAnswer(isCorrect);
  }

  function nextQuestion() {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }

    setIndex((previous) => previous + 1);
    setAnswer("");
    setFeedback(null);
  }

  function backToMenu() {
    setMode(null);
    setRound([]);
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_8%_20%,rgba(224,239,244,0.38),transparent_38%),#f3f7f9] text-[#153e43]">
      <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        <Link
          href="/#ovningar"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-[#17665d] transition hover:bg-white/70"
        >
          <ArrowLeft size={17} />
          Tillbaka till övningarna
        </Link>

        <section className="mt-5 overflow-hidden rounded-[26px] border border-[#ded5f5] bg-gradient-to-br from-[#f5f1fd] via-[#f5f3fc] to-[#e9f1f4] p-6 sm:p-9">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left">
            {/* Icon */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center sm:h-36 sm:w-36 md:h-40 md:w-40">
              <Image
                src="/images/stavning-icon.png"
                alt="Stavningsjakten"
                width={460}
                height={460}
                priority
                className="h-full w-full object-contain"
                sizes="(max-width: 639px) 112px, (max-width: 767px) 144px, 160px"
              />
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-xs font-extrabold tracking-[0.15em] text-[#65518f]">
                TRÄNA SVENSKA
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-[#183f47] sm:text-4xl">
                Stavning
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#54727b] sm:text-base">
                Upptäck stavningsmönster, klura på bokstäver och lär dig ett ord
                i taget. Du får feedback efter varje fråga.
              </p>
            </div>
          </div>
        </section>

        {!mode && (
          <section className="py-8">
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-[#183f47]">
                Vad vill du träna på?
              </h2>
              <p className="mt-2 text-sm text-[#54727b]">
                Välj en övning för att komma igång.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {modes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => startMode(item.id)}
                  className={`group flex min-h-56 flex-col rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2a494f]/10 sm:p-6 ${item.color}`}
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/80 text-3xl">
                      {item.icon}
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-white/80 bg-white/50 text-[#65518f] transition group-hover:translate-x-1">
                      <ChevronRight size={18} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-[#183f47]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#54727b]">
                    {item.description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-[#17665d]">
                    Börja öva <ArrowRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {mode && current && !finished && (
          <section className="mx-auto mt-8 max-w-3xl rounded-[24px] border border-[#dce9e6] bg-white/90 p-5 shadow-sm shadow-[#254b4d]/5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={backToMenu}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#54727b] transition hover:text-[#17665d]"
              >
                <ArrowLeft size={16} /> Alla övningar
              </button>
              <span className="rounded-full bg-[#f0ebfa] px-3 py-1.5 text-xs font-extrabold text-[#65518f]">
                {modes.find((item) => item.id === mode)?.title}
              </span>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm font-bold text-[#54727b]">
              <span>
                Fråga {index + 1} av {total}
              </span>
              <span>{score} rätt</span>
            </div>
            <div
              role="progressbar"
              aria-label="Framsteg i övningen"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7efec]"
            >
              <div
                className="h-full rounded-full bg-[#70b39a] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="py-8 text-center sm:py-10">
              <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#f0ebfa] text-[#65518f]">
                {mode === "fill" ? (
                  <SpellCheck size={25} />
                ) : (
                  <CircleHelp size={25} />
                )}
              </div>
              <h2 className="text-xl font-extrabold leading-relaxed text-[#183f47] sm:text-2xl">
                {current.prompt}
              </h2>

              {mode === "fill" ? (
                <form
                  className="mx-auto mt-6 max-w-sm"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitAnswer(answer);
                  }}
                >
                  <label htmlFor="spelling-answer" className="sr-only">
                    Skriv hela det rätt stavade ordet
                  </label>
                  <input
                    id="spelling-answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    disabled={feedback !== null}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="Skriv hela ordet..."
                    className="min-h-14 w-full rounded-2xl border border-[#d6e4e1] bg-[#f8fbfa] px-4 text-center text-lg font-bold text-[#183f47] outline-none transition placeholder:text-sm placeholder:font-medium focus:border-[#70b39a] focus:ring-2 focus:ring-[#70b39a]/20 disabled:opacity-70"
                  />
                  {!feedback && (
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className="mt-4 min-h-12 w-full rounded-full bg-[#155d56] px-5 font-bold text-white transition hover:bg-[#104c47] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Kontrollera svaret
                    </button>
                  )}
                </form>
              ) : (
                <div className="mx-auto mt-7 grid max-w-md gap-3 sm:grid-cols-2">
                  {current.options?.map((option) => {
                    const isSelected = answer === option;
                    const isRight = option === current.answer;
                    let optionStyle =
                      "border-[#dce9e6] bg-white text-[#244b50] hover:border-[#9fc9b9] hover:bg-[#f4faf7]";

                    if (feedback && isRight) {
                      optionStyle =
                        "border-[#8bc4a5] bg-[#e8f6ec] text-[#236641]";
                    } else if (feedback && isSelected && !isRight) {
                      optionStyle =
                        "border-[#e8a6a0] bg-[#fff0ee] text-[#a23c35]";
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={feedback !== null}
                        onClick={() => submitAnswer(option)}
                        className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition disabled:cursor-default ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {feedback && isRight && <Check size={19} />}
                        {feedback && isSelected && !isRight && <X size={19} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {feedback && (
              <div
                aria-live="polite"
                className={`rounded-2xl border p-4 sm:p-5 ${
                  feedback === "correct"
                    ? "border-[#c8e7d1] bg-[#edf8f0]"
                    : "border-[#f0d2ca] bg-[#fff3ef]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                      feedback === "correct"
                        ? "bg-[#d4eedb] text-[#236641]"
                        : "bg-[#f8ddd5] text-[#a23c35]"
                    }`}
                  >
                    {feedback === "correct" ? (
                      <Check size={20} />
                    ) : (
                      <X size={20} />
                    )}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-[#183f47]">
                      {feedback === "correct" ? "Helt rätt!" : "Bra försök!"}
                    </h3>
                    {feedback === "wrong" && (
                      <p className="mt-1 text-sm text-[#28545c]">
                        Rätt svar är{" "}
                        <strong className="font-extrabold">
                          {current.answer}
                        </strong>
                        .
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-[#42676a]">
                      {current.explanation}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#155d56] px-5 font-bold text-white transition hover:bg-[#104c47] sm:w-auto"
                >
                  {index + 1 === total ? "Se resultatet" : "Nästa fråga"}
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </section>
        )}

        {mode && finished && (
          <section className="mx-auto mt-8 max-w-2xl rounded-[24px] border border-[#dce9e6] bg-white/90 p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-[#e8f4ef] text-4xl">
              {score >= total * 0.8 ? "🎉" : "🌱"}
            </div>
            <p className="mt-5 text-xs font-extrabold tracking-[0.15em] text-[#17665d]">
              ÖVNING KLAR
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#183f47]">
              {score >= total * 0.8 ? "Snyggt jobbat!" : "Bra kämpat!"}
            </h2>
            <p className="mt-3 text-[#54727b]">
              Varje övning hjälper dig att bli säkrare på svenska.
            </p>

            <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-[#f3f7f9] p-6">
              <p className="text-sm font-bold text-[#54727b]">Ditt resultat</p>
              <p className="mt-2 text-5xl font-extrabold text-[#183f47]">
                {score}
                <span className="text-2xl text-[#7a9697]"> / {total}</span>
              </p>
              <p className="mt-2 text-sm font-bold text-[#17665d]">
                {Math.round((score / total) * 100)} % rätt
              </p>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => startMode(mode)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#155d56] px-6 font-bold text-white transition hover:bg-[#104c47]"
              >
                <RotateCcw size={17} /> Försök igen
              </button>
              <button
                type="button"
                onClick={backToMenu}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#c9dcd7] bg-white px-6 font-bold text-[#24545b] transition hover:bg-[#f3f8f6]"
              >
                Välj en annan övning <ChevronRight size={17} />
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
