"use client";

import { useSyncExternalStore } from "react";
import { BarChart3, CalendarDays } from "lucide-react";

import { getActivity } from "@/app/lib/progress";
import { dateKey, getDailyProgress } from "@/app/lib/dailyProgress";

function subscribe(onChange: () => void) {
  window.addEventListener("svenskasparet-progress-updated", onChange);
  window.addEventListener("storage", onChange);
  window.addEventListener("focus", onChange);

  // Refresh the dates if the page remains open past midnight.
  const interval = window.setInterval(onChange, 60_000);

  return () => {
    window.removeEventListener(
      "svenskasparet-progress-updated",
      onChange,
    );
    window.removeEventListener("storage", onChange);
    window.removeEventListener("focus", onChange);
    window.clearInterval(interval);
  };
}

function getSnapshot() {
  return JSON.stringify({
    today: dateKey(new Date()),
    dates: getActivity().dates,
    daily: getDailyProgress(),
  });
}

function getServerSnapshot() {
  return "";
}

function recentDays(today: string, count: number) {
  const [year, month, day] = today.split("-").map(Number);

  return Array.from({ length: count }, (_, index) => {
    // Local noon keeps day arithmetic safe around daylight-saving changes.
    const date = new Date(year, month - 1, day, 12);
    date.setDate(date.getDate() - (count - 1 - index));

    return {
      key: dateKey(date),
      weekday: date.toLocaleDateString("sv-SE", {
        weekday: "short",
      }),
      number: date.getDate(),
      fullLabel: date.toLocaleDateString("sv-SE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  });
}

export default function ActivityStatistics() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!snapshot) {
    return (
      <div
        role="status"
        className="mt-6 rounded-[24px] border border-[#dfe7d8] bg-white p-6 text-sm text-[#54727b]"
      >
        Läser in din aktivitet…
      </div>
    );
  }

  const { today, dates, daily } = JSON.parse(snapshot) as {
    today: string;
    dates: string[];
    daily: ReturnType<typeof getDailyProgress>;
  };

  const activeDates = new Set(dates);
  const calendarDays = recentDays(today, 28);
  const chartDays = recentDays(today, 7);

  const activeDayCount = calendarDays.filter((day) =>
    activeDates.has(day.key),
  ).length;

  const chart = chartDays.map((day) => ({
    ...day,
    // Earlier days are unknown, rather than falsely displayed as zero.
    count:
      daily.startedOn && day.key >= daily.startedOn
        ? (daily.questions[day.key] ?? 0)
        : null,
  }));

  const maximum = Math.max(
    5,
    ...chart.map((day) => day.count ?? 0),
  );

  const chartMaximum = Math.ceil(maximum / 5) * 5;

  const trackedTotal = chart.reduce(
    (sum, day) => sum + (day.count ?? 0),
    0,
  );

  return (
    <section
      aria-label="Din aktivitet och dagliga träning"
      className="mt-6 grid gap-5 lg:grid-cols-2"
    >
      {/* Calendar */}
      <article className="rounded-[24px] border border-[#dfe7d8] bg-white p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#edf3e8] text-[#63835b]">
            <CalendarDays size={20} />
          </span>

          <div>
            <h2 className="text-lg font-extrabold text-[#183f47]">
              Din aktivitetskalender
            </h2>
            <p className="mt-1 text-xs text-[#54727b]">
              Senaste 28 dagarna
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#54727b]">
          En grön ruta för varje dag du har övat.
        </p>

        <div className="mt-5 grid grid-cols-7 gap-2">
          {calendarDays.slice(0, 7).map((day) => (
            <span
              key={day.key}
              aria-hidden="true"
              className="text-center text-[11px] font-bold text-[#71836b]"
            >
              {day.weekday}
            </span>
          ))}

          {calendarDays.map((day) => {
            const practiced = activeDates.has(day.key);
            const isToday = day.key === today;

            return (
              <div
                key={day.key}
                role="img"
                aria-label={`${day.fullLabel}${
                  isToday ? ", idag" : ""
                }: ${
                  practiced
                    ? "Du övade"
                    : "Ingen registrerad träning"
                }`}
                title={`${day.fullLabel}: ${
                  practiced
                    ? "Du övade"
                    : "Ingen registrerad träning"
                }`}
                className={`grid h-11 place-items-center rounded-xl text-sm font-bold ${
                  practiced
                    ? "bg-[#6d9b7c] text-white"
                    : "bg-[#f0f3eb] text-[#7d8c76]"
                } ${
                  isToday
                    ? "ring-2 ring-[#b99a51] ring-offset-2"
                    : ""
                }`}
              >
                {day.number}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#63775d]">
          <span>
            <strong>{activeDayCount}</strong> aktiva dagar av 28
          </span>

          <span className="flex items-center gap-2">
            <span className="size-3 rounded border-2 border-[#b99a51]" />
            Idag
          </span>
        </div>
      </article>

      {/* Daily question chart */}
      <article className="rounded-[24px] border border-[#dfe7d8] bg-[#fbfcf7] p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#e7efeb] text-[#39775f]">
            <BarChart3 size={20} />
          </span>

          <div>
            <h2 className="text-lg font-extrabold text-[#183f47]">
              Frågor dag för dag
            </h2>
            <p className="mt-1 text-xs text-[#54727b]">
              Senaste 7 dagarna · antal besvarade frågor
            </p>
          </div>
        </div>

        <div
          role="img"
          aria-label={`Besvarade frågor under de senaste sju dagarna. ${chart
            .map(
              (day) =>
                `${day.fullLabel}: ${
                  day.count === null
                    ? "uppgift saknas"
                    : `${day.count} frågor`
                }`,
            )
            .join(". ")}`}
          className="mt-7"
        >
          <div aria-hidden="true" className="flex gap-2">
            <div className="flex h-40 w-8 shrink-0 flex-col justify-between text-right text-[10px] text-[#7b8b74]">
              <span>{chartMaximum}</span>
              <span>{chartMaximum / 2}</span>
              <span>0</span>
            </div>

            <div
              className="grid h-40 min-w-0 flex-1 grid-cols-7 gap-2 border-b border-[#dce5d5]"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, #e4eadc 1px, transparent 1px)",
                backgroundSize: "100% 50%",
              }}
            >
              {chart.map((day) => (
                <div
                  key={day.key}
                  className="relative flex h-full min-w-0 items-end justify-center"
                >
                  {day.count === null ? (
                    <span className="pb-2 text-xs text-[#8b9784]">
                      –
                    </span>
                  ) : (
                    <div
                      className="relative w-full max-w-10 rounded-t-lg bg-gradient-to-t from-[#56876a] to-[#98b890]"
                      style={{
                        height:
                          day.count > 0
                            ? `${(day.count / chartMaximum) * 100}%`
                            : "2px",
                      }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-[#365d46]">
                        {day.count}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="ml-10 mt-3 grid grid-cols-7 gap-2"
          >
            {chart.map((day) => (
              <div key={day.key} className="text-center">
                <span className="block text-[10px] font-bold text-[#63775d]">
                  {day.weekday}
                </span>
                <span className="mt-1 block text-[10px] text-[#87927f]">
                  {day.number}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-5 text-sm font-bold text-[#39775f]">
          {trackedTotal} registrerade frågor under perioden
        </p>

        <p className="mt-2 text-xs leading-6 text-[#71836b]">
          {daily.startedOn
            ? `Daglig räkning startade ${daily.startedOn}. Den första dagen kan vara ofullständig. Streck betyder att uppgift saknas.`
            : "Daglig räkning börjar vid ditt nästa svar. Tidigare dagars antal är inte sparade."}
        </p>
      </article>
    </section>
  );
}