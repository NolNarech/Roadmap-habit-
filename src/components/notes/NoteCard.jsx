import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useState } from 'react';
import { Code2, Languages, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { formatShortDate } from '../../utils/dateHelpers';

const CATEGORY_ICON = { coding: Code2, english: Languages };

export function NoteCard({ note, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const Icon = CATEGORY_ICON[note.category] || Code2;
  // Sanitize before injecting — note content is user-authored Markdown, so
  // the rendered HTML could otherwise carry a script/onerror payload.
  const html = DOMPurify.sanitize(marked.parse(note.content || '', { breaks: true }));

  return (
    <Card hover className="flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon size={14} className={note.category === 'coding' ? 'text-accent-400 shrink-0' : 'text-amber-400 shrink-0'} />
          <h3 className="text-sm font-semibold text-surface-100 truncate">{note.title}</h3>
        </div>
        <button onClick={() => setConfirmingDelete(true)} className="p-1 text-surface-500 hover:text-rose-400 shrink-0">
          <Trash2 size={14} />
        </button>
      </div>

      <button onClick={() => onEdit(note)} className="text-left flex-1">
        <div
          className="prose-note text-xs text-surface-300 line-clamp-5 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-surface-100 [&_h2]:mb-1 [&_strong]:text-surface-100 [&_code]:bg-surface-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-accent-300 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_pre]:bg-surface-900 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-1"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </button>

      <p className="text-[11px] text-surface-500 mt-3 pt-3 border-t border-surface-700">{formatShortDate(note.date)}</p>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete note?"
        message={`"${note.title}" will be permanently removed.`}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete(note.id);
        }}
      />
    </Card>
  );
}
