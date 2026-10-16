export type ExerciseArea =
  | "grunder"
  | "en-eller-ett"
  | "stavning"
  | "meningsbyggnad";

export type ExerciseProgress = Record<ExerciseArea, number>;

export const EXERCISE_PROGRESS_KEY = "svenskasparet-exercise-progress";

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
    localStorage.setItem(EXERCISE_PROGRESS_KEY, JSON.stringify(progress));

    window.dispatchEvent(new Event(EXERCISE_PROGRESS_EVENT));
  } catch (error) {
    console.error("Could not save exercise progress:", error);
  }
}

export function getAreaPercentage(
  progress: ExerciseProgress,
  area: ExerciseArea,
): number {
  return Math.min(100, Math.round((progress[area] / ROUNDS_GOAL) * 100));
}

export const LEARNING_TRAIL_KEY = "svenskasparet-learning-trail";
export const LEARNING_TRAIL_EVENT = "svenskasparet-learning-trail-updated";

export const TRAIL_EXERCISES = [
  {
    id: "grunder-samtal",
    title: "Bygg ett samtal",
    area: "Grunder & hälsningar",
    href: "/exercises/grunder",
    x: 170,
    y: 150,
  },
  {
    id: "grunder-lagesord",
    title: "Lägesord",
    area: "Grunder & hälsningar",
    href: "/exercises/grunder",
    x: 690,
    y: 370,
  },
  {
    id: "grunder-lyssna",
    title: "Lyssna och hitta",
    area: "Grunder & hälsningar",
    href: "/exercises/grunder",
    x: 1080,
    y: 170,
  },
  {
    id: "en-eller-ett",
    title: "En eller ett?",
    area: "En eller ett?",
    href: "/exercises/en-eller-ett",
    x: 420,
    y: 290,
  },
  {
    id: "stavning-choice",
    title: "Rätt stavning",
    area: "Stavning",
    href: "/exercises/stavningsjakten",
    x: 920,
    y: 440,
  },
  {
    id: "stavning-fill",
    title: "Fyll i bokstäverna",
    area: "Stavning",
    href: "/exercises/stavningsjakten",
    x: 460,
    y: 100,
  },
  {
    id: "stavning-double",
    title: "En eller två?",
    area: "Stavning",
    href: "/exercises/stavningsjakten",
    x: 180,
    y: 440,
  },
  {
    id: "mening-bygg",
    title: "Bygg en mening",
    area: "Meningsbyggnad",
    href: "/exercises/meningsbyggnad",
    x: 1190,
    y: 380,
  },
  {
    id: "mening-valj",
    title: "Välj rätt mening",
    area: "Meningsbyggnad",
    href: "/exercises/meningsbyggnad",
    x: 790,
    y: 120,
  },
  {
    id: "mening-saknas",
    title: "Ordet som saknas",
    area: "Meningsbyggnad",
    href: "/exercises/meningsbyggnad",
    x: 440,
    y: 510,
  },
] as const;

export type TrailExerciseId = (typeof TRAIL_EXERCISES)[number]["id"];

export type LearnedExercise = {
  id: TrailExerciseId;
  learnedAt: string;
  bend: number;
};

export function getLearningTrail(): LearnedExercise[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(LEARNING_TRAIL_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    const validIds = new Set<string>(
      TRAIL_EXERCISES.map((exercise) => exercise.id),
    );

    const seen = new Set<string>();
    const result: LearnedExercise[] = [];

    for (const entry of parsed) {
      if (typeof entry !== "object" || entry === null) continue;

      const item = entry as Record<string, unknown>;

      if (
        typeof item.id !== "string" ||
        !validIds.has(item.id) ||
        seen.has(item.id) ||
        typeof item.learnedAt !== "string" ||
        !Number.isFinite(Date.parse(item.learnedAt)) ||
        typeof item.bend !== "number" ||
        !Number.isFinite(item.bend) ||
        Math.abs(item.bend) > 90
      ) {
        continue;
      }

      seen.add(item.id);

      result.push({
        id: item.id as TrailExerciseId,
        learnedAt: item.learnedAt,
        bend: item.bend,
      });
    }

    return result;
  } catch {
    return [];
  }
}

/**
 * Call once when a scored exercise round finishes.
 * This does not change total answers or completed-round counters.
 */
export function recordExerciseResult(
  id: TrailExerciseId,
  correct: number,
  total: number,
): void {
  if (typeof window === "undefined") return;

  if (
    !Number.isSafeInteger(correct) ||
    !Number.isSafeInteger(total) ||
    total <= 0 ||
    correct < 0 ||
    correct > total ||
    correct / total < 0.8
  ) {
    return;
  }

  const trail = getLearningTrail();

  // Once a stone is unlocked, keep its original position in the trail.
  if (trail.some((exercise) => exercise.id === id)) return;

  const direction = Math.random() < 0.5 ? -1 : 1;
  const bend = direction * (35 + Math.random() * 45);

  trail.push({
    id,
    learnedAt: new Date().toISOString(),
    bend,
  });

  try {
    localStorage.setItem(LEARNING_TRAIL_KEY, JSON.stringify(trail));
    window.dispatchEvent(new Event(LEARNING_TRAIL_EVENT));
  } catch (error) {
    console.error("Could not save learning trail:", error);
  }
}
