"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import ConversationBuilder from "@/app/components/grunder/ConversationBuilder";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  RotateCcw,
  Sprout,
  Star,
  Volume2,
  X,
} from "lucide-react";
import { recordAnswer } from "@/app/lib/progress";
import {
  recordCompletedRound,
  recordExerciseResult,
} from "@/app/lib/exerciseProgress";
import {
  saveTrickyWord,
  removeTrickyWord,
  getTrickyWords,
  TRICKY_WORDS_EVENT,
  type TrickyWord,
} from "@/app/lib/trickyWords";
import { toGrunderTrickyWord } from "@/app/lib/grunderTrickyWords";
import {
  useGrunderAudio,
  getGrunderAudioPath,
} from "@/app/hooks/useGrunderAudio";
import { PositionPicture } from "@/app/components/grunder/GrunderPictures";
import {
  vocabulary,
  situations,
  positions,
  type Mode,
  type Situation,
  type PositionQuestion,
  type Vocabulary,
} from "@/app/data/grunder";

// Save this file as app/exercises/grunder/page.tsx.
// Your shared Header/Footer remain in the existing layout.
// All pictures are inline vectors: no image files or extra packages needed.
// Answers, saved questions and completed rounds use the existing progress helpers.

type Round =
  | { mode: "situations"; data: Situation; choices: string[] }
  | { mode: "positions"; data: PositionQuestion; choices: string[] }
  | { mode: "listen"; data: Vocabulary; choices: Vocabulary[] };

const modes = [
  {
    id: "situations" as const,
    title: "Bygg ett samtal",
    description:
      "Se ett exempel. Lyssna och bygg ett kort samtal, ett svar i taget.",
    image: "/images/grunder-vad-sager-du-icon.png",
    tag: "Vardagssamtal",
    background: "bg-[#eff7f3]",
  },
  {
    id: "positions" as const,
    title: "Lägesord",
    description:
      "På, under eller bakom? Titta på bilden och välj rätt lägesord.",
    image: "/images/grunder-lagesord-icon.png",
    tag: "Titta & välj",
    background: "bg-[#e3f0e9]",
  },
  {
    id: "listen" as const,
    title: "Lyssna & hitta",
    description: "Lyssna på ett svenskt ord och välj bilden som passar.",
    image: "/images/grunder-lyssna-hitta-icon.png",
    tag: "Lyssna & välj",
    background: "bg-[#d7eade]",
  },
];
function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function makeRounds(mode: Mode): Round[] {
  if (mode === "situations")
    return shuffle(situations)
      .slice(0, 10)
      .map((data) => ({ mode, data, choices: shuffle(data.options) }));
  if (mode === "positions")
    return shuffle(positions)
      .slice(0, 10)
      .map((data) => ({ mode, data, choices: shuffle(data.options) }));
  return shuffle(vocabulary)
    .slice(0, 10)
    .map((data) => ({
      mode,
      data,
      choices: shuffle([
        data,
        ...shuffle(vocabulary.filter((item) => item.id !== data.id)).slice(
          0,
          3,
        ),
      ]),
    }));
}

const primary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#17695d] px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#115247] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17695d] disabled:cursor-not-allowed disabled:opacity-45";
const secondary =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#bedfd3] bg-white px-5 py-3 text-sm font-bold text-[#276b5b] hover:bg-[#edf6f0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17695d]";

function subscribeToSavedQuestions(onChange: () => void) {
  window.addEventListener(TRICKY_WORDS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(TRICKY_WORDS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
// A string snapshot stays stable between storage updates.
const savedQuestionsSnapshot = () => JSON.stringify(getTrickyWords());
const serverSavedQuestionsSnapshot = () => "[]";

export default function GrunderPage() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [heard, setHeard] = useState(false);
  const [autoSavedId, setAutoSavedId] = useState<string | null>(null);
  const savedSnapshot = useSyncExternalStore(
    subscribeToSavedQuestions,
    savedQuestionsSnapshot,
    serverSavedQuestionsSnapshot,
  );
  const savedQuestions: TrickyWord[] = JSON.parse(savedSnapshot);
  const answerLock = useRef(false);
  const roundCompleted = useRef(false);
  const sessionActive = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const audio = useGrunderAudio();
  const stopAudio = audio.stop;
  const current = rounds[index];
  const currentSavedQuestion = current ? toGrunderTrickyWord(current) : null;
  const isSaved =
    currentSavedQuestion !== null &&
    savedQuestions.some(
      (item) =>
        item.id === currentSavedQuestion.id && item.exercise === "grunder",
    );
  const selectedMode = modes.find((item) => item.id === mode);
  const expected =
    current?.mode === "listen" ? current.data.id : current?.data.answer;
  const correct = answer !== null && answer === expected;
  useEffect(() => {
    if (mode !== null) heading.current?.focus();
  }, [mode, index, finished]);

  useEffect(() => {
    function leaveExercise() {
      sessionActive.current = false;
      answerLock.current = true;
      stopAudio();
      setMode(null);
      setRounds([]);
      setIndex(0);
      setAnswer(null);
      setScore(0);
      setFinished(false);
      setHeard(false);
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
  }, [stopAudio]);

  function start(nextMode: Mode) {
    audio.stop();
    answerLock.current = false;
    roundCompleted.current = false;
    sessionActive.current = true;
    setMode(nextMode);
    setRounds(makeRounds(nextMode));
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setFinished(false);
    setHeard(false);
  }
  function menu() {
    audio.stop();
    sessionActive.current = false;
    answerLock.current = true;
    setMode(null);
    setRounds([]);
    setAnswer(null);
    setFinished(false);
    setHeard(false);
  }
  function choose(value: string) {
    if (
      !current ||
      !sessionActive.current ||
      answerLock.current ||
      (current.mode === "listen" && !heard)
    )
      return;
    answerLock.current = true;
    audio.stop();
    setAnswer(value);
    const isCorrect = value === expected;
    if (isCorrect) setScore((previous) => previous + 1);
    recordAnswer(isCorrect);
    const savedQuestion = toGrunderTrickyWord(current);
    if (isCorrect) {
      setAutoSavedId(null);
      removeTrickyWord(savedQuestion.id, "grunder");
    } else {
      saveTrickyWord(savedQuestion);
      setAutoSavedId(savedQuestion.id);
    }
    // The round is earned on the last submitted answer, even if the learner
    // leaves before opening the result screen. Never count an unfinished round.
    if (index === rounds.length - 1 && !roundCompleted.current) {
      roundCompleted.current = true;

      recordCompletedRound("grunder");

      // Include the answer just submitted.
      // setScore hasn't updated the score variable in this handler yet.
      const finalScore = score + (isCorrect ? 1 : 0);

      if (current.mode === "positions") {
        recordExerciseResult("grunder-lagesord", finalScore, rounds.length);
      } else if (current.mode === "listen") {
        recordExerciseResult("grunder-lyssna", finalScore, rounds.length);
      }
    }
  }
  function toggleSavedQuestion() {
    if (!sessionActive.current || answer === null || !currentSavedQuestion)
      return;
    setAutoSavedId(null);
    if (isSaved) removeTrickyWord(currentSavedQuestion.id, "grunder");
    else saveTrickyWord(currentSavedQuestion);
  }

  function next() {
    if (!sessionActive.current || answer === null || finished) return;
    audio.stop();
    if (index === rounds.length - 1) {
      setFinished(true);
      return;
    }
    answerLock.current = false;
    setAnswer(null);
    setHeard(false);
    setIndex((previous) => previous + 1);
  }
  function optionStyle(value: string) {
    return answer !== null && value === expected
      ? "border-[#70af8f] bg-[#e4f3e9]"
      : answer === value
        ? "border-[#dba899] bg-[#fff0e9]"
        : "border-[#d3e5da] bg-[#f6faf8] enabled:hover:border-[#499c82] enabled:hover:bg-[#edf6f0]";
  }

  return (
    <main
      lang="sv"
      className="min-h-screen bg-[#f3f7f8] px-4 py-8 text-[#183f47] sm:px-6 sm:py-12"
    >
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#ovningar"
          onClick={menu}
          className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#54727b] hover:text-[#17695d]"
        >
          <ArrowLeft size={17} /> Alla övningar
        </Link>
        {mode === null ? (
          <>
            <section className="rounded-[28px] border border-[#bedfd3] bg-gradient-to-br from-[#eef7f3] to-[#dceee6] p-6 sm:p-9">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#276b5b]">
                <Sprout size={15} /> Vardagssvenska · Nybörjare
              </span>
              <div className="my-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                <div className="relative hidden h-32 w-32 shrink-0 items-center justify-center sm:flex sm:h-40 sm:w-40 md:h-48 md:w-48">
                  <Image
                    src="/images/grunder-icon.png"
                    alt=""
                    width={192}
                    height={192}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Grunder & hälsningar
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#54727b] sm:text-base">
                    Möt svenskan i vardagen. Öva på små samtal, upptäck lägesord
                    och lär dig nya ord med bilder och ljud.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Korta övningar",
                  "Bilder som stöd",
                  "Träna i din egen takt",
                ].map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-white/90 px-4 py-3 text-xs font-bold text-[#276b5b]"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </section>
            <section className="mt-8 rounded-[28px] border border-[#dce7e9] bg-white p-5 sm:p-8">
              <h2 className="text-2xl font-extrabold">Vad vill du träna på?</h2>
              <p className="mt-2 text-sm leading-6 text-[#54727b]">
                Välj en övning. Du behöver inte skynda dig.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {modes.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => start(item.id)}
                    className={`relative rounded-[22px] border border-[#bedfd3] p-6 text-left transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17695d] ${item.background}`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-5 flex size-8 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronRight size={18} />
                    </span>
                    <span className="grid h-24 w-24 place-items-center rounded-2xl text-3xl">
                      <Image
                        src={item.image}
                        alt=""
                        width={160}
                        height={160}
                        className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                      />
                    </span>
                    <h3 className="text-lg font-extrabold">{item.title}</h3>
                    <p className="mt-2 min-h-20 text-sm leading-6 text-[#54727b]">
                      {item.description}
                    </p>
                    <span
                      className={`mt-auto inline-flex items-center gap-2 pt-5 text-sm font-extrabold text-[#183f47] `}
                    >
                      Börja öva <ArrowRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : mode === "situations" ? (
          <ConversationBuilder onBack={menu} />
        ) : (
          <section className="mx-auto max-w-3xl rounded-[28px] border border-[#bedfd3] bg-white p-5 sm:p-9">
            <button
              onClick={menu}
              className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#54727b]"
            >
              <ArrowLeft size={17} /> Byt övning
            </button>
            {finished ? (
              <div className="py-6 text-center">
                <Sprout
                  aria-hidden="true"
                  className="mx-auto text-[#499c82]"
                  size={62}
                />
                <h1
                  ref={heading}
                  tabIndex={-1}
                  className="mt-5 text-3xl font-extrabold outline-none"
                >
                  Bra jobbat!
                </h1>
                <p className="mt-4 text-lg font-bold">
                  Du fick {score} av {rounds.length} rätt.
                </p>
                <p className="mt-3 text-sm leading-6 text-[#54727b]">
                  Varje gång du tränar blir svenskan lite mer bekant.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button className={primary} onClick={() => start(mode)}>
                    <RotateCcw size={17} /> Träna igen
                  </button>
                  <button className={secondary} onClick={menu}>
                    Välj en annan övning
                  </button>
                </div>
              </div>
            ) : (
              current && (
                <>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-[#276b5b]">
                      {selectedMode?.title}
                    </span>
                    <span className="text-[#54727b]">
                      Fråga {index + 1} av {rounds.length}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label="Besvarade frågor"
                    aria-valuenow={index + (answer !== null ? 1 : 0)}
                    aria-valuemin={0}
                    aria-valuemax={rounds.length}
                    className="mb-7 mt-4 h-2 overflow-hidden rounded-full bg-[#e7f3ed]"
                  >
                    <div
                      className="h-full rounded-full bg-[#499c82] transition-all"
                      style={{
                        width: `${((index + (answer !== null ? 1 : 0)) / rounds.length) * 100}%`,
                      }}
                    />
                  </div>
                  <h1
                    ref={heading}
                    tabIndex={-1}
                    className="text-2xl font-extrabold leading-snug outline-none sm:text-3xl"
                  >
                    {current.mode === "situations"
                      ? current.data.title
                      : current.mode === "positions"
                        ? "Var är bollen?"
                        : "Lyssna och hitta rätt bild"}
                  </h1>
                  {current.mode === "situations" && (
                    <>
                      <p className="my-4 text-sm leading-7 text-[#54727b]">
                        {current.data.context}
                      </p>
                      <div className="relative my-5 rounded-2xl rounded-tl-sm bg-[#e7f3ed] p-5">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[#54727b]">
                          Personen säger
                        </span>
                        <p className="text-lg font-bold">
                          ”{current.data.speech}”
                        </p>
                      </div>
                      <p className="mb-3 text-sm font-bold">Vad säger du?</p>
                    </>
                  )}
                  {current.mode === "positions" && (
                    <>
                      <div className="my-5">
                        <PositionPicture position={current.data.position} />
                      </div>
                      <p className="mb-5 text-base font-bold">
                        {current.data.prompt}
                      </p>
                    </>
                  )}
                  {current.mode === "listen" ? (
                    <>
                      <p className="mt-3 text-sm leading-6 text-[#54727b]">
                        Tryck på högtalaren. Lyssna färdigt och välj bilden som
                        passar. Du kan lyssna flera gånger.
                      </p>
                      <div className="my-6 flex flex-wrap items-center justify-center gap-3 rounded-[22px] bg-[#edf6f0] p-6">
                        <button
                          className={primary}
                          disabled={audio.playing}
                          onClick={() =>
                            audio.play(
                              getGrunderAudioPath(current.data.id),
                              false,
                              () => setHeard(true),
                            )
                          }
                        >
                          <Volume2 size={22} />
                          {audio.playing ? "Spelar …" : "Lyssna på ordet"}
                        </button>
                        <button
                          className={secondary}
                          disabled={audio.playing}
                          onClick={() =>
                            audio.play(
                              getGrunderAudioPath(current.data.id),
                              true,
                              () => setHeard(true),
                            )
                          }
                        >
                          Lyssna långsamt
                        </button>
                      </div>
                      {audio.error && (
                        <p
                          role="alert"
                          className="mb-4 rounded-xl bg-[#fff0e9] p-4 text-sm leading-6"
                        >
                          {audio.error}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        {current.choices.map((item, i) => (
                          <button
                            key={item.id}
                            aria-label={`Bild ${i + 1}: ${item.word}`}
                            disabled={answer !== null || !heard}
                            onClick={() => choose(item.id)}
                            className={`relative flex min-h-36 flex-col items-center justify-center rounded-[22px] border-2 p-4 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17695d] ${!heard ? "opacity-65" : ""} ${optionStyle(item.id)}`}
                          >
                            <item.Icon
                              aria-hidden="true"
                              size={64}
                              strokeWidth={1.6}
                              color={item.color}
                            />
                            <span className="mt-3 text-xs font-bold text-[#54727b]">
                              Bild {i + 1}
                            </span>
                            {answer !== null && (
                              <span className="mt-2 text-sm font-bold">
                                {item.word}
                              </span>
                            )}
                            {answer !== null && item.id === expected && (
                              <Check
                                aria-label="Rätt svar"
                                className="absolute right-3 top-3 text-[#276b5b]"
                                size={20}
                              />
                            )}
                            {answer === item.id && !correct && (
                              <X
                                aria-label="Ditt svar"
                                className="absolute right-3 top-3"
                                size={20}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                      {!heard && (
                        <p
                          role="status"
                          className="mt-3 text-center text-xs leading-6 text-[#54727b]"
                        >
                          Lyssna på ordet innan du väljer en bild.
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {current.choices.map((choice) => (
                        <button
                          key={choice}
                          disabled={answer !== null}
                          onClick={() => choose(choice)}
                          className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17695d] ${optionStyle(choice)}`}
                        >
                          <span>{choice}</span>
                          {answer !== null && choice === expected && (
                            <Check
                              aria-label="Rätt svar"
                              className="shrink-0"
                              size={20}
                            />
                          )}
                          {answer === choice && !correct && (
                            <X
                              aria-label="Ditt svar"
                              className="shrink-0"
                              size={20}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {answer !== null && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`mt-6 rounded-2xl border p-5 ${correct ? "border-[#bedfd3] bg-[#edf7f0]" : "border-[#ecd2b3] bg-[#fff8ed]"}`}
                    >
                      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <p className="font-extrabold">
                          {correct
                            ? "Rätt svar!"
                            : "Bra försök! Här är rätt svar:"}
                        </p>
                        <button
                          type="button"
                          onClick={toggleSavedQuestion}
                          aria-pressed={isSaved}
                          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#bed3c1] bg-white/90 px-4 py-2 text-xs font-bold text-[#36674f] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#17695d] sm:text-sm"
                        >
                          <Star
                            aria-hidden="true"
                            size={16}
                            className={isSaved ? "fill-current" : ""}
                          />
                          {isSaved
                            ? "Sparat – ta bort"
                            : "Spara som klurigt ord"}
                        </button>
                      </div>
                      {!correct && (
                        <p className="mt-2 font-bold">
                          {current.mode === "listen"
                            ? current.data.word
                            : current.data.answer}
                        </p>
                      )}
                      {current.mode === "situations" && (
                        <>
                          <p className="mt-3 rounded-xl bg-white/75 p-4 text-sm font-bold">
                            Personen svarar: ”{current.data.reply}”
                          </p>
                          <p className="mt-3 text-sm leading-6 text-[#54727b]">
                            {current.data.explanation}
                          </p>
                        </>
                      )}
                      {current.mode === "positions" && (
                        <p className="mt-3 text-sm leading-6 text-[#54727b]">
                          {current.data.explanation}
                        </p>
                      )}
                      {current.mode === "listen" && (
                        <p className="mt-3 text-sm leading-6 text-[#54727b]">
                          Du hörde: <strong>{current.data.word}</strong>.
                        </p>
                      )}
                      {isSaved && (
                        <p className="mt-4 flex items-start gap-2 text-xs leading-6 text-[#54704f]">
                          <Star
                            aria-hidden="true"
                            size={15}
                            className="mt-1 shrink-0 fill-current"
                          />
                          <span>
                            {autoSavedId === currentSavedQuestion?.id
                              ? "Frågan har sparats automatiskt under Mina kluriga ord."
                              : "Frågan är sparad under Mina kluriga ord."}
                          </span>
                        </p>
                      )}
                      <button onClick={next} className={`${primary} mt-5`}>
                        {index === rounds.length - 1
                          ? "Visa resultat"
                          : "Nästa fråga"}
                        <ArrowRight size={17} />
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </section>
        )}
      </div>
    </main>
  );
}
