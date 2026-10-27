import { Check } from 'lucide-react';

export function TaskChecklist({ tasks, onToggle }) {
  if (tasks.length === 0) {
    return <p className="text-xs text-surface-500 py-2">No tasks added yet.</p>;
  }
  return (
    <div className="space-y-1.5">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onToggle(task.id)}
          className="flex items-center gap-2.5 w-full text-left p-2 rounded-lg hover:bg-surface-800 transition-colors"
        >
          <span
            className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              task.completed ? 'bg-accent-500 border-accent-500' : 'border-surface-500'
            }`}
          >
            {task.completed && <Check size={10} className="text-surface-950" strokeWidth={3} />}
          </span>
          <span className={`text-xs ${task.completed ? 'text-surface-500 line-through' : 'text-surface-200'}`}>
            {task.title}
          </span>
        </button>
      ))}
    </div>
  );
}
