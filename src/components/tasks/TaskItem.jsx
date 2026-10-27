import { useEffect, useState } from 'react';
import { Check, Clock, StickyNote, Trash2, Play, Square } from 'lucide-react';
import { Badge } from '../ui/ProgressBar';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DIFFICULTY_COLOR } from '../../constants/taskTemplates';

const formatElapsed = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

export function TaskItem({ task, onToggle, onEdit, onDelete, onStartTracking, onStopTracking }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isTracking = Boolean(task.trackingStartedAt);
  const [liveSeconds, setLiveSeconds] = useState(
    isTracking ? Math.max(0, Math.floor((Date.now() - task.trackingStartedAt) / 1000)) : 0
  );

  // Real-time stopwatch: ticks every second while this task is being
  // actively worked on, driven off the stored start timestamp (not a
  // counter), so it stays accurate even if the tab was backgrounded.
  useEffect(() => {
    if (!isTracking) {
      setLiveSeconds(0);
      return;
    }
    const update = () => setLiveSeconds(Math.max(0, Math.floor((Date.now() - task.trackingStartedAt) / 1000)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [isTracking, task.trackingStartedAt]);

  return (
    <div
      className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-colors ${
        task.completed ? 'bg-surface-800/40 border-surface-700/60' : 'bg-surface-850 border-surface-700 hover:border-surface-600'
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
          task.completed ? 'bg-accent-500 border-accent-500' : 'border-surface-500 hover:border-accent-400'
        }`}
      >
        {task.completed && <Check size={13} className="text-surface-950" strokeWidth={3} />}
      </button>

      <button className="flex-1 min-w-0 text-left" onClick={() => onEdit(task)}>
        <p className={`text-sm font-medium ${task.completed ? 'text-surface-500 line-through' : 'text-surface-100'}`}>
          {task.title}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <Badge className={DIFFICULTY_COLOR[task.difficulty]}>{task.difficulty}</Badge>
          {isTracking ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {formatElapsed(liveSeconds)} live
            </span>
          ) : (
            task.timeSpentMinutes > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-surface-400 font-mono">
                <Clock size={11} /> {task.timeSpentMinutes}m
              </span>
            )
          )}
          {task.notes && (
            <span className="inline-flex items-center gap-1 text-[11px] text-surface-400">
              <StickyNote size={11} /> note
            </span>
          )}
        </div>
      </button>

      {onStartTracking && onStopTracking && (
        <button
          onClick={() => (isTracking ? onStopTracking(task.id) : onStartTracking(task.id))}
          aria-label={isTracking ? 'Stop live tracking and save time' : 'Start tracking time in real time'}
          title={isTracking ? 'Stop — saves elapsed time' : 'Start — tracks time in real time as you work'}
          className={`mt-0.5 p-1.5 rounded-lg border transition-colors shrink-0 ${
            isTracking
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
              : 'border-surface-700 text-surface-400 hover:text-accent-300 hover:border-accent-400'
          }`}
        >
          {isTracking ? <Square size={13} /> : <Play size={13} />}
        </button>
      )}

      <button
        onClick={() => setConfirmingDelete(true)}
        className="opacity-0 group-hover:opacity-100 text-surface-500 hover:text-rose-400 transition-opacity p-1"
        aria-label="Delete task"
      >
        <Trash2 size={15} />
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete task?"
        message={`"${task.title}" will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete(task.id);
        }}
      />
    </div>
  );
}
