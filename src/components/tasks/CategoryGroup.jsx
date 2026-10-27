import { Code2, Languages } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { ProgressBar } from '../ui/ProgressBar';
import { CATEGORY_META } from '../../constants/taskTemplates';

const ICONS = { Code2, Languages };

export function CategoryGroup({ category, tasks, onToggle, onEdit, onDelete, onStartTracking, onStopTracking }) {
  const meta = CATEGORY_META[category];
  const Icon = ICONS[meta.icon];
  const completed = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? (completed / tasks.length) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.color === 'accent' ? 'bg-accent-500/10 border border-accent-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
            <Icon size={15} className={meta.color === 'accent' ? 'text-accent-400' : 'text-amber-400'} />
          </div>
          <h3 className="text-sm font-semibold text-surface-100">{meta.label}</h3>
        </div>
        <span className="text-xs font-mono text-surface-400">{completed}/{tasks.length}</span>
      </div>
      <ProgressBar value={pct} color={meta.color} />
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            onStartTracking={onStartTracking}
            onStopTracking={onStopTracking}
          />
        ))}
      </div>
    </div>
  );
}
