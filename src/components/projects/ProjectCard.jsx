import { Calendar, ChevronDown, Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/ProgressBar';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TaskChecklist } from './TaskChecklist';
import { formatShortDate } from '../../utils/dateHelpers';

export function ProjectCard({ project, onToggleTask, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const doneTasks = project.tasks.filter((t) => t.completed).length;

  const daysLeft = Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysLeft < 0;

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-surface-50">{project.name}</h3>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(project)} className="p-1.5 text-surface-500 hover:text-accent-400 rounded-lg hover:bg-surface-800">
            <Pencil size={14} />
          </button>
          <button onClick={() => setConfirmingDelete(true)} className="p-1.5 text-surface-500 hover:text-rose-400 rounded-lg hover:bg-surface-800">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <p className="text-xs text-surface-400 mb-3 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.technologies.map((tech) => (
          <Badge key={tech} className="text-surface-300 bg-surface-800 border-surface-600">{tech}</Badge>
        ))}
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-surface-400">Progress</span>
          <span className="font-mono text-surface-200">{project.progress}%</span>
        </div>
        <ProgressBar value={project.progress} color={project.progress === 100 ? 'emerald' : 'accent'} />
      </div>

      <div className="flex items-center justify-between text-xs text-surface-400 mb-4">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={12} />
          <span className={isOverdue && project.progress < 100 ? 'text-rose-400' : ''}>
            {formatShortDate(project.deadline)} {isOverdue && project.progress < 100 ? '(overdue)' : ''}
          </span>
        </span>
        <span>{doneTasks}/{project.tasks.length} tasks</span>
      </div>

      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex items-center justify-center gap-1 text-xs text-surface-400 hover:text-surface-200 py-2 border-t border-surface-700 mt-auto"
      >
        {expanded ? 'Hide tasks' : 'Show tasks'}
        <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-3">
          <TaskChecklist tasks={project.tasks} onToggle={(taskId) => onToggleTask(project.id, taskId)} />
        </div>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete project?"
        message={`"${project.name}" and its ${project.tasks.length} task${project.tasks.length === 1 ? '' : 's'} will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete(project.id);
        }}
      />
    </Card>
  );
}
