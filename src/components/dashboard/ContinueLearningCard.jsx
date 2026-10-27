import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, PartyPopper } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { ROADMAP, LESSON_STATUS } from '../../constants/roadmapData';

/** First lesson (in roadmap order) that isn't marked Completed yet. */
function findNextLesson(lessonProgress) {
  for (const section of ROADMAP) {
    for (const lesson of section.lessons) {
      if (lessonProgress[lesson.id]?.status !== LESSON_STATUS.COMPLETED) {
        return { lesson, section };
      }
    }
  }
  return null;
}

function findNextStep(lesson, lessonProgress) {
  const completedSteps = lessonProgress[lesson.id]?.completedSteps || [];
  return lesson.steps?.find((s) => !completedSteps.includes(s.id)) || lesson.steps?.[0];
}

export function ContinueLearningCard({ lessonProgress }) {
  const next = findNextLesson(lessonProgress);

  if (!next) {
    return (
      <Card className="flex flex-col items-center justify-center text-center py-8">
        <PartyPopper size={28} className="text-amber-400 mb-2" />
        <p className="text-sm font-semibold text-surface-100">Every roadmap lesson is complete!</p>
        <p className="text-xs text-surface-400 mt-1">You've cleared the whole roadmap. Legendary.</p>
      </Card>
    );
  }

  const step = findNextStep(next.lesson, lessonProgress);

  return (
    <Card>
      <CardHeader title="Continue Learning" subtitle={next.section.title} />
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
          <PlayCircle size={18} className="text-accent-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-surface-50">{next.lesson.title}</p>
          {step && (
            <p className="text-xs text-surface-400 mt-0.5 truncate">
              Next: <span className="text-surface-300">{step.title}</span>
            </p>
          )}
        </div>
      </div>
      <Link to="/roadmap" className="block mt-4">
        <Button className="w-full justify-center">
          Continue <ArrowRight size={15} />
        </Button>
      </Link>
    </Card>
  );
}
