import { Circle, CircleDot, CircleCheck, StickyNote } from 'lucide-react';
import { LESSON_STATUS } from '../../constants/roadmapData';
import { ProgressBar } from '../ui/ProgressBar';

const STATUS_STYLE = {
  [LESSON_STATUS.NOT_STARTED]: { icon: Circle, text: 'text-surface-400', bg: 'bg-surface-800 border-surface-700' },
  [LESSON_STATUS.LEARNING]: { icon: CircleDot, text: 'text-amber-400', bg: 'bg-amber-500/5 border-amber-500/30' },
  [LESSON_STATUS.COMPLETED]: { icon: CircleCheck, text: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/30' },
};

export function LessonCard({ lesson, status, hasNotes, completedStepCount, onClick }) {
  const style = STATUS_STYLE[status] || STATUS_STYLE[LESSON_STATUS.NOT_STARTED];
  const Icon = style.icon;
  const totalSteps = lesson.steps?.length || 0;
  const stepPct = totalSteps ? (completedStepCount / totalSteps) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${style.bg}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <Icon size={17} className={`${style.text} mt-0.5 shrink-0`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-surface-100 truncate">{lesson.title}</p>
            <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{lesson.description}</p>
          </div>
        </div>
        {hasNotes && <StickyNote size={13} className="text-surface-500 shrink-0 mt-1" />}
      </div>

      {totalSteps > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-surface-500 mb-1">
            <span>Steps</span>
            <span className="font-mono">{completedStepCount}/{totalSteps}</span>
          </div>
          <ProgressBar value={stepPct} color={status === LESSON_STATUS.COMPLETED ? 'emerald' : 'accent'} height="h-1.5" />
        </div>
      )}

      <span className={`inline-block mt-3 text-[11px] font-medium ${style.text}`}>{status}</span>
    </button>
  );
}
