"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleHelp,
  RotateCcw,
  BookOpen,
  SpellCheck,
  X,
  Star,
} from "lucide-react";

import { getCurrentStreak, recordAnswer } from "@/app/lib/progress";
import {
  saveTrickyWord,
  removeTrickyWord,
  getTrickyWords,
  TRICKY_WORDS_EVENT,
} from "@/app/lib/trickyWords";

import {
  questions,
  validateFillQuestions,
  type Mode,
  type Question,
} from "@/app/data/stavningsjakten";

if (process.env.NODE_ENV === "development") {
  validateFillQuestions();
}

const modes: {
  id: Mode;
  title: string;
  description: string;
  image: string;
  color: string;
  theme: {
    text: string;
    accent: string;
    accentHover: string;
    soft: string;
    border: string;
    input: string;
    inputFocus: string;
    progressTrack: string;
    progress: string;
    badgeText: string;
    optionBorder: string;
    optionHover: string;
  };
}[] = [
  {
    id: "choice",
    title: "Rätt stavning",
    description: "Välj ordet som är rätt stavat.",
    image: "/images/stavning-ratt-stavning-icon.png",
    color: "border-[#FCD8CD] bg-[#FEEBF6]",
    theme: {
      text: "text-[#9C536C]",
      accent: "bg-[#D985A2]",
      accentHover: "hover:bg-[#C76F8D]",
      soft: "bg-[#FCE4ED]",
      border: "border-[#F3BFD0]",
      input: "border-[#F3BFD0] bg-[#FFF7FA]",
      inputFocus: "focus:border-[#D985A2] focus:ring-[#D985A2]/20",
      progressTrack: "bg-[#F9DCE6]",
      progress: "bg-[#D985A2]",
      badgeText: "text-[#9C536C]",
      optionBorder: "border-[#F3BFD0]",
      optionHover: "hover:border-[#D985A2] hover:bg-[#FFF7FA]",
    },
  },
  {
    id: "fill",
    title: "Fyll i bokstäverna",
    description: "Skriv ordet och träna på hur det stavas.",
    image: "/images/stavning-fill-the-gap-icon.png",
    color: "border-[#FFE2E2] bg-[#FBEFEF]",
    theme: {
      text: "text-[#A65353]",
      accent: "bg-[#D98282]",
      accentHover: "hover:bg-[#C56D6D]",
      soft: "bg-[#FBE3E3]",
      border: "border-[#F0C1C1]",
      input: "border-[#F0C1C1] bg-[#FFF8F8]",
      inputFocus: "focus:border-[#D98282] focus:ring-[#D98282]/20",
      progressTrack: "bg-[#F8DEDE]",
      progress: "bg-[#D98282]",
      badgeText: "text-[#A65353]",
      optionBorder: "border-[#F0C1C1]",
      optionHover: "hover:border-[#D98282] hover:bg-[#FFF8F8]",
    },
  },
  {
    id: "double",
    title: "En eller två?",
    description: "Öva på dubbelteckning och ord som liknar varandra.",
    image: "/images/stavning-dubbel-konsonant-icon.png",
    color:
      "border-[#DED5F5] bg-gradient-to-br from-[#F5F1FD] via-[#F5F3FC] to-[#E9F1F4]",
    theme: {
      text: "text-[#65518F]",
      accent: "bg-[#9180C9]",
      accentHover: "hover:bg-[#7D6BB7]",
      soft: "bg-[#F0EBFA]",
      border: "border-[#DED5F5]",
      input: "border-[#DED5F5] bg-[#FAF8FF]",
      inputFocus: "focus:border-[#9180C9] focus:ring-[#9180C9]/20",
      progressTrack: "bg-[#E7E0F6]",
      progress: "bg-[#9180C9]",
      badgeText: "text-[#65518F]",
      optionBorder: "border-[#DED5F5]",
      optionHover: "hover:border-[#9180C9] hover:bg-[#FAF8FF]",
    },
  },
];

function shuffleQuestions(items: Question[]) {
  const shuffled = [...items];

  // Shuffle the questions randomly using Fisher–Yates
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Return only 10 random questions
  return shuffled.slice(0, 10);
}

function WordPuzzle({
  prompt,
  description,
}: {
  prompt: string;
  description?: string;
}) {
  const letters = Array.from(prompt);

  return (
    <div className="mx-auto mt-6 max-w-xl rounded-[26px] border border-[#F0C1C1] bg-gradient-to-br from-[#FFF7F7] via-[#FBEDEE] to-[#F8E5E9] p-4 shadow-[0_12px_30px_rgba(174,92,107,0.12)] sm:p-6">
      <div className="mb-4 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#A65353]">
        <SpellCheck size={17} />
        Vilka bokstäver saknas?
      </div>

      <div className="rounded-[20px] border border-[#F2D4D4] bg-white/90 px-3 py-6 shadow-sm sm:px-5 sm:py-8">
        {/* Letter tiles - always stay on one row */}
        <div
          className="mx-auto flex w-full flex-nowrap items-center justify-center gap-1 sm:gap-2"
          aria-label={prompt.replaceAll("_", "saknad bokstav ")}
        >
          {letters.map((letter, i) => {
            const missing = letter === "_";

            return (
              <span
                key={i}
                aria-hidden="true"
                className={`flex aspect-square min-w-0 flex-1 items-center justify-center rounded-lg border-2 text-[clamp(0.65rem,2.5vw,1.5rem)] font-extrabold shadow-sm transition sm:rounded-xl ${
                  missing
                    ? "border-[#D98292] bg-[#FBE2E5] text-[#A65353] shadow-[inset_0_2px_5px_rgba(174,92,107,0.08)]"
                    : "border-[#F3D4D4] bg-[#FFF5F5] text-[#854D5D]"
                }`}
                style={{
                  maxWidth: "3.5rem",
                }}
              >
                {missing ? (
                  <span className="h-0.5 w-1/3 rounded-full bg-[#C57B8A]" />
                ) : (
                  letter
                )}
              </span>
            );
          })}
        </div>

        {/* Word description */}
        {description && (
          <p className="mx-auto mt-6 max-w-sm text-center text-sm leading-relaxed text-[#795D67] sm:text-base">
            {description}
          </p>
        )}
      </div>

      <p className="mt-4 text-center text-xs font-semibold text-[#A65353]">
        Skriv hela ordet i rutan nedanför.
      </p>
    </div>
  );
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
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const current = round[index];
  const total = round.length;

  const activeMode = modes.find((item) => item.id === mode);
  const theme = activeMode?.theme;

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
        exercise: "stavning",
        mode: current.type,
        prompt: current.prompt,
        description: current.description,
        answer: current.answer,
        options: current.options,
        explanation: current.explanation,
      });
    }

    recordAnswer(isCorrect);
  }

  function toggleTrickyWord() {
    if (!current) return;

    const isSaved = savedWords.includes(current.id);

    if (isSaved) {
      removeTrickyWord(current.id, "stavning");
    } else {
      saveTrickyWord({
        id: current.id,
        word: current.answer.trim(),
        exercise: "stavning",
        mode: current.type,
        prompt: current.prompt,
        description: current.description,
        answer: current.answer,
        options: current.options,
        explanation: current.explanation,
      });
    }
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

  useEffect(() => {
    const handleLeave = () => {
      setMode(null);
      setRound([]);
      setIndex(0);
      setAnswer("");
      setFeedback(null);
      setScore(0);
      setFinished(false);
    };

    window.addEventListener("exercise:leave", handleLeave);

    return () => {
      window.removeEventListener("exercise:leave", handleLeave);
    };
  }, []);

  useEffect(() => {
    function updateSavedWords() {
      const saved = getTrickyWords()
        .filter((word) => word.exercise === "stavning")
        .map((word) => word.id);

      setSavedWords(saved);
    }

    updateSavedWords();

    window.addEventListener(TRICKY_WORDS_EVENT, updateSavedWords);
    window.addEventListener("storage", updateSavedWords);

    return () => {
      window.removeEventListener(TRICKY_WORDS_EVENT, updateSavedWords);
      window.removeEventListener("storage", updateSavedWords);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_8%_20%,rgba(224,239,244,0.38),transparent_38%),#f3f7f9] text-[#153e43]">
      <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        {/* Introduction */}
        <section className="mt-5 overflow-hidden rounded-[26px] border border-[#DED5F5] bg-gradient-to-br from-[#F5F1FD] via-[#F5F3FC] to-[#E9F1F4] p-6 sm:p-9">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#65518F]">
            <BookOpen size={15} />
            Grammatik · Grundnivå
          </div>

          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-7 sm:text-left">
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

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#183F47] sm:text-4xl">
                Stavning
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#54727B] sm:text-base">
                Upptäck stavningsmönster, klura på bokstäver och lär dig ett ord
                i taget. Du får feedback efter varje fråga.
              </p>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-wrap gap-3 text-sm font-medium text-[#65518F]">
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-2">
              ....
            </span>
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-2">
              Direkt feedback
            </span>
            <span className="rounded-full border border-white/80 bg-white/65 px-3 py-2">
              Förklaringar ingår
            </span>
          </div>
        </section>

        {/* Exercise menu */}
        {!mode && (
          <section className="py-8">
            <div className="rounded-3xl border border-[#e1e9eb] bg-white p-5 shadow-[0_12px_40px_rgba(30,70,75,0.05)] sm:p-8">
              <div className="mb-5">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#183F47]">
                  Vad vill du träna på?
                </h2>
                <p className="mt-2 text-sm text-[#54727B]">
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
                      <span className="grid h-24 w-24 place-items-center rounded-2xl text-3xl">
                        <Image
                          src={item.image}
                          alt=""
                          width={160}
                          height={160}
                          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                      </span>

                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full border border-white/80 bg-white/50 transition group-hover:translate-x-1 ${item.theme.badgeText}`}
                      >
                        <ChevronRight size={18} />
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-extrabold text-[#183F47]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-[#54727B]">
                      {item.description}
                    </p>

                    <span
                      className={`mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold ${item.theme.text}`}
                    >
                      Börja öva <ArrowRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Active exercise */}
        {mode && current && !finished && (
          <section
            className={`mx-auto mt-8 max-w-3xl rounded-[24px] border bg-white/90 p-5 shadow-sm shadow-[#254b4d]/5 sm:p-8 ${
              theme?.border ?? "border-[#dce9e6]"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={backToMenu}
                className={`inline-flex items-center gap-2 text-sm font-bold text-[#54727B] transition ${
                  theme?.badgeText ?? "text-[#65518F]"
                }`}
              >
                <ArrowLeft size={16} />
                Alla övningar
              </button>

              <div className="flex items-end">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                    theme?.soft ?? "bg-[#f0ebfa]"
                  } ${theme?.badgeText ?? "text-[#65518F]"}`}
                >
                  <span>{activeMode?.title}</span>
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-sm font-bold text-[#54727B]">
              <span>
                Fråga {index + 1} av {total}
              </span>
              <span>{score} rätt</span>
            </div>

            {/* Progress bar */}
            <div
              role="progressbar"
              aria-label="Framsteg i övningen"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`mt-3 h-2 overflow-hidden rounded-full ${
                theme?.progressTrack ?? "bg-[#e7efec]"
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  theme?.progress ?? "bg-[#70b39a]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="py-8 text-center sm:py-10">
              {/* Question icon */}
              {/* <div
                className={`mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl ${
                  theme?.soft ?? "bg-[#f0ebfa]"
                } ${theme?.badgeText ?? "text-[#65518F]"}`}
              >
                {mode === "fill" ? (
                  <SpellCheck size={25} />
                ) : (
                  <CircleHelp size={25} />
                )}
              </div> */}

              {mode === "fill" ? (
                <WordPuzzle
                  prompt={current.prompt}
                  description={current.description}
                />
              ) : (
                <h2 className="text-xl font-extrabold leading-relaxed text-[#183F47] sm:text-2xl">
                  {current.prompt}
                </h2>
              )}

              {/* Fill in the word */}
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
                    className={`min-h-14 w-full rounded-2xl border px-4 text-center text-lg font-bold text-[#183F47] outline-none transition placeholder:text-sm placeholder:font-medium focus:ring-2 disabled:opacity-70 ${
                      theme?.input ?? "border-[#d6e4e1] bg-[#f8fbfa]"
                    } ${
                      theme?.inputFocus ??
                      "focus:border-[#70b39a] focus:ring-[#70b39a]/20"
                    }`}
                  />

                  {!feedback && (
                    <button
                      type="submit"
                      disabled={!answer.trim()}
                      className={`mt-4 min-h-12 w-full rounded-full px-5 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                        theme?.accent ?? "bg-[#155d56]"
                      } ${theme?.accentHover ?? "hover:bg-[#104c47]"}`}
                    >
                      Kontrollera svaret
                    </button>
                  )}
                </form>
              ) : (
                /* Multiple-choice exercises */
                <div className="mx-auto mt-7 grid max-w-md gap-3 sm:grid-cols-2">
                  {current.options?.map((option) => {
                    const isSelected = answer === option;
                    const isRight = option === current.answer;

                    let optionStyle = `${
                      theme?.optionBorder ?? "border-[#dce9e6]"
                    } bg-white text-[#244B50]`;

                    if (feedback && isRight) {
                      optionStyle =
                        "border-[#8bc4a5] bg-[#e8f6ec] text-[#236641]";
                    } else if (feedback && isSelected && !isRight) {
                      optionStyle =
                        "border-[#e8a6a0] bg-[#fff0ee] text-[#a23c35]";
                    } else if (!feedback) {
                      optionStyle += ` ${
                        theme?.optionHover ??
                        "hover:border-[#9fc9b9] hover:bg-[#f4faf7]"
                      }`;
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

            {/* Answer feedback */}
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

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="font-extrabold text-[#183F47]">
                        {feedback === "correct" ? "Helt rätt!" : "Bra försök!"}
                      </h3>

                      {feedback === "correct" && (
                        <button
                          type="button"
                          onClick={toggleTrickyWord}
                          aria-pressed={savedWords.includes(current.id)}
                          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-[#cbdedd] bg-white/80 px-4 py-2 text-sm font-bold text-[#285b5b] transition hover:bg-white sm:ml-4"
                        >
                          <Star
                            size={16}
                            className={
                              savedWords.includes(current.id)
                                ? "fill-current"
                                : ""
                            }
                          />
                          {savedWords.includes(current.id)
                            ? "Sparat – ta bort"
                            : "Spara som klurigt ord"}
                        </button>
                      )}
                    </div>

                    {feedback === "wrong" && (
                      <p className="mt-1 text-sm text-[#28545C]">
                        Rätt svar är{" "}
                        <strong className="font-extrabold">
                          {current.answer}
                        </strong>
                        .
                      </p>
                    )}

                    <p className="mt-2 text-sm leading-relaxed text-[#42676A]">
                      {current.explanation}
                    </p>

                    {feedback === "wrong" && (
                      <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#8b5a43]">
                        <Star size={14} />
                        Ordet har sparats automatiskt under Mina kluriga ord.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextQuestion}
                  className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 font-bold text-white transition sm:w-auto ${
                    theme?.accent ?? "bg-[#155d56]"
                  } ${theme?.accentHover ?? "hover:bg-[#104c47]"}`}
                >
                  {index + 1 === total ? "Se resultatet" : "Nästa fråga"}
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* Results */}
        {mode && finished && (
          <section
            className={`mx-auto mt-8 max-w-2xl rounded-[24px] border bg-white/90 p-6 text-center shadow-sm sm:p-10 ${
              theme?.border ?? "border-[#dce9e6]"
            }`}
          >
            <div
              className={`mx-auto grid h-20 w-20 place-items-center rounded-[26px] text-4xl ${
                theme?.soft ?? "bg-[#e8f4ef]"
              }`}
            >
              {score >= total * 0.8 ? "🎉" : "🌱"}
            </div>

            <p
              className={`mt-5 text-xs font-extrabold tracking-[0.15em] ${
                theme?.badgeText ?? "text-[#17665d]"
              }`}
            >
              ÖVNING KLAR
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#183F47]">
              {score >= total * 0.8 ? "Snyggt jobbat!" : "Bra kämpat!"}
            </h2>

            <p className="mt-3 text-[#54727B]">
              Varje övning hjälper dig att bli säkrare på svenska.
            </p>

            <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-[#f3f7f9] p-6">
              <p className="text-sm font-bold text-[#54727B]">Ditt resultat</p>

              <p className="mt-2 text-5xl font-extrabold text-[#183F47]">
                {score}
                <span className="text-2xl text-[#7a9697]"> / {total}</span>
              </p>

              <p
                className={`mt-2 text-sm font-bold ${
                  theme?.badgeText ?? "text-[#17665d]"
                }`}
              >
                {Math.round((score / total) * 100)} % rätt
              </p>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => startMode(mode)}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-bold text-white transition ${
                  theme?.accent ?? "bg-[#155d56]"
                } ${theme?.accentHover ?? "hover:bg-[#104c47]"}`}
              >
                <RotateCcw size={17} />
                Försök igen
              </button>

              <button
                type="button"
                onClick={backToMenu}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border bg-white px-6 font-bold transition hover:bg-gray-50 ${
                  theme?.border ?? "border-[#c9dcd7]"
                } ${theme?.badgeText ?? "text-[#24545b]"}`}
              >
                Välj en annan övning
                <ChevronRight size={17} />
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
