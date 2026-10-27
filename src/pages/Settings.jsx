import { useState } from 'react';
import { Sun, Moon, Trash2, Download, Upload, Music2, Camera, X } from 'lucide-react';
import { useAppState, useAppDispatch } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Field, TextInput } from '../components/ui/FormFields';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { extractYouTubeId } from '../utils/youtube';
import { deleteRemoteState } from '../utils/api';

export default function Settings() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [name, setName] = useState(state.profile.name);
  const [goal, setGoal] = useState(state.profile.dailyGoalMinutes);
  const [breakMusicUrl, setBreakMusicUrl] = useState(state.profile.breakMusicUrl || '');
  const [confirmReset, setConfirmReset] = useState(false);

  const saveProfile = () => {
    dispatch({ type: 'UPDATE_PROFILE', updates: { name, dailyGoalMinutes: Number(goal) || 60 } });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      dispatch({ type: 'UPDATE_PROFILE', updates: { avatarUrl: reader.result } });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeAvatar = () => {
    dispatch({ type: 'UPDATE_PROFILE', updates: { avatarUrl: null } });
  };

  const saveBreakMusic = () => {
    dispatch({ type: 'UPDATE_PROFILE', updates: { breakMusicUrl: breakMusicUrl.trim() } });
  };

  const isValidUrl = !breakMusicUrl || Boolean(extractYouTubeId(breakMusicUrl));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dev-progress-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        window.localStorage.setItem('dpt_app_state_v1', JSON.stringify(parsed));
        window.location.reload();
      } catch {
        alert('That file could not be read as a valid backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader title="Profile" subtitle="Basic account details" />
        <div className="flex items-center gap-4 mb-5">
          <Avatar name={name} avatarUrl={state.profile.avatarUrl} size="xl" />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <label>
                <Button variant="secondary" size="sm" onClick={() => document.getElementById('avatar-file').click()}>
                  <Camera size={14} /> {state.profile.avatarUrl ? 'Change photo' : 'Upload photo'}
                </Button>
                <input id="avatar-file" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              {state.profile.avatarUrl && (
                <Button variant="ghost" size="sm" onClick={removeAvatar}>
                  <X size={14} /> Remove
                </Button>
              )}
            </div>
            <p className="text-[11px] text-surface-500">JPG or PNG, stored locally in your browser.</p>
          </div>
        </div>
        <Field label="Display name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Daily study goal (minutes)" hint="Used to calculate the goal progress on your dashboard">
          <TextInput type="number" min="15" value={goal} onChange={(e) => setGoal(e.target.value)} />
        </Field>
        <Button onClick={saveProfile}>Save changes</Button>
      </Card>

      <Card>
        <CardHeader title="Break music" subtitle="Paste a YouTube link — it plays by itself the moment your 50-minute focus session ends (after you press Start once)" />
        <Field label="YouTube URL" hint="e.g. https://www.youtube.com/watch?v=... or a youtu.be link">
          <TextInput
            value={breakMusicUrl}
            onChange={(e) => setBreakMusicUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>
        {!isValidUrl && (
          <p className="text-xs text-rose-400 -mt-2 mb-3">That doesn't look like a valid YouTube link.</p>
        )}
        <Button onClick={saveBreakMusic} disabled={!isValidUrl}>
          <Music2 size={15} /> Save break music
        </Button>
      </Card>

      <Card>
        <CardHeader title="Appearance" subtitle="Choose light or dark mode" />
        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: 'SET_THEME', theme: 'dark' })}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors ${
              state.theme === 'dark' ? 'border-accent-400 bg-accent-500/10 text-accent-300' : 'border-surface-700 text-surface-400 hover:text-surface-200'
            }`}
          >
            <Moon size={16} /> Dark
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_THEME', theme: 'light' })}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-colors ${
              state.theme === 'light' ? 'border-accent-400 bg-accent-500/10 text-accent-300' : 'border-surface-700 text-surface-400 hover:text-surface-200'
            }`}
          >
            <Sun size={16} /> Light
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data" subtitle="Everything is stored locally in your browser" />
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={exportData}>
            <Download size={15} /> Export backup
          </Button>
          <label>
            <Button variant="secondary" onClick={() => document.getElementById('import-file').click()}>
              <Upload size={15} /> Import backup
            </Button>
            <input id="import-file" type="file" accept="application/json" className="hidden" onChange={importData} />
          </label>
        </div>
      </Card>

      <Card className="border-rose-500/20">
        <CardHeader title="Danger zone" subtitle="Permanently erase all local data" />
        {!confirmReset ? (
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            <Trash2 size={15} /> Reset all data
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-xs text-surface-300">Are you sure? This cannot be undone.</p>
            <Button
              variant="danger"
              onClick={() => {
                deleteRemoteState(); // best-effort — local reset proceeds either way
                dispatch({ type: 'RESET_ALL' });
              }}
            >
              Yes, erase everything
            </Button>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>Cancel</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
