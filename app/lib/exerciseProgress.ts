export type ExerciseArea =
  | "grunder"
  | "en-eller-ett"
  | "stavning"
  | "meningsbyggnad";

export type ExerciseProgress = Record<ExerciseArea, number>;

export const EXERCISE_PROGRESS_KEY =
  "svenskasparet-exercise-progress";

export const EXERCISE_PROGRESS_EVENT =
  "svenskasparet-exercise-progress-updated";

export const ROUNDS_GOAL = 10;

const emptyProgress: ExerciseProgress = {
  grunder: 0,
  "en-eller-ett": 0,
  stavning: 0,
  meningsbyggnad: 0,
};

export function getExerciseProgress(): ExerciseProgress {
  if (typeof window === "undefined") {
    return { ...emptyProgress };
  }

  try {
    const saved = localStorage.getItem(EXERCISE_PROGRESS_KEY);

    if (!saved) return { ...emptyProgress };

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return { ...emptyProgress };
    }

    const data = parsed as Record<string, unknown>;
    const result = { ...emptyProgress };

    for (const area of Object.keys(result) as ExerciseArea[]) {
      const value = data[area];

      if (
        typeof value === "number" &&
        Number.isSafeInteger(value) &&
        value >= 0
      ) {
        result[area] = value;
      }
    }

    return result;
  } catch {
    return { ...emptyProgress };
  }
}

export function recordCompletedRound(area: ExerciseArea): void {
  if (typeof window === "undefined") return;

  const progress = getExerciseProgress();

  progress[area] += 1;

  try {
    localStorage.setItem(
      EXERCISE_PROGRESS_KEY,
      JSON.stringify(progress)
    );

    window.dispatchEvent(new Event(EXERCISE_PROGRESS_EVENT));
  } catch (error) {
  console.error("Could not save exercise progress:", error);
}
}

export function getAreaPercentage(
  progress: ExerciseProgress,
  area: ExerciseArea
): number {
  return Math.min(
    100,
    Math.round((progress[area] / ROUNDS_GOAL) * 100)
  );
}