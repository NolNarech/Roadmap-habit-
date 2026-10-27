import { useState, useEffect } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Modal } from '../ui/Modal';
import { Field, TextInput, Textarea, Select } from '../ui/FormFields';
import { Button } from '../ui/Button';
import { ConfirmDialog } from '../ui/ConfirmDialog';

export function NoteEditor({ note, open, onClose, onSave, onDelete, mode = 'edit' }) {
  const [form, setForm] = useState(note);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => setForm(note), [note]);

  if (!form) return null;

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'New Note' : 'Edit Note'}
      footer={
        <>
          {mode === 'edit' && (
            <Button variant="danger" onClick={() => setConfirmingDelete(true)}>Delete</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Note</Button>
        </>
      }
    >
      <Field label="Title">
        <TextInput value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Note title" />
      </Field>
      <Field label="Category">
        <Select value={form.category} onChange={(e) => update('category', e.target.value)}>
          <option value="coding">Coding</option>
          <option value="english">English</option>
        </Select>
      </Field>

      <div className="flex items-center justify-between mb-1.5">
        <span className="block text-xs font-medium text-surface-300">Content (Markdown supported)</span>
        <button
          type="button"
          onClick={() => setShowPreview((p) => !p)}
          className="text-[11px] text-accent-400 hover:text-accent-300 font-medium"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {showPreview ? (
        <div
          className="input-base min-h-[160px] prose-note text-xs text-surface-300 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-surface-100 [&_h2]:mb-1 [&_strong]:text-surface-100 [&_code]:bg-surface-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-accent-300 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_pre]:bg-surface-900 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-1"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(form.content || '', { breaks: true })) }}
        />
      ) : (
        <Textarea
          value={form.content}
          onChange={(e) => update('content', e.target.value)}
          className="min-h-[160px] font-mono text-xs"
          placeholder="## Heading&#10;&#10;Use **bold**, `code`, lists, etc."
        />
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete note?"
        message={`"${form.title || 'This note'}" will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete(form.id);
        }}
      />
    </Modal>
  );
}
