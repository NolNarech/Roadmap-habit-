import { useState } from 'react';
import { Plus, FolderKanban } from 'lucide-react';
import { useAppState, useAppDispatch, uid } from '../context/AppContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { todayISO } from '../utils/dateHelpers';

export default function Projects() {
  const { projects } = useAppState();
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState('edit');

  const handleToggleTask = (projectId, taskId) => dispatch({ type: 'TOGGLE_PROJECT_TASK', projectId, taskId });

  const handleCreate = () => {
    setEditing({
      id: uid(),
      name: '',
      description: '',
      technologies: [],
      progress: 0,
      deadline: todayISO(),
      tasks: [],
    });
    setMode('create');
  };

  const handleEdit = (project) => {
    setEditing(project);
    setMode('edit');
  };

  const handleSave = (project) => {
    if (mode === 'create') {
      dispatch({ type: 'ADD_PROJECT', project });
    } else {
      dispatch({ type: 'UPDATE_PROJECT', id: project.id, updates: project });
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_PROJECT', id });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-400">{projects.length} active projects</p>
        <Button onClick={handleCreate}>
          <Plus size={16} /> New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Start tracking a build to see progress here."
          action={<Button onClick={handleCreate}><Plus size={16} /> New Project</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onToggleTask={handleToggleTask}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProjectForm
        project={editing}
        open={!!editing}
        mode={mode}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
