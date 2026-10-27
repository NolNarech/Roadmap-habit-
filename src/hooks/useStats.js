import { useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { lastNDays, calculateStreak, todayISO } from '../utils/dateHelpers';
import { CATEGORIES } from '../constants/taskTemplates';
import { ROADMAP, LESSON_STATUS } from '../constants/roadmapData';

/**
 * Central place for every derived number shown across Dashboard/Analytics.
 * Keeping this logic in one hook avoids duplicating stat math in each page.
 */
export function useStats() {
  const state = useAppState();
  const { tasks, sessions, lessonProgress } = state;

  return useMemo(() => {
    const today = todayISO();

    // --- Time totals (minutes) ---
    const codingMinutes = tasks
      .filter((t) => t.category === CATEGORIES.CODING)
      .reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0);
    const englishMinutes = tasks
      .filter((t) => t.category === CATEGORIES.ENGLISH)
      .reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0);
    const totalMinutes = codingMinutes + englishMinutes;

    // Daily study target counts EVERYTHING logged today in one total: task
    // time (coding + english) plus any completed focus/break timer sessions —
    // not just tasks on their own.
    const todayTaskMinutes = tasks
      .filter((t) => t.date === today)
      .reduce((sum, t) => sum + (t.timeSpentMinutes || 0), 0);
    const todaySessionMinutes = sessions
      .filter((s) => s.date === today && s.type === 'focus')
      .reduce((sum, s) => sum + (s.minutes || 0), 0);
    const todayMinutes = todayTaskMinutes + todaySessionMinutes;

    // --- Completion ---
    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const todayTasks = tasks.filter((t) => t.date === today);
    const todayCompleted = todayTasks.filter((t) => t.completed).length;

    // --- Streak: days with at least one completed task or focus session ---
    const activeDates = Array.from(
      new Set([
        ...tasks.filter((t) => t.completed).map((t) => t.date),
        ...sessions.filter((s) => s.type === 'focus').map((s) => s.date),
      ])
    );
    const streak = calculateStreak(activeDates);

    // --- Roadmap progress ---
    const allLessons = ROADMAP.flatMap((section) => section.lessons.map((l) => ({ ...l, sectionId: section.id })));
    const codingLessons = allLessons.filter((l) => l.sectionId !== 'english');
    const englishLessons = allLessons.filter((l) => l.sectionId === 'english');

    const pctComplete = (lessons) => {
      if (lessons.length === 0) return 0;
      const done = lessons.filter((l) => lessonProgress[l.id]?.status === LESSON_STATUS.COMPLETED).length;
      return Math.round((done / lessons.length) * 100);
    };

    const codingProgress = pctComplete(codingLessons);
    const englishProgress = pctComplete(englishLessons);
    const completedLessons = allLessons.filter((l) => lessonProgress[l.id]?.status === LESSON_STATUS.COMPLETED).length;

    // --- Weekly chart data (last 7 days) ---
    const weekly = lastNDays(7).map((date) => {
      const dayTasks = tasks.filter((t) => t.date === date);
      const coding = dayTasks
        .filter((t) => t.category === CATEGORIES.CODING)
        .reduce((s, t) => s + (t.timeSpentMinutes || 0), 0);
      const english = dayTasks
        .filter((t) => t.category === CATEGORIES.ENGLISH)
        .reduce((s, t) => s + (t.timeSpentMinutes || 0), 0);
      return { date, coding: Math.round(coding / 60 * 10) / 10, english: Math.round(english / 60 * 10) / 10 };
    });

    // --- Focus sessions ---
    const focusSessions = sessions.filter((s) => s.type === 'focus');
    const totalFocusMinutes = focusSessions.reduce((s, sess) => s + sess.minutes, 0);

    return {
      codingMinutes,
      englishMinutes,
      totalMinutes,
      todayMinutes,
      completedTasks,
      totalTasks,
      todayCompleted,
      todayTotal: todayTasks.length,
      streak,
      codingProgress,
      englishProgress,
      completedLessons,
      totalLessons: allLessons.length,
      weekly,
      totalFocusMinutes,
      focusSessionCount: focusSessions.length,
    };
  }, [tasks, sessions, lessonProgress]);
}
