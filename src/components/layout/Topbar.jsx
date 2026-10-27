import { Menu, Flame, Moon, Sun, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDisplayDate } from '../../utils/dateHelpers';
import { useAppState, useAppDispatch, useSyncStatus } from '../../context/AppContext';
import { useStats } from '../../hooks/useStats';
import { Avatar } from '../ui/Avatar';

const SYNC_META = {
  connecting: { icon: RefreshCw, label: 'Connecting…', className: 'text-surface-400 border-surface-700 bg-surface-800/60', spin: true },
  saving: { icon: RefreshCw, label: 'Saving…', className: 'text-accent-300 border-accent-500/20 bg-accent-500/10', spin: true },
  synced: { icon: Cloud, label: 'Synced', className: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10', spin: false },
  offline: { icon: CloudOff, label: 'Offline (local only)', className: 'text-amber-300 border-amber-500/20 bg-amber-500/10', spin: false },
};

export function Topbar({ onOpenMobile, title }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const stats = useStats();
  const syncStatus = useSyncStatus();
  const sync = SYNC_META[syncStatus] || SYNC_META.offline;
  const SyncIcon = sync.icon;

  const toggleTheme = () => dispatch({ type: 'SET_THEME', theme: state.theme === 'dark' ? 'light' : 'dark' });

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-surface-700 bg-surface-950/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobile} className="lg:hidden text-surface-300 hover:text-surface-100">
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-surface-50 tracking-tight">{title}</h1>
          <p className="text-xs text-surface-400 hidden sm:block">{formatDisplayDate()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          title={syncStatus === 'offline' ? "Can't reach the MongoDB backend — saving to this browser only." : 'Synced to MongoDB'}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${sync.className}`}
        >
          <SyncIcon size={13} className={sync.spin ? 'animate-spin' : ''} />
          <span className="text-xs font-medium">{sync.label}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-400/10 border border-orange-400/20">
          <Flame size={14} className="text-orange-400" />
          <span className="text-xs font-mono font-semibold text-orange-300">{stats.streak} day streak</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-colors"
          aria-label="Toggle theme"
        >
          {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/settings" aria-label="Go to profile settings">
          <Avatar name={state.profile.name} avatarUrl={state.profile.avatarUrl} size="sm" />
        </Link>
      </div>
    </header>
  );
}
