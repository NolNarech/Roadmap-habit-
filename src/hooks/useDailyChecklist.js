import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch } from '../context/AppContext';
import { todayISO } from '../utils/dateHelpers';
import { CHECKLIST_SECTIONS, MINUTES_PER_CHECKLIST_ITEM } from '../constants/dailyChecklistData';
import { DIFFICULTY } from '../constants/taskTemplates';

const STORAGE_KEY = 'dpt_daily_checklist_v1';

/** A brand-new, unsubmitted checklist record for the given date. */
function freshRecord(date) {
  return { date, checked: {}, submitted: false, submittedAt: null };
}

function loadRecord() {
  const today = todayISO();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshRecord(today);
    const parsed = JSON.parse(raw);
    // New day → start with a clean, unlocked checklist. Previous days'
    // submissions already live in the app's `tasks` state for stats/history.
    if (!parsed || parsed.date !== today) return freshRecord(today);
    return parsed;
  } catch (err) {
    console.warn('Failed to load saved checklist, starting fresh.', err);
    return freshRecord(today);
  }
}

/**
 * Drives the "Today's Learning Checklist" widget:
 * - Persists checked items + submission status to LocalStorage, scoped to today.
 * - On submit, pushes completed items into the global app state as real tasks
 *   (via UPSERT_TASKS) so Dashboard/Weekly/Monthly/Streak/Study-hour stats,
 *   which already derive from that shared task list, update automatically.
 * - Resets itself the moment the calendar date changes.
 */
export function useDailyChecklist() {
  const dispatch = useAppDispatch();
  const [record, setRecord] = useState(loadRecord);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text }

  // Persist every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (err) {
      console.warn('Failed to save checklist', err);
    }
  }, [record]);

  // Detect midnight rollover while the app stays open: start a fresh,
  // unlocked checklist for the new day.
  useEffect(() => {
    const interval = setInterval(() => {
      const today = todayISO();
      setRecord((prev) => (prev.date === today ? prev : freshRecord(today)));
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const toggleItem = useCallback((itemId) => {
    setRecord((prev) => {
      if (prev.submitted) return prev; // locked once submitted for the day
      return { ...prev, checked: { ...prev.checked, [itemId]: !prev.checked[itemId] } };
    });
    setStatusMessage(null);
  }, []);

  const checkedCount = useMemo(
    () => Object.values(record.checked).filter(Boolean).length,
    [record.checked]
  );

  const submit = useCallback(() => {
    if (record.submitted) return;

    if (checkedCount === 0) {
      setStatusMessage({ type: 'error', text: 'Please complete at least one task before submitting.' });
      return;
    }

    const date = record.date;
    const tasksToUpsert = [];
    CHECKLIST_SECTIONS.forEach((section) => {
      section.items.forEach((item) => {
        if (record.checked[item.id]) {
          tasksToUpsert.push({
            id: `${date}-checklist-${item.id}`,
            date,
            category: section.category,
            title: item.label,
            completed: true,
            difficulty: DIFFICULTY.MEDIUM,
            timeSpentMinutes: MINUTES_PER_CHECKLIST_ITEM,
            notes: 'Logged from Daily Learning Checklist',
          });
        }
      });
    });

    dispatch({ type: 'UPSERT_TASKS', tasks: tasksToUpsert });

    setRecord((prev) => ({ ...prev, submitted: true, submittedAt: new Date().toISOString() }));
    setStatusMessage({ type: 'success', text: "Today's progress has been saved successfully!" });
  }, [record, checkedCount, dispatch]);

  return {
    sections: CHECKLIST_SECTIONS,
    checked: record.checked,
    submitted: record.submitted,
    submittedAt: record.submittedAt,
    checkedCount,
    toggleItem,
    submit,
    statusMessage,
  };
}
