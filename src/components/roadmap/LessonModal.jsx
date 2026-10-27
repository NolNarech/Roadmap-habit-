import { useState, useEffect } from 'react';
import { SquarePlay, Check, Dumbbell, ExternalLink } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field, Textarea, Select } from '../ui/FormFields';
import { Button } from '../ui/Button';
import { LESSON_STATUS } from '../../constants/roadmapData';
import { youtubeSearchUrl } from '../../utils/dateHelpers';

export function LessonModal({ lesson, progress, open, onClose, onSave, onToggleStep }) {
  const [status, setStatus] = useState(LESSON_STATUS.NOT_STARTED);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (lesson) {
      setStatus(progress?.status || LESSON_STATUS.NOT_STARTED);
      setNotes(progress?.notes || '');
    }
  }, [lesson, progress]);

  if (!lesson) return null;

  const completedSteps = progress?.completedSteps || [];
  const doneCount = completedSteps.length;
  const totalSteps = lesson.steps.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={lesson.title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={() => onSave(lesson.id, status, notes)}>Save</Button>
        </>
      }
    >
      <p className="text-sm text-surface-400 mb-4">{lesson.description}</p>

      {/* Step 0: the full course video for this whole topic — a specific,
          verified link, not a generic search. */}
      <a
        href={lesson.videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-5 hover:bg-rose-500/15 transition-colors"
      >
        <SquarePlay size={18} className="text-rose-400 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-rose-300">Start here: full free course</p>
          <p className="text-xs text-surface-400 mt-0.5 truncate">{lesson.videoTitle}</p>
        </div>
        <ExternalLink size={14} className="text-rose-400 shrink-0 mt-0.5" />
      </a>

      {/* Ordered curriculum: watch the narrow clip for this step, do the
          practice task, then check it off. Numbered so the path is obvious. */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-surface-200 uppercase tracking-wide">Step-by-step path</p>
          <span className="text-[11px] font-mono text-surface-500">{doneCount}/{totalSteps} done</span>
        </div>
        <div className="space-y-3">
          {lesson.steps.map((step, i) => {
            const done = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className={`rounded-xl border overflow-hidden ${
                  done ? 'bg-emerald-500/5 border-emerald-500/25' : 'bg-surface-800/60 border-surface-700'
                }`}
              >
                <div className="flex items-start gap-3 p-3">
                  <button
                    onClick={() => onToggleStep(lesson.id, step.id)}
                    aria-label={done ? 'Mark step incomplete' : 'Mark step complete'}
                    className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-[11px] font-mono font-semibold transition-colors ${
                      done ? 'bg-emerald-500 border-emerald-500 text-surface-950' : 'border-surface-500 text-surface-400 hover:border-accent-400'
                    }`}
                  >
                    {done ? <Check size={13} strokeWidth={3} /> : i + 1}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${done ? 'text-surface-400 line-through' : 'text-surface-100'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">{step.description}</p>
                    <a
                      href={youtubeSearchUrl(step.videoQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 mt-2"
                    >
                      <SquarePlay size={12} /> Watch this specific topic
                    </a>
                  </div>
                </div>
                {step.practice && (
                  <div className="flex items-start gap-2 px-3 pb-3 pt-0 ml-9">
                    <div className="flex items-start gap-2 bg-surface-900/60 border border-surface-700 rounded-lg p-2.5 w-full">
                      <Dumbbell size={13} className="text-accent-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-surface-300 leading-relaxed">
                        <span className="font-semibold text-accent-300">Try it: </span>
                        {step.practice}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Field label="Status">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {Object.values(LESSON_STATUS).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>

      <Field label="Notes">
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Key takeaways, resources, gotchas..." />
      </Field>
    </Modal>
  );
}
