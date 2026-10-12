
export type LearningProgress = {
  answered: number;
  correct: number;
};

export type ActivityData = {
  dates: string[];
};

export const PROGRESS_KEY = "svenskasparet-progress";
export const ACTIVITY_KEY = "svenskasparet-activity";

const emptyProgress: LearningProgress = {
  answered: 0,
  correct: 0,
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function getProgress(): LearningProgress {
  if (!isBrowser()) return { ...emptyProgress };

  try {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (!saved) return { ...emptyProgress };

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("answered" in parsed) ||
      !("correct" in parsed) ||
      typeof parsed.answered !== "number" ||
      typeof parsed.correct !== "number"
    ) {
      return { ...emptyProgress };
    }

    return {
      answered: Math.max(0, parsed.answered),
      correct: Math.max(0, parsed.correct),
    };
  } catch {
    return { ...emptyProgress };
  }
}

export function recordAnswer(isCorrect: boolean) {
  if (!isBrowser()) return;

  const current = getProgress();

  const next: LearningProgress = {
    answered: current.answered + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
  };

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));

  // Spara även vilken dag användaren övade.
  const today = getLocalDateKey();
  const activity = getActivity();

  if (!activity.dates.includes(today)) {
    activity.dates.push(today);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity));
  }

  // Gör att startsidan kan uppdateras direkt.
  window.dispatchEvent(new Event("svenskasparet-progress-updated"));
}

function getLocalDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getActivity(): ActivityData {
  if (!isBrowser()) return { dates: [] };

  try {
    const saved = localStorage.getItem(ACTIVITY_KEY);
    if (!saved) return { dates: [] };

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("dates" in parsed) ||
      !Array.isArray(parsed.dates) ||
      !parsed.dates.every((date) => typeof date === "string")
    ) {
      return { dates: [] };
    }

    return { dates: parsed.dates };
  } catch {
    return { dates: [] };
  }
}

export function getCurrentStreak(): number {
  const dates = new Set(getActivity().dates);
  const cursor = new Date();

  // Om användaren inte har övat idag kan sviten fortfarande
  // räknas från igår.
  if (!dates.has(getLocalDateKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (dates.has(formatDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
