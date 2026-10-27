import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Field, TextInput, Textarea, Select } from '../ui/FormFields';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { DIFFICULTY, CATEGORY_META } from '../../constants/taskTemplates';

export function TaskForm({ task, open, onClose, onSave, onDelete, mode = 'edit' }) {
  const [form, setForm] = useState(task);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => setForm(task), [task]);

  if (!form) return null;

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Task' : 'Edit Task'}
      footer={
        <>
          {mode === 'edit' && (
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)}>Save Task</Button>
        </>
      }
    >
      <Field label="Task title">
        <TextInput value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Practice coding" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Category">
          <Select value={form.category} onChange={(e) => update('category', e.target.value)}>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Difficulty">
          <Select value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
            {Object.values(DIFFICULTY).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Time spent (minutes)">
          <TextInput
            type="number"
            min="0"
            value={form.timeSpentMinutes}
            onChange={(e) => update('timeSpentMinutes', Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Date">
          <TextInput type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
        </Field>
      </div>

      <Field label="Notes">
        <Textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything worth remembering..." />
      </Field>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete task?"
        message={`"${form.title || 'This task'}" will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete(form.id);
        }}
      />
    </Modal>
  );
}
