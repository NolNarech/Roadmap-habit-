import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, ListChecks, FolderKanban, StickyNote, Settings, Terminal, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/tasks', label: 'Daily Tasks', icon: ListChecks },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onCloseMobile }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-surface-950/70 backdrop-blur-sm lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={`fixed lg:sticky top-0 h-screen w-64 shrink-0 bg-surface-900 border-r border-surface-700 z-50
        transition-transform duration-300 lg:translate-x-0 flex flex-col
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
              <Terminal size={16} className="text-accent-400" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-surface-50 tracking-tight">Dev Progress</p>
              <p className="text-[10px] text-surface-400 font-mono">TRACKER</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-surface-400 hover:text-surface-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-accent-500/10 text-accent-300 border border-accent-500/20'
                    : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800 border border-transparent'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-surface-700">
          <div className="rounded-xl bg-surface-800 border border-surface-700 p-3">
            <p className="text-[11px] text-surface-400 leading-relaxed">
              Keep showing up. Small daily progress compounds into mastery.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
