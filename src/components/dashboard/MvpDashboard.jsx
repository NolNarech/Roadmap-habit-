import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FileDown, Music2, Play } from 'lucide-react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { useTicker } from '../../hooks/useTicker';
import { useBreakMusic } from '../../hooks/useBreakMusic';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { exportVocabPdf } from '../../utils/vocabPdf';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const FOCUS_SECONDS = 50 * 60; // 50-minute study session
const BREAK_SECONDS = 10 * 60; // 10-minute break

const DEFAULT_TASKS = [
  { id: 'english', label: 'Active English practice' },
  { id: 'coding', label: 'HTML / CSS coding' },
  { id: 'shadowing', label: 'Video shadowing' },
];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // e.g. "2026-08-31"
}

// ---------------------------------------------------------------------------
// 1. Pomodoro Timer (50 min focus / 10 min break)
// ---------------------------------------------------------------------------
function PomodoroTimer() {
  const { profile } = useAppState();
  const dispatch = useAppDispatch();
  const musicEnabled = profile.breakMusicEnabled !== false;

  const [phase, setPhase] = useState('focus'); // 'focus' | 'break'
  const [isRunning, setIsRunning] = useState(false);
  // While running, the countdown is derived from an absolute end time, so it
  // stays exact even if the browser slows this tab down in the background.
  const [endsAt, setEndsAt] = useState(null);
  const [remaining, setRemaining] = useState(FOCUS_SECONDS); // seconds, used while stopped/paused
  const [now, setNow] = useState(() => Date.now());

  const music = useBreakMusic({ url: profile.breakMusicUrl, enabled: musicEnabled });
  const { play: playMusic, pause: pauseMusic, stop: stopMusic, prepare: prepareMusic } = music;

  useTicker(() => setNow(Date.now()), isRunning);

  const secondsLeft = isRunning && endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : remaining;
  const totalSeconds = phase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
  const progressPct = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  // Time's up: flip to the other phase. The next phase is timed from the exact
  // end of this one, so no seconds are lost or gained.
  useEffect(() => {
    if (!isRunning || endsAt == null || now < endsAt) return;
    const nextPhase = phase === 'focus' ? 'break' : 'focus';
    const nextSeconds = nextPhase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS;
    setPhase(nextPhase);
    setRemaining(nextSeconds);
    // Focus -> break: keep running automatically, no click needed.
    // Break -> focus: stop and wait for a deliberate Start click.
    if (nextPhase === 'break') {
      setEndsAt(endsAt + nextSeconds * 1000);
    } else {
      setIsRunning(false);
      setEndsAt(null);
    }
  }, [now, isRunning, endsAt, phase]);

  // Music rule: it plays exactly while a break is running. That is what makes
  // it start by itself when the 50 minutes end, and stop when the break ends,
  // is paused, or is reset.
  useEffect(() => {
    if (!musicEnabled) stopMusic();
    else if (phase === 'break' && isRunning) playMusic();
    else if (phase === 'break') pauseMusic();
    else stopMusic();
  }, [phase, isRunning, musicEnabled, playMusic, pauseMusic, stopMusic]);

  const toggleRunning = useCallback(() => {
    if (isRunning) {
      setRemaining(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
      setIsRunning(false);
      setEndsAt(null);
    } else {
      // Pressing Start is the click that lets the browser allow music later.
      prepareMusic();
      const start = Date.now();
      setNow(start);
      setEndsAt(start + remaining * 1000);
      setIsRunning(true);
    }
  }, [isRunning, endsAt, remaining, prepareMusic]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setEndsAt(null);
    setRemaining(phase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  }, [phase]);

  // Manually switch between focus/break without waiting for the countdown.
  const switchPhase = useCallback((newPhase) => {
    setIsRunning(false);
    setEndsAt(null);
    setPhase(newPhase);
    setRemaining(newPhase === 'focus' ? FOCUS_SECONDS : BREAK_SECONDS);
  }, []);

  const showPlayer = musicEnabled && music.videoId && phase === 'break';

  return (
    <Card>
      <CardHeader
        title="Study Timer"
        subtitle={phase === 'focus' ? '50-minute focus session' : '10-minute break'}
      />

      {/* Focus / Break toggle */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={phase === 'focus' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => switchPhase('focus')}
        >
          Focus
        </Button>
        <Button
          variant={phase === 'break' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => switchPhase('break')}
        >
          Break
        </Button>
      </div>

      {/* Big countdown display */}
      <div className="text-5xl font-bold tabular-nums text-center text-surface-100 mb-4" role="timer">
        {formatTime(secondsLeft)}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-surface-800 overflow-hidden mb-4">
        <div
          className="h-full bg-accent-500 transition-all duration-1000"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" className="flex-1" onClick={toggleRunning}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>

      {/* Break music */}
      <div className="mt-4 pt-4 border-t border-surface-700">
        <label className="flex items-center gap-2 text-xs text-surface-300 cursor-pointer">
          <input
            type="checkbox"
            checked={musicEnabled}
            onChange={(e) => dispatch({ type: 'UPDATE_PROFILE', updates: { breakMusicEnabled: e.target.checked } })}
            className="h-4 w-4 rounded accent-accent-500"
          />
          <Music2 size={13} /> Play my music automatically when focus ends
        </label>

        {musicEnabled && !music.videoId && (
          <p className="text-xs text-amber-400 mt-2">
            No valid YouTube link yet — add one in <Link to="/settings" className="underline">Settings → Break music</Link>.
          </p>
        )}

        {/* The player must stay on the page (not display:none) for the browser to play it.
            It sits off-screen until the break, then shows as a small video. */}
        <div
          ref={music.hostRef}
          className={
            showPlayer
              ? 'mt-3 w-full aspect-video rounded-lg overflow-hidden bg-surface-900'
              : 'fixed -left-[10000px] top-0 w-80 h-48'
          }
        />

        {showPlayer && music.status === 'playing' && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-emerald-400">♪ Playing your break music</span>
            <button onClick={music.pause} className="text-xs text-surface-400 hover:text-surface-100">Stop music</button>
          </div>
        )}
        {showPlayer && music.status === 'blocked' && (
          <div className="mt-2">
            <p className="text-xs text-amber-400 mb-2">Your browser blocked automatic sound. Tap once to play.</p>
            <Button size="sm" className="w-full" onClick={music.play}>
              <Play size={13} /> Play music
            </Button>
          </div>
        )}
        {showPlayer && music.status === 'error' && (
          <p className="text-xs text-rose-400 mt-2">Couldn't load the music player. Check your internet connection and the YouTube link.</p>
        )}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// 2. Daily Routine Checklist (persisted to LocalStorage, resets each day)
// ---------------------------------------------------------------------------
function DailyChecklist() {
  // Store as { date: '2026-08-31', done: { english: true, coding: false, ... } }
  const [state, setState] = useLocalStorage('dailyChecklist', { date: todayKey(), done: {} });

  // If it's a new day, wipe yesterday's checkmarks.
  useEffect(() => {
    if (state.date !== todayKey()) {
      setState({ date: todayKey(), done: {} });
    }
  }, [state.date, setState]);

  const toggleTask = (id) => {
    setState((prev) => ({
      date: todayKey(),
      done: { ...prev.done, [id]: !prev.done[id] },
    }));
  };

  const completedCount = DEFAULT_TASKS.filter((t) => state.done[t.id]).length;

  return (
    <Card>
      <CardHeader
        title="Daily Routine Checklist"
        subtitle={`${completedCount} / ${DEFAULT_TASKS.length} done today`}
      />
      <ul className="space-y-2">
        {DEFAULT_TASKS.map((task) => (
          <li key={task.id}>
            <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface-800 transition-colors">
              <input
                type="checkbox"
                checked={!!state.done[task.id]}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 rounded accent-accent-500"
              />
              <span
                className={
                  state.done[task.id]
                    ? 'text-surface-500 line-through'
                    : 'text-surface-100'
                }
              >
                {task.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// 3. English → Khmer Vocabulary Logger (persisted to LocalStorage, exports to PDF)
// ---------------------------------------------------------------------------
function VocabularyLogger() {
  const [words, setWords] = useLocalStorage('vocabWords', []);
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState(''); // Khmer meaning (stored in the existing `definition` field)
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const addWord = (e) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;

    setWords((prev) => [
      { id: Date.now(), word: word.trim(), definition: meaning.trim(), date: todayKey() },
      ...prev,
    ]);
    setWord('');
    setMeaning('');
  };

  const removeWord = (id) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      await exportVocabPdf(words);
    } catch (err) {
      console.error('PDF export failed', err);
      setExportError('Could not create the PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const todaysCount = words.filter((w) => w.date === todayKey()).length;

  return (
    <Card>
      <CardHeader
        title="Vocabulary Logger"
        subtitle={`${todaysCount} / 5 new words today · ${words.length} saved`}
      />

      <form onSubmit={addWord} className="space-y-2 mb-4">
        <input
          type="text"
          lang="en"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="English word"
          aria-label="English word"
          className="w-full px-3 py-2 rounded-lg bg-surface-800 text-surface-100 placeholder-surface-500 border border-surface-700 focus:border-accent-500 outline-none text-sm"
        />
        <textarea
          lang="km"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="Khmer meaning (ន័យជាភាសាខ្មែរ)"
          aria-label="Khmer meaning"
          rows={2}
          className="w-full px-3 py-2 rounded-lg bg-surface-800 text-surface-100 placeholder-surface-500 border border-surface-700 focus:border-accent-500 outline-none text-sm resize-none leading-relaxed"
        />
        <Button type="submit" variant="primary" size="sm" className="w-full">
          Save Word
        </Button>
      </form>

      <ul className="space-y-2 max-h-56 overflow-y-auto">
        {words.length === 0 && (
          <li className="text-xs text-surface-500">No words saved yet.</li>
        )}
        {words.map((w) => (
          <li
            key={w.id}
            className="flex items-start justify-between gap-2 p-2 rounded-lg bg-surface-800/50"
          >
            <div>
              <p className="text-sm font-semibold text-surface-100">{w.word}</p>
              <p lang="km" className="text-xs text-surface-300 leading-relaxed">{w.definition}</p>
            </div>
            <button
              onClick={() => removeWord(w.id)}
              aria-label={`Delete ${w.word}`}
              className="text-surface-500 hover:text-rose-400 text-xs shrink-0"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-4"
        onClick={handleExport}
        disabled={words.length === 0 || exporting}
      >
        <FileDown size={14} /> {exporting ? 'Creating PDF…' : 'Export PDF'}
      </Button>
      {exportError && <p role="alert" className="text-xs text-rose-400 mt-2">{exportError}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Combined MVP Dashboard — the single export used by App.jsx / Dashboard page
// ---------------------------------------------------------------------------
export default function MvpDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <PomodoroTimer />
      <DailyChecklist />
      <VocabularyLogger />
    </div>
  );
}
