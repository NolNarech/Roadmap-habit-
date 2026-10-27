import { Target } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { minutesToHoursLabel } from '../../utils/dateHelpers';

export function GoalCard({ todayMinutes, goalMinutes }) {
  const pct = Math.min(100, Math.round((todayMinutes / goalMinutes) * 100));
  return (
    <Card hover>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-surface-400 mb-1">Current Goal</p>
          <p className="text-sm font-semibold text-surface-100">Daily study target</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
          <Target size={18} className="text-accent-400" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-xl font-bold font-mono text-surface-50">{minutesToHoursLabel(todayMinutes)}</span>
        <span className="text-xs text-surface-400">/ {minutesToHoursLabel(goalMinutes)} today</span>
      </div>
      <ProgressBar value={pct} color={pct >= 100 ? 'emerald' : 'accent'} />
      <p className="text-xs text-surface-500 mt-2">{pct >= 100 ? "Goal reached — great work!" : `${pct}% of today's goal`}</p>
    </Card>
  );
}
