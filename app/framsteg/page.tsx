"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Footprints,
  Leaf,
  MoveHorizontal,
} from "lucide-react";

import {
  getLearningTrail,
  LEARNING_TRAIL_EVENT,
  TRAIL_EXERCISES,
  type LearnedExercise,
} from "@/app/lib/exerciseProgress";

import ActivityStatistics from "@/app/components/progress/ActivityStatistics";

function subscribe(onChange: () => void) {
  window.addEventListener(LEARNING_TRAIL_EVENT, onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);

  return () => {
    window.removeEventListener(LEARNING_TRAIL_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
  };
}

function getSnapshot() {
  return JSON.stringify(getLearningTrail());
}

function getServerSnapshot() {
  return "[]";
}

// Scattered locations, kept stable between visits.
const locations: Record<string, { x: number; y: number }> = {
  "grunder-samtal": { x: 155, y: 145 },
  "grunder-lagesord": { x: 685, y: 365 },
  "grunder-lyssna": { x: 1080, y: 155 },
  "en-eller-ett": { x: 400, y: 285 },
  "stavning-choice": { x: 920, y: 460 },
  "stavning-fill": { x: 455, y: 105 },
  "stavning-double": { x: 170, y: 450 },
  "mening-bygg": { x: 1200, y: 390 },
  "mening-valj": { x: 780, y: 125 },
  "mening-saknas": { x: 445, y: 510 },
};

const exercises = TRAIL_EXERCISES.map((exercise) => ({
  ...exercise,
  ...(locations[exercise.id] ?? { x: exercise.x, y: exercise.y }),
}));

// A decorative woodland path, not a required exercise order.

export default function ProgressPage() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const learned = JSON.parse(snapshot) as LearnedExercise[];
  const learnedIds = new Set(learned.map((item) => item.id));

  const lastExercise = exercises.find(
    (exercise) => exercise.id === learned.at(-1)?.id,
  );

  const remaining = exercises.filter(
    (exercise) => !learnedIds.has(exercise.id),
  );

  const connections = learned.slice(1).flatMap((destination, index) => {
    const from = exercises.find(
      (exercise) => exercise.id === learned[index].id,
    );
    const to = exercises.find((exercise) => exercise.id === destination.id);

    if (!from || !to) return [];

    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.hypot(dx, dy) || 1;
    const offsetX = (-dy / distance) * destination.bend;
    const offsetY = (dx / distance) * destination.bend;

    return [
      {
        id: `${from.id}-${to.id}`,
        path: [
          `M ${from.x} ${from.y}`,
          `C ${from.x + dx / 3 + offsetX}`,
          `${from.y + dy / 3 + offsetY},`,
          `${from.x + (dx * 2) / 3 + offsetX}`,
          `${from.y + (dy * 2) / 3 + offsetY},`,
          `${to.x} ${to.y}`,
        ].join(" "),
      },
    ];
  });

  return (
    <main className="min-h-screen bg-[#f6f8f1] px-4 pb-16 pt-7 text-[#183f47] sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/#framsteg"
          className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-bold text-[#54727b] hover:text-[#247363] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#247363]"
        >
          <ArrowLeft size={17} />
          Till startsidan
        </Link>

        <header className="mb-7 mt-6 sm:mb-9">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dce6d6] bg-white px-3 py-1.5 text-xs font-bold text-[#547653]">
            <Footprints size={15} />
            Mina framsteg
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Din egen väg genom skogen
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#54727b] sm:text-base">
            Välj fritt bland skogens stenar. När du klarar en hel övningsrunda
            med minst 80 procent rätt lyser stenen upp. Det finns ingen bestämd
            ordning.
          </p>
        </header>

        <section
          aria-labelledby="trail-heading"
          className="overflow-hidden rounded-[26px] border border-[#d6dfcd] bg-[#edf2e6] shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#dce5d3] bg-[#fbfcf7] px-5 py-4 sm:px-7">
            <h2
              id="trail-heading"
              className="flex items-center gap-2 text-sm font-extrabold"
            >
              <Leaf size={17} className="text-[#63835b]" />
              Din kunskapsskog
            </h2>

            <p className="text-xs font-semibold text-[#63775d]">
              {exercises.filter((item) => learnedIds.has(item.id)).length} av{" "}
              {exercises.length} stenar lyser
            </p>
          </div>

          <p
            id="trail-scroll-hint"
            className="flex items-center gap-2 px-5 py-3 text-xs text-[#63775d]"
          >
            <MoveHorizontal size={16} />
            Bläddra åt sidan om hela skogen inte syns
          </p>

          <div
            tabIndex={0}
            role="region"
            aria-label="Skogskarta med övningar"
            aria-describedby="trail-scroll-hint"
            className="overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#63835b]"
          >
            <div
              className="relative isolate h-[660px] w-[1360px] overflow-hidden bg-[#b8c9a3]"
              style={{
                backgroundImage: `
                  linear-gradient(
                    180deg,
                    rgba(233, 241, 214, 0.20),
                    rgba(30, 65, 43, 0.16)
                  ),
                  url('/images/framsteg-forest.png')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Soft clearings behind the exercise locations */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                {exercises.map((exercise) => (
                  <span
                    key={exercise.id}
                    className="absolute h-32 w-44 rounded-full bg-[#e6ebc7]/45 blur-2xl"
                    style={{
                      left: exercise.x - 88,
                      top: exercise.y - 50,
                    }}
                  />
                ))}
              </div>

              <svg
                viewBox="0 0 1360 660"
                width="1360"
                height="660"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                {/* Personal trails between unlocked stones */}
                {connections.map((connection) => (
                  <g key={connection.id}>
                    <path
                      d={connection.path}
                      fill="none"
                      stroke="#e8edb9"
                      strokeWidth="10"
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                    <path
                      d={connection.path}
                      fill="none"
                      stroke="#516c3f"
                      strokeWidth="3"
                      strokeDasharray="2 9"
                      strokeLinecap="round"
                    />
                  </g>
                ))}
              </svg>

              {exercises.map((exercise, index) => {
                const unlocked = learnedIds.has(exercise.id);

                return (
                  <Link
                    key={exercise.id}
                    href={exercise.href}
                    aria-label={`${exercise.title}, ${exercise.area}. ${
                      unlocked
                        ? "Stenen är upplåst."
                        : "Klara en runda med minst 80 procent rätt för att låsa upp."
                    } Öppna övningen.`}
                    className="group absolute z-10 flex w-[148px] flex-col items-center rounded-xl text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    style={{
                      left: exercise.x - 74,
                      top: exercise.y - 26,
                    }}
                  >
                    <span
                      className={`relative isolate grid h-[52px] w-[68px] place-items-center border transition duration-500 motion-safe:group-hover:-translate-y-1 ${
                        unlocked
                          ? "border-[#f0d995] text-[#655329] shadow-[0_0_18px_5px_rgba(255,222,137,0.55),0_0_38px_12px_rgba(255,222,137,0.22),0_4px_0_#879082]"
                          : "border-[#818879] text-[#e0e6d7] shadow-[0_4px_0_#344439,0_8px_12px_rgba(25,45,28,0.25)]"
                      }`}
                      style={{
                        borderRadius:
                          index % 2 === 0
                            ? "44% 56% 46% 54% / 56% 43% 57% 44%"
                            : "56% 44% 54% 46% / 45% 58% 42% 55%",

                        backgroundColor: unlocked ? "#cdd0cb" : "#596357",

                        backgroundImage: `
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='stone'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.32' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stone)' opacity='.32'/%3E%3C/svg%3E"),
      linear-gradient(
        135deg,
        ${
          unlocked
            ? "#eeefeb 0%, #cdd0cb 48%, #a4ada2 100%"
            : "#818879 0%, #596357 48%, #3b4d40 100%"
        }
      )
    `,

                        backgroundBlendMode: "soft-light, normal",
                      }}
                    >
                      {unlocked && (
                        <>
                          {/* Soft light across the stone */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-[#fff5ca]/35 via-transparent to-transparent"
                          />

                          {/* Gently pulsing halo */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-2 -z-10 rounded-[inherit] bg-[#ffe5a0]/25 blur-md motion-safe:animate-pulse"
                          />

                          {/* Small points of light */}
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-1 -top-2 text-sm text-[#fff4cf] drop-shadow-[0_0_5px_#ffe29a]"
                          >
                            ✦
                          </span>

                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -bottom-1 -left-2 text-[10px] text-[#fff4cf] drop-shadow-[0_0_5px_#ffe29a]"
                          >
                            ✧
                          </span>
                        </>
                      )}

                      {unlocked ? (
                        <Check
                          size={21}
                          strokeWidth={2.5}
                          className="relative drop-shadow-[0_0_5px_rgba(255,231,160,0.9)]"
                        />
                      ) : (
                        <Footprints size={20} />
                      )}
                    </span>

                    <span className="mt-3 w-full rounded-xl border border-white/70 bg-[#fafbf2]/95 px-2 py-2 shadow-sm">
                      <span className="block text-[13px] font-extrabold leading-5 text-[#304e3d]">
                        {exercise.title}
                      </span>

                      <span className="mt-1 block text-[10px] font-semibold text-[#64765b]">
                        {exercise.area}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#dce5d3] bg-[#fbfcf7] px-5 py-4 text-xs text-[#63775d] sm:px-7">
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#596357]" />
              Att utforska
            </span>

            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full border border-[#d7bd77] bg-[#cdd0cb] shadow-[0_0_8px_3px_rgba(244,207,117,0.6)]" />
            </span>

            <span className="flex items-center gap-2">
              <span className="w-6 border-t-2 border-dotted border-[#516c3f]" />
              Din väg mellan upplåsta stenar
            </span>
          </div>
        </section>
        <ActivityStatistics />
        <section className="mt-8 border-t border-[#dfe7d8]">
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex max-w-2xl items-start gap-4 sm:items-center sm:gap-5">
              {lastExercise && (
                <span
                  aria-hidden="true"
                  className="relative mt-2 grid h-[52px] w-[68px] shrink-0 place-items-center border border-[#ecd697] text-[#655329] shadow-[0_0_18px_4px_rgba(255,222,137,0.4),0_4px_0_#879082] sm:mt-0"
                  style={{
                    borderRadius: "44% 56% 46% 54% / 56% 43% 57% 44%",
                    backgroundColor: "#cdd0cb",
                    backgroundImage: `
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='stone'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.32' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23stone)' opacity='.32'/%3E%3C/svg%3E"),
            linear-gradient(135deg, #eeefeb, #cdd0cb 48%, #a4ada2)
          `,
                    backgroundBlendMode: "soft-light, normal",
                  }}
                >
                  <Check
                    size={22}
                    strokeWidth={2.5}
                    className="drop-shadow-[0_0_5px_rgba(255,231,160,0.9)]"
                  />

                  <span className="absolute -right-1 -top-2 text-sm text-[#c29b43]">
                    ✦
                  </span>
                </span>
              )}

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-[#728568]">
                  Senaste upptäckten
                </p>

                <h2 className="mt-2 text-lg font-extrabold text-[#183f47]">
                  {lastExercise ? lastExercise.title : "Här börjar din stig"}
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#54727b]">
                  {lastExercise
                    ? "Det här är din senast upplåsta sten. Återvänd gärna och öva igen."
                    : "Välj en sten på kartan. Klara en hel runda med minst 80 procent rätt för att få den att lysa."}
                </p>
              </div>
            </div>

            {lastExercise && (
              <Link
                href={lastExercise.href}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg text-sm font-bold text-[#39775f] transition hover:text-[#244e3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39775f] sm:self-center"
              >
                Öva igen
                <ArrowRight size={16} />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#e4eadd] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-2xl">
              <h2 className="text-lg font-extrabold text-[#183f47]">
                {remaining.length > 0
                  ? "Vart går din nästa upptäcktsfärd?"
                  : "Alla dina stenar lyser!"}
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#54727b]">
                {remaining.length > 0
                  ? "Följ din nyfikenhet. Det finns fler övningar att utforska, i din egen takt."
                  : "Du har utforskat alla övningar på kartan. Fortsätt gärna repetera och håll kunskaperna levande."}
              </p>
            </div>

            <Link
              href="/#ovningar"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-lg text-sm font-bold text-[#39775f] transition hover:text-[#244e3c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#39775f] sm:self-center"
            >
              Utforska övningarna
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
