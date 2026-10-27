import { useMemo, useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useAppState, useAppDispatch, uid } from '../context/AppContext';
import { CategoryGroup } from '../components/tasks/CategoryGroup';
import { TaskForm } from '../components/tasks/TaskForm';
import { Button } from '../components/ui/Button';
import { CATEGORIES, DIFFICULTY } from '../constants/taskTemplates';
import { todayISO, formatShortDate } from '../utils/dateHelpers';

export default function Tasks() {
  const { tasks } = useAppState();
  const dispatch = useAppDispatch();
  const [date, setDate] = useState(todayISO());
  const [editingTask, setEditingTask] = useState(null);
  const [modalMode, setModalMode] = useState('edit');

  const dayTasks = useMemo(() => tasks.filter((t) => t.date === date), [tasks, date]);
  const codingTasks = dayTasks.filter((t) => t.category === CATEGORIES.CODING);
  const englishTasks = dayTasks.filter((t) => t.category === CATEGORIES.ENGLISH);

  const shiftDate = (delta) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    const next = d.toISOString().slice(0, 10);
    setDate(next);
    dispatch({ type: 'ENSURE_TASKS_FOR_DATE', date: next });
  };

  const handleToggle = (id) => dispatch({ type: 'TOGGLE_TASK', id });
  const handleStartTracking = (id) => dispatch({ type: 'START_TASK_TIMER', id });
  const handleStopTracking = (id) => dispatch({ type: 'STOP_TASK_TIMER', id });
  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TASK', id });
    setEditingTask(null);
  };
  const handleEdit = (task) => {
    setEditingTask(task);
    setModalMode('edit');
  };
  const handleSave = (task) => {
    dispatch({ type: 'UPDATE_TASK', id: task.id, updates: task });
    setEditingTask(null);
  };
  const handleCreate = () => {
    const newTask = {
      id: uid(),
      date,
      category: CATEGORIES.CODING,
      title: '',
      completed: false,
      difficulty: DIFFICULTY.MEDIUM,
      timeSpentMinutes: 0,
      trackingStartedAt: null,
      notes: '',
    };
    setEditingTask(newTask);
    setModalMode('create');
  };
  const handleSaveNew = (task) => {
    if (!task.title.trim()) return;
    dispatch({ type: 'ADD_TASK', task });
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => shiftDate(-1)} className="p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-850 border border-surface-700 min-w-[140px] justify-center">
            <CalendarDays size={14} className="text-surface-400" />
            <span className="text-sm font-medium text-surface-100">
              {date === todayISO() ? 'Today' : formatShortDate(date)}
            </span>
          </div>
          <button onClick={() => shiftDate(1)} className="p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800">
            <ChevronRight size={18} />
          </button>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={16} /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryGroup category={CATEGORIES.CODING} tasks={codingTasks} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} onStartTracking={handleStartTracking} onStopTracking={handleStopTracking} />
        <CategoryGroup category={CATEGORIES.ENGLISH} tasks={englishTasks} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} onStartTracking={handleStartTracking} onStopTracking={handleStopTracking} />
      </div>

      <TaskForm
        task={editingTask}
        open={!!editingTask}
        mode={modalMode}
        onClose={() => setEditingTask(null)}
        onSave={modalMode === 'create' ? handleSaveNew : handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
