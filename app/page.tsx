"use client";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getDailyWord } from "@/app/data/dailyword";
import { getActivity, getCurrentStreak, getProgress } from "@/app/lib/progress";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Leaf,
  List,
  Sprout,
  Target,
  Timer,
} from "lucide-react";

import {
  EXERCISE_PROGRESS_EVENT,
  getExerciseProgress,
  getAreaPercentage,
  ROUNDS_GOAL,
  type ExerciseArea,
  type ExerciseProgress,
} from "@/app/lib/exerciseProgress";

const learningAreas: {
  id: ExerciseArea;
  title: string;
  description: string;
  level: string;
  color: keyof typeof cardColors;
  image: string;
  href: string;
}[] = [
  {
    id: "grunder",
    title: "Grunder & hälsningar",
    description: "Lär dig enkla ord och fraser för vardagen.",
    level: "Nybörjare",
    color: "mint",
    image: "/images/grunder-icon.png",
    href: "/exercises/grunder",
  },
  {
    id: "en-eller-ett",
    title: "En eller ett?",
    description: "Lär dig vilket ord som passar.",
    level: "Grundnivå",
    color: "coral",
    image: "/images/En-eller-ett-icon.png",
    href: "/exercises/en-eller-ett",
  },
  {
    id: "stavning",
    title: "Stavning",
    description: "Träna på bokstäver och stavningsregler.",
    level: "Grundnivå",
    color: "purple",
    image: "/images/stavning-icon.png",
    href: "/exercises/stavningsjakten",
  },
  {
    id: "meningsbyggnad",
    title: "Meningsbyggnad",
    description: "Bygg meningar och upptäck mönster.",
    level: "Medel",
    color: "yellow",
    image: "/images/meningsbyggnad-icon.png",
    href: "/exercises/meningsbyggnad",
  },
];

const cardColors = {
  mint: {
    card: "border-[#c9e5da] bg-gradient-to-br from-[#edf6f2] to-[#e9f2ef]",
    icon: "bg-[#cce5da]",
    pill: "bg-white/70 text-[#285d52]",
    arrow: "border-[#d7e9e1] text-[#24585c]",
  },
  coral: {
    card: "border-[#f7d0c3] bg-gradient-to-br from-[#fff1ec] to-[#f9f0ed]",
    icon: "bg-[#fbd6ca]",
    pill: "bg-white/70 text-[#8c5140]",
    arrow: "border-[#f4ddd5] text-[#92533f]",
  },
  purple: {
    card: "border-[#ded5f5] bg-gradient-to-br from-[#f5f1fd] to-[#f0eff9]",
    icon: "bg-[#e2d7fa]",
    pill: "bg-white/70 text-[#65518f]",
    arrow: "border-[#e4dcf6] text-[#65518f]",
  },
  yellow: {
    card: "border-[#eee0bd] bg-gradient-to-br from-[#fbf7ec] to-[#f8f5ed]",
    icon: "bg-[#ffe6a5]",
    pill: "bg-white/70 text-[#80652b]",
    arrow: "border-[#eee4cb] text-[#80652b]",
  },
};

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLastSevenDays(today: Date) {
  const days = ["Sö", "Må", "Ti", "On", "To", "Fr", "Lö"];

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      label: days[date.getDay()],
      dateKey: getDateKey(date),
    };
  });
}

export default function Home() {
  const [activeDates, setActiveDates] = useState<string[]>([]);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastSevenDays, setLastSevenDays] = useState<
    { label: string; dateKey: string }[]
  >([]);
  const [exerciseProgress, setExerciseProgress] = useState<ExerciseProgress>({
    grunder: 0,
    "en-eller-ett": 0,
    stavning: 0,
    meningsbyggnad: 0,
  });
  useEffect(() => {
    function updateStats() {
      const progress = getProgress();
      const activity = getActivity();

      setLastSevenDays(getLastSevenDays(new Date()));
      setAnswered(progress.answered);
      setCorrect(progress.correct);
      setStreak(getCurrentStreak());
      setActiveDates(activity.dates);
      setExerciseProgress(getExerciseProgress());
    }

    updateStats();

    window.addEventListener(EXERCISE_PROGRESS_EVENT, updateStats);
    window.addEventListener("svenskasparet-progress-updated", updateStats);
    window.addEventListener("storage", updateStats);

    return () => {
      window.removeEventListener(EXERCISE_PROGRESS_EVENT, updateStats);
      window.removeEventListener("svenskasparet-progress-updated", updateStats);
      window.removeEventListener("storage", updateStats);
    };
  }, []);

  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  const dailyWord = useSyncExternalStore(
    () => () => {},
    getDailyWord,
    () => null,
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_8%_20%,rgba(224,239,244,0.38),transparent_38%),#f3f7f9] text-[#153e43]">
      {/* Toppmeny */}

      <Header streak={streak} />

      <div
        id="hem"
        className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8"
      >
        {/* Välkomstsektion */}
        <section className="relative isolate mt-4 flex min-h-[300px] overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-r from-[#e3efeb] via-[#e8f0ee] to-[#d4eaf0] sm:min-h-[320px]">
          <div className="relative z-10 flex w-full items-center px-5 py-8 sm:w-[65%] sm:px-9 sm:py-10 lg:w-[58%] lg:px-11">
            <div>
              <div className="mb-3 flex items-center gap-2.5 text-[10px] font-extrabold tracking-[0.16em] text-[#27655e] sm:text-xs">
                <Leaf size={18} fill="currentColor" />
                VÄLKOMMEN TILL SVENSKASPÅRET
              </div>
              <h1 className="mb-2 text-4xl font-extrabold leading-tight tracking-[-0.05em] text-[#143f43] sm:text-5xl lg:text-6xl">
                Hejsan!
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-[#28545c] sm:text-lg">
                Ett steg i taget, och du kommer att lära dig svenska!
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#snabbsparet"
                  className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#155d56] px-5 text-xs font-bold text-white shadow-md shadow-[#19564e]/10 transition hover:-translate-y-0.5 hover:bg-[#104c47] sm:text-sm"
                >
                  Fortsätt träna <ArrowRight size={17} />
                </Link>
                <Link
                  href="#ovningar"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#78a5a4] bg-white/40 px-4 text-xs font-bold text-[#24545b] transition hover:-translate-y-0.5 hover:bg-white/80 sm:px-5 sm:text-sm"
                >
                  Utforska övningar <ChevronRight size={17} />
                </Link>
              </div>
            </div>
          </div>

          {/* Skogsbilden */}
          <div className="absolute inset-y-0 right-0 w-full sm:w-[66%]">
            <Image
              src="/images/svenskasparet-forest.png"
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover object-[center_58%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#e6efec] via-[#e6efec]/70 to-transparent sm:from-[#e6efec] sm:via-[#e6efec]/25 sm:to-transparent" />
          </div>

          {/* Dagens ord */}
          {dailyWord && (
            <article className="absolute bottom-4 right-4 z-10 hidden w-64 rounded-[1.35rem] border border-white/80 bg-white/95 p-5 shadow-xl shadow-[#254b4d]/10 backdrop-blur-sm lg:block xl:right-6 xl:bottom-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f5efdc] text-[#285d52]">
                  <Sprout size={17} />
                </span>
                <span className="text-sm font-extrabold tracking-tight text-[#234b4b]">
                  Dagens ord
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <h2 className="min-w-0 text-[1.7rem] font-extrabold leading-tight tracking-tight text-[#183f47]">
                  {dailyWord.word}
                </h2>

                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#edf5ef] text-2xl"
                >
                  {dailyWord.emoji}
                </span>
              </div>

              <p className="mt-1 text-sm leading-relaxed text-[#54727b]">
                {dailyWord.description}
              </p>

              <Link
                href={dailyWord.exerciseLink}
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e0eee8] px-4 py-2 text-xs font-extrabold text-[#17665d] transition-colors hover:bg-[#d1e6dd]"
              >
                {dailyWord.exerciseTitle}
                <ChevronRight size={15} />
              </Link>
            </article>
          )}
        </section>

        {/* Övningsområden */}
        <section id="ovningar" className="py-9 sm:py-11">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#183f47] sm:text-3xl">
                Din väg framåt
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#54727b]">
                Välj ett område att träna på, eller fortsätt där du var.
              </p>
            </div>
            <Link
              href="#snabbsparet"
              className="hidden items-center gap-1 text-sm font-bold text-[#17665d] hover:underline sm:inline-flex"
            >
              Alla övningar <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {learningAreas.map((area) => {
              const colors = cardColors[area.color];
              const percentage = getAreaPercentage(exerciseProgress, area.id);
              const completedRounds = exerciseProgress[area.id];
              return (
                <Link
                  key={area.title}
                  href={area.href}
                  className={`group flex min-h-[230px] flex-col rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#2a494f]/10 sm:p-6 ${colors.card}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-32 w-36 items-center justify-start sm:h-36 sm:w-40">
                      <Image
                        src={area.image}
                        alt=""
                        width={160}
                        height={160}
                        className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                      />
                    </div>

                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 bg-white/50 transition group-hover:translate-x-0.5 ${colors.arrow}`}
                    >
                      <ChevronRight size={18} />
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-extrabold tracking-tight text-[#183f47]">
                    {area.title}
                  </h3>

                  <p className="mt-2 min-h-10 text-sm leading-relaxed text-[#54727b]">
                    {area.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2.5 pt-4">
                    <span
                      className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold ${colors.pill}`}
                    >
                      {area.level}
                    </span>

                    <div
                      role="progressbar"
                      aria-label={`Framsteg i ${area.title}`}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/80"
                      title={`${completedRounds} av ${ROUNDS_GOAL} rundor`}
                    >
                      <div
                        className="h-full rounded-full bg-[#4f9a82] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="text-[11px] font-extrabold text-[#42676a]">
                      {percentage}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Snabbspåret och kluriga ord */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article
            id="snabbsparet"
            className="flex flex-col gap-5 rounded-[22px] border border-[#d4e6df] bg-gradient-to-br from-[#e8f4ef] to-[#e0efeb] p-5 sm:flex-row sm:items-center sm:p-7"
          >
            <div className="flex h-32 w-32 shrink-0 items-center justify-center sm:h-40 sm:w-40">
              <Image
                src="/images/snabbsparet-icon.png"
                alt="Snabbspåret"
                width={160}
                height={160}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-extrabold text-[#183f47] sm:text-3xl">
                Snabbspåret
              </h2>

              <p className="mt-1 text-base leading-relaxed text-[#54727b]">
                Hur många frågor klarar du på 60 sekunder?
              </p>

              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#42676a]">
                <span className="inline-flex items-center gap-1.5">
                  <Timer size={15} /> 60 sekunder
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <List size={15} /> Blandade övningar
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Target size={15} /> Pröva din kunskap
                </span>
              </div>
              <Link
                href="/exercises/snabbsparet"
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#155d56] px-5 text-xs font-bold text-white transition hover:bg-[#104c47]"
              >
                Starta en övning <ChevronRight size={16} />
              </Link>
            </div>
          </article>

          <article
            id="kluriga-ord"
            className="flex flex-wrap items-center gap-3 rounded-[22px] border border-[#e3dcf3] bg-gradient-to-br from-[#f5f1fd] to-[#efedf8] p-4 sm:flex-nowrap sm:gap-5 sm:p-6"
          >
            {/* Lightbulb on the left */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-28 sm:w-28">
              <Image
                src="/images/kluriga-ord-icon-lightbulb.png"
                alt=""
                width={112}
                height={112}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Text in the middle */}
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-extrabold text-[#183f47] sm:text-xl">
                Mina kluriga ord
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-[#54727b]">
                Samla ord du vill öva mer på och kom tillbaka till dem senare.
              </p>
            </div>

            {/* Flashcards and button on the right on desktop */}
            <div className="flex w-full flex-col items-start gap-3 sm:w-48 sm:shrink-0 sm:items-center sm:gap-3">
              {/* Flashcards: hidden on mobile */}
              <div className="relative hidden h-28 w-full sm:block">
                <Image
                  src="/images/kluriga-ord-flashcards-icon.png"
                  alt="Ord på kort med ett äpple"
                  fill
                  sizes="192px"
                  className="scale-125 object-contain"
                />
              </div>

              {/* Button on its own row on mobile */}
              <Link
                href="/exercises/kluriga-ord"
                className="inline-flex min-h-11 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-[#b9addb] bg-white/70 px-4 text-xs font-bold text-[#5f4d89] transition hover:bg-white sm:gap-2 sm:text-sm"
              >
                Träna på ord
                <ChevronRight size={15} />
              </Link>
            </div>
          </article>
        </section>

        {/* Framsteg */}
        <section
          id="framsteg"
          className="my-9 grid grid-cols-1 gap-5 rounded-[22px] border border-[#dce9e6] bg-white/80 p-5 shadow-sm shadow-[#254b4d]/5 sm:grid-cols-2 sm:p-7 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]"
        >
          <div className="flex items-center gap-3 sm:col-span-2 xl:col-span-1">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#e0efe7] text-[#247363]">
              <Leaf size={24} />
            </span>
            <div>
              <h2 className="font-extrabold text-[#183f47]">Du är på väg!</h2>
              <p className="mt-1 text-xs leading-relaxed text-[#54727b]">
                Varje fråga räknas. Du gör framsteg!
              </p>
            </div>
          </div>

          <div className="border-t border-[#e6eeec] pt-4 sm:border-t-0 sm:pt-0 xl:border-l xl:border-t-0 xl:pl-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#54727b]">
              <Leaf size={15} /> Frågor besvarade
            </p>
            <strong className="mt-2 block text-2xl font-extrabold text-[#183f47]">
              {answered}
            </strong>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e7efec]">
              <div
                className="h-full rounded-full bg-[#5ca18b]"
                style={{ width: `${Math.min(answered, 100)}%` }}
              />
            </div>
          </div>

          <div className="border-t border-[#e6eeec] pt-4 sm:border-t-0 sm:pt-0 xl:border-l xl:border-t-0 xl:pl-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#54727b]">
              <Target size={16} /> Rätt svar
            </p>
            <strong className="mt-2 block text-2xl font-extrabold text-[#183f47]">
              {accuracy}%
            </strong>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e7efec]">
              <div
                className="h-full rounded-full bg-[#5ca18b]"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div className="border-t border-[#e6eeec] pt-4 sm:border-t-0 sm:pt-0 xl:border-l xl:border-t-0 xl:pl-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#54727b]">
              <Flame size={16} className="text-[#f47c43]" /> Streak
            </p>
            <strong className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-[#183f47]">
              <Flame size={19} className="fill-[#ffd1a6] text-[#f47c43]" />
              {streak} {streak === 1 ? "dag" : "dagar"}
            </strong>
            <div className="mt-3 flex gap-1.5" aria-label="Tre dagar i rad">
              {[1, 2, 3, 4, 5].map((day) => (
                <span
                  key={day}
                  className={`h-2 w-5 rounded-full ${
                    day <= Math.min(streak, 5) ? "bg-[#70b39a]" : "bg-[#e5ece9]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-[#e6eeec] pt-4 sm:col-span-2 sm:border-t-0 sm:pt-0 xl:col-span-1 xl:border-l xl:pl-5">
            <p className="text-xs font-semibold text-[#54727b]">
              Senaste veckan
            </p>
            <div className="mt-3 flex justify-between gap-1">
              {lastSevenDays.map((day) => {
                const practiced = activeDates.includes(day.dateKey);
                return (
                  <div
                    key={day.dateKey}
                    className="flex flex-col items-center gap-2"
                    title={
                      practiced
                        ? `Du övade ${day.dateKey}`
                        : `Ingen registrerad träning ${day.dateKey}`
                    }
                  >
                    <span
                      className={`h-5 w-5 rounded-md ${
                        practiced ? "bg-[#70b39a]" : "bg-[#e5ece9]"
                      }`}
                    />
                    <span className="text-[10px] text-[#54727b]">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sidfot */}
        <Footer />
      </div>
    </main>
  );
}
