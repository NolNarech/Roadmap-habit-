import { useState, useMemo } from 'react';
import { Plus, Search, StickyNote } from 'lucide-react';
import { useAppState, useAppDispatch, uid } from '../context/AppContext';
import { NoteCard } from '../components/notes/NoteCard';
import { NoteEditor } from '../components/notes/NoteEditor';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { TextInput } from '../components/ui/FormFields';
import { todayISO } from '../utils/dateHelpers';

export default function Notes() {
  const { notes } = useAppState();
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState('edit');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }, [notes, query]);

  const handleCreate = () => {
    setEditing({ id: uid(), title: '', category: 'coding', content: '', date: todayISO() });
    setMode('create');
  };
  const handleEdit = (note) => {
    setEditing(note);
    setMode('edit');
  };
  const handleSave = (note) => {
    if (mode === 'create') dispatch({ type: 'ADD_NOTE', note });
    else dispatch({ type: 'UPDATE_NOTE', id: note.id, updates: note });
    setEditing(null);
  };
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_NOTE', id });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <TextInput
            className="pl-9"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>
          <Plus size={16} /> New Note
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title={query ? 'No matching notes' : 'No notes yet'}
          description={query ? 'Try a different search term.' : 'Capture what you learn as you go.'}
          action={!query && <Button onClick={handleCreate}><Plus size={16} /> New Note</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <NoteEditor
        note={editing}
        open={!!editing}
        mode={mode}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
