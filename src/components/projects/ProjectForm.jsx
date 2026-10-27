import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Field, TextInput, Textarea } from '../ui/FormFields';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { uid } from '../../context/AppContext';

export function ProjectForm({ project, open, onClose, onSave, onDelete, mode = 'edit' }) {
  const [form, setForm] = useState(project);
  const [techInput, setTechInput] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setForm(project);
    setTechInput(project?.technologies?.join(', ') || '');
    setNewTaskTitle('');
  }, [project]);

  if (!form) return null;

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addTask = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    update('tasks', [...(form.tasks || []), { id: uid(), title, completed: false }]);
    setNewTaskTitle('');
  };

  const removeTask = (taskId) => {
    update('tasks', form.tasks.filter((t) => t.id !== taskId));
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const technologies = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({ ...form, technologies });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Project' : 'Edit Project'}
      footer={
        <>
          {mode === 'edit' && (
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>Delete</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Project</Button>
        </>
      }
    >
      <Field label="Project name">
        <TextInput value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Portfolio Website" />
      </Field>
      <Field label="Description">
        <Textarea value={form.description} onChange={(e) => update('description', e.target.value)} />
      </Field>
      <Field label="Technologies" hint="Comma-separated, e.g. React, Node.js, MongoDB">
        <TextInput value={techInput} onChange={(e) => setTechInput(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Progress (%)">
          <TextInput
            type="number"
            min="0"
            max="100"
            value={form.progress}
            onChange={(e) => update('progress', Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
          />
        </Field>
        <Field label="Deadline">
          <TextInput type="date" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
        </Field>
      </div>

      <Field label="Tasks" hint="Break this project into checklist items — shown on the project card.">
        <div className="flex gap-2 mb-2">
          <TextInput
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTask();
              }
            }}
            placeholder="e.g. Set up routing"
          />
          <Button type="button" variant="secondary" onClick={addTask}>
            <Plus size={14} />
          </Button>
        </div>
        {form.tasks.length === 0 ? (
          <p className="text-xs text-surface-500">No tasks yet — add one above.</p>
        ) : (
          <div className="space-y-1.5">
            {form.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-surface-800/60">
                <span className="text-xs text-surface-200 truncate">{task.title}</span>
                <button
                  type="button"
                  onClick={() => removeTask(task.id)}
                  className="text-surface-500 hover:text-rose-400 shrink-0 p-0.5"
                  aria-label={`Remove task "${task.title}"`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Field>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete project?"
        message={`"${form.name || 'This project'}" and its ${form.tasks.length} task${form.tasks.length === 1 ? '' : 's'} will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete(form.id);
        }}
      />
    </Modal>
  );
}
