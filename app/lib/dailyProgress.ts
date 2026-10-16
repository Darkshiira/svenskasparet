export const DAILY_PROGRESS_KEY = "svenskasparet-daily-progress";

type DailyProgress = {
  startedOn: string | null;
  questions: Record<string, number>;
};

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDailyProgress(): DailyProgress {
  const empty: DailyProgress = {
    startedOn: null,
    questions: {},
  };

  if (typeof window === "undefined") return empty;

  try {
    const saved = localStorage.getItem(DAILY_PROGRESS_KEY);
    if (!saved) return empty;

    const parsed: unknown = JSON.parse(saved);

    if (typeof parsed !== "object" || parsed === null) return empty;

    const data = parsed as Record<string, unknown>;

    if (
      typeof data.startedOn !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data.startedOn) ||
      typeof data.questions !== "object" ||
      data.questions === null ||
      Array.isArray(data.questions)
    ) {
      return empty;
    }

    const questions: Record<string, number> = {};

    for (const [key, value] of Object.entries(data.questions)) {
      if (
        /^\d{4}-\d{2}-\d{2}$/.test(key) &&
        typeof value === "number" &&
        Number.isSafeInteger(value) &&
        value >= 0
      ) {
        questions[key] = value;
      }
    }

    return {
      startedOn: data.startedOn,
      questions,
    };
  } catch {
    return empty;
  }
}

export function recordDailyAnswer(): void {
  if (typeof window === "undefined") return;

  const today = dateKey(new Date());
  const data = getDailyProgress();

  data.startedOn ??= today;
  data.questions[today] = (data.questions[today] ?? 0) + 1;

  try {
    localStorage.setItem(DAILY_PROGRESS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Could not save daily progress:", error);
  }
}