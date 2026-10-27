import { LessonCard } from './LessonCard';
import { ProgressBar } from '../ui/ProgressBar';
import { LESSON_STATUS } from '../../constants/roadmapData';

export function RoadmapSection({ section, lessonProgress, onLessonClick }) {
  const completed = section.lessons.filter((l) => lessonProgress[l.id]?.status === LESSON_STATUS.COMPLETED).length;
  const pct = Math.round((completed / section.lessons.length) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-surface-50">{section.title}</h3>
        <span className="text-xs font-mono text-surface-400">{completed}/{section.lessons.length} completed</span>
      </div>
      <div className="mb-4">
        <ProgressBar value={pct} color={section.accent} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {section.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            status={lessonProgress[lesson.id]?.status || LESSON_STATUS.NOT_STARTED}
            hasNotes={!!lessonProgress[lesson.id]?.notes}
            completedStepCount={(lessonProgress[lesson.id]?.completedSteps || []).length}
            onClick={() => onLessonClick(lesson)}
          />
        ))}
      </div>
    </div>
  );
}
