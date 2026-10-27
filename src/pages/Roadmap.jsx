import { useState } from 'react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { ROADMAP } from '../constants/roadmapData';
import { RoadmapSection } from '../components/roadmap/RoadmapSection';
import { LessonModal } from '../components/roadmap/LessonModal';

export default function Roadmap() {
  const { lessonProgress } = useAppState();
  const dispatch = useAppDispatch();
  const [activeLesson, setActiveLesson] = useState(null);

  const handleSave = (lessonId, status, notes) => {
    dispatch({ type: 'SET_LESSON_STATUS', lessonId, status });
    dispatch({ type: 'SET_LESSON_NOTES', lessonId, notes });
    setActiveLesson(null);
  };

  const handleToggleStep = (lessonId, stepId) => {
    dispatch({ type: 'TOGGLE_STEP', lessonId, stepId });
  };

  return (
    <div className="space-y-10">
      {ROADMAP.map((section) => (
        <RoadmapSection
          key={section.id}
          section={section}
          lessonProgress={lessonProgress}
          onLessonClick={setActiveLesson}
        />
      ))}

      <LessonModal
        lesson={activeLesson}
        progress={activeLesson ? lessonProgress[activeLesson.id] : null}
        open={!!activeLesson}
        onClose={() => setActiveLesson(null)}
        onSave={handleSave}
        onToggleStep={handleToggleStep}
      />
    </div>
  );
}
