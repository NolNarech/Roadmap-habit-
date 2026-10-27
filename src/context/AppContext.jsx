import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { todayISO, uid } from '../utils/dateHelpers';
import { buildDefaultTasksForDate } from '../constants/taskTemplates';
import { seedProjects, seedNotes } from '../constants/seedData';
import { fetchRemoteState, saveRemoteState, pingBackend } from '../utils/api';

const STORAGE_KEY = 'dpt_app_state_v1';

function defaultState() {
  return {
    tasks: buildDefaultTasksForDate(todayISO()),
    lessonProgress: {}, // { [lessonId]: { status, notes } }
    projects: seedProjects(),
    notes: seedNotes(),
    sessions: [], // pomodoro sessions: { id, type, minutes, completedAt, date }
    xp: 0,
    unlockedAchievements: [], // ids of badges already awarded (so we only celebrate once)
    theme: 'dark',
    profile: {
      name: 'Narech',
      dailyGoalMinutes: 120,
      avatarUrl: null,
      breakMusicUrl: 'https://youtu.be/516xVgJGvyI',
      breakMusicEnabled: true, // auto-play the break music when a focus session ends
    },
  };
}

// Fills in any fields missing from an older/partial saved blob (LocalStorage
// or MongoDB) and makes sure today always has its default task set, no
// matter which source the state came from.
function normalizeState(parsed) {
  if (!parsed || typeof parsed !== 'object') return defaultState();
  const base = defaultState();
  const merged = { ...base, ...parsed, profile: { ...base.profile, ...(parsed.profile || {}) } };
  const todayKey = todayISO();
  if (!merged.tasks?.some((t) => t.date === todayKey)) {
    merged.tasks = [...(merged.tasks || []), ...buildDefaultTasksForDate(todayKey)];
  }
  if (typeof merged.xp !== 'number') merged.xp = 0;
  if (!Array.isArray(merged.unlockedAchievements)) merged.unlockedAchievements = [];
  return merged;
}

// ---------- Initial state / lazy load from LocalStorage ----------
// Used only for the very first paint (instant, synchronous, works offline).
// The real source of truth is MongoDB — see the sync effect in AppProvider,
// which fetches it right after mount and hydrates over this if found.
function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch (err) {
    console.warn('Failed to load saved state, starting fresh.', err);
  }
  return defaultState();
}

const initialState = loadInitialState();

// ---------- Reducer ----------
function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
      };
    }
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.updates } : t)),
      };
    }
    case 'ADD_TASK': {
      return { ...state, tasks: [...state.tasks, action.task] };
    }
    case 'DELETE_TASK': {
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    }
    case 'START_TASK_TIMER': {
      // Real-time tracking: marks the moment the person actually starts
      // writing/practicing, instead of typing a minute count by hand.
      // Stored on the task itself (not local component state) so it keeps
      // running even across a page refresh or navigating away.
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, trackingStartedAt: Date.now() } : t
        ),
      };
    }
    case 'STOP_TASK_TIMER': {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id || !t.trackingStartedAt) return t;
          const elapsedMs = Date.now() - t.trackingStartedAt;
          const elapsedMinutes = Math.max(0, Math.round(elapsedMs / 60000));
          return {
            ...t,
            trackingStartedAt: null,
            timeSpentMinutes: (t.timeSpentMinutes || 0) + elapsedMinutes,
          };
        }),
      };
    }
    case 'ENSURE_TASKS_FOR_DATE': {
      const exists = state.tasks.some((t) => t.date === action.date);
      if (exists) return state;
      return { ...state, tasks: [...state.tasks, ...buildDefaultTasksForDate(action.date)] };
    }
    case 'UPSERT_TASKS': {
      // Adds new tasks or overwrites existing ones by id. Used by the Daily
      // Learning Checklist so submitted items flow into the same `tasks`
      // array that Dashboard/Analytics/streak stats already derive from.
      const incomingIds = new Set(action.tasks.map((t) => t.id));
      const kept = state.tasks.filter((t) => !incomingIds.has(t.id));
      return { ...state, tasks: [...kept, ...action.tasks] };
    }
    case 'ADD_XP': {
      return { ...state, xp: Math.max(0, state.xp + action.amount) };
    }
    case 'UNLOCK_ACHIEVEMENTS': {
      const newIds = action.ids.filter((id) => !state.unlockedAchievements.includes(id));
      if (newIds.length === 0) return state;
      return { ...state, unlockedAchievements: [...state.unlockedAchievements, ...newIds] };
    }
    case 'SET_LESSON_STATUS': {
      const wasCompleted = state.lessonProgress[action.lessonId]?.status === 'Completed';
      const nowCompleted = action.status === 'Completed';
      // Award XP once, the moment a lesson newly flips to completed — not on
      // every click, and not if it's un-marked and re-marked back and forth
      // to farm XP within the same already-awarded transition.
      const xpBonus = !wasCompleted && nowCompleted ? 40 : 0;
      return {
        ...state,
        xp: state.xp + xpBonus,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: { ...state.lessonProgress[action.lessonId], status: action.status },
        },
      };
    }
    case 'SET_LESSON_NOTES': {
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: { ...state.lessonProgress[action.lessonId], notes: action.notes },
        },
      };
    }
    case 'TOGGLE_STEP': {
      const current = state.lessonProgress[action.lessonId] || {};
      const completedSteps = current.completedSteps || [];
      const nextSteps = completedSteps.includes(action.stepId)
        ? completedSteps.filter((id) => id !== action.stepId)
        : [...completedSteps, action.stepId];
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [action.lessonId]: { ...current, completedSteps: nextSteps },
        },
      };
    }
    case 'ADD_PROJECT': {
      return { ...state, projects: [action.project, ...state.projects] };
    }
    case 'UPDATE_PROJECT': {
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.id ? { ...p, ...action.updates } : p)),
      };
    }
    case 'DELETE_PROJECT': {
      return { ...state, projects: state.projects.filter((p) => p.id !== action.id) };
    }
    case 'TOGGLE_PROJECT_TASK': {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) => (t.id === action.taskId ? { ...t, completed: !t.completed } : t)),
              }
            : p
        ),
      };
    }
    case 'ADD_NOTE': {
      return { ...state, notes: [action.note, ...state.notes] };
    }
    case 'UPDATE_NOTE': {
      return { ...state, notes: state.notes.map((n) => (n.id === action.id ? { ...n, ...action.updates } : n)) };
    }
    case 'DELETE_NOTE': {
      return { ...state, notes: state.notes.filter((n) => n.id !== action.id) };
    }
    case 'ADD_SESSION': {
      return { ...state, sessions: [action.session, ...state.sessions] };
    }
    case 'SET_THEME': {
      return { ...state, theme: action.theme };
    }
    case 'UPDATE_PROFILE': {
      return { ...state, profile: { ...state.profile, ...action.updates } };
    }
    case 'HYDRATE': {
      // Replaces local state with whatever came back from MongoDB on load,
      // so a second device/browser picks up right where the first left off.
      return normalizeState(action.state);
    }
    case 'RESET_ALL': {
      window.localStorage.removeItem(STORAGE_KEY);
      return defaultState();
    }
    default:
      return state;
  }
}

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);
const AppSyncContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // 'connecting' | 'synced' | 'saving' | 'offline'
  const [syncStatus, setSyncStatus] = useState('connecting');
  const saveTimerRef = useRef(null);
  const hydratedRef = useRef(false); // guards against saving right back what we just hydrated

  // Persist to LocalStorage on every change — instant, and the offline
  // fallback if MongoDB is unreachable.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to persist state', err);
    }
  }, [state]);

  // On mount: check the backend, pull down whatever's saved in MongoDB, and
  // hydrate over the LocalStorage snapshot so a second browser/device shows
  // the same data. If MongoDB has nothing yet (first run), push the current
  // (LocalStorage-seeded) state up so it becomes the source of truth.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const reachable = await pingBackend();
      if (cancelled) return;
      if (!reachable) {
        setSyncStatus('offline');
        return;
      }
      const remote = await fetchRemoteState();
      if (cancelled) return;
      if (remote) {
        hydratedRef.current = true;
        dispatch({ type: 'HYDRATE', state: remote });
      } else {
        await saveRemoteState(state);
      }
      setSyncStatus('synced');
    })();
    return () => {
      cancelled = true;
    };
    // Runs once on mount only — this is the initial handshake, not a
    // response to every state change (that's the debounced effect below).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push every subsequent change to MongoDB, debounced so rapid edits
  // (typing, dragging a slider, etc.) don't fire a request per keystroke.
  useEffect(() => {
    if (syncStatus === 'connecting') return; // wait for the initial handshake above
    if (hydratedRef.current) {
      // Skip the one save that would otherwise immediately follow HYDRATE —
      // we just pulled this exact data down, no need to push it back up.
      hydratedRef.current = false;
      return;
    }
    if (syncStatus === 'offline') return; // don't hammer a server that's down

    setSyncStatus('saving');
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const ok = await saveRemoteState(state);
      setSyncStatus(ok ? 'synced' : 'offline');
    }, 800);

    return () => clearTimeout(saveTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Keep <html> class in sync with theme for Tailwind dark mode.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(state.theme === 'dark' ? 'dark' : 'light');
  }, [state.theme]);

  // Make sure today always has a task set (handles app left open across midnight).
  useEffect(() => {
    dispatch({ type: 'ENSURE_TASKS_FOR_DATE', date: todayISO() });
    const interval = setInterval(() => dispatch({ type: 'ENSURE_TASKS_FOR_DATE', date: todayISO() }), 60_000);
    return () => clearInterval(interval);
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <AppStateContext.Provider value={value}>
      <AppDispatchContext.Provider value={dispatch}>
        <AppSyncContext.Provider value={syncStatus}>{children}</AppSyncContext.Provider>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

/** 'connecting' | 'synced' | 'saving' | 'offline' — for a small status badge in the UI. */
export function useSyncStatus() {
  const ctx = useContext(AppSyncContext);
  if (ctx === null) throw new Error('useSyncStatus must be used within AppProvider');
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}

export { uid };
