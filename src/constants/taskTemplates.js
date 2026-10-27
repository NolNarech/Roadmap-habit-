// Default daily task templates. Users can add custom tasks on top of these,
// but these define the two core learning tracks: Coding and English.

export const CATEGORIES = {
  CODING: 'coding',
  ENGLISH: 'english',
};

export const CATEGORY_META = {
  [CATEGORIES.CODING]: { label: 'Coding', color: 'accent', icon: 'Code2' },
  [CATEGORIES.ENGLISH]: { label: 'English', color: 'amber', icon: 'Languages' },
};

export const DIFFICULTY = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
};

export const DIFFICULTY_COLOR = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Hard: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
};

export const DEFAULT_TASK_TITLES = {
  [CATEGORIES.CODING]: [
    'Learn new concept',
    'Read documentation',
    'Practice coding',
    'Build project feature',
    'Fix bugs',
    'Review previous lessons',
    'Write notes',
  ],
  [CATEGORIES.ENGLISH]: [
    'Learn vocabulary',
    'Listening practice',
    'Speaking practice',
    'Reading practice',
    'Writing practice',
    'Learn programming English',
  ],
};

/** Builds a fresh set of task objects for a given date. */
export const buildDefaultTasksForDate = (dateISO) => {
  const tasks = [];
  Object.entries(DEFAULT_TASK_TITLES).forEach(([category, titles]) => {
    titles.forEach((title) => {
      tasks.push({
        id: `${dateISO}-${category}-${title.replace(/\s+/g, '-').toLowerCase()}`,
        date: dateISO,
        category,
        title,
        completed: false,
        difficulty: DIFFICULTY.MEDIUM,
        timeSpentMinutes: 0,
        trackingStartedAt: null,
        notes: '',
      });
    });
  });
  return tasks;
};
