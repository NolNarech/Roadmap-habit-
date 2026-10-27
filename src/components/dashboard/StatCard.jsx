import { Card } from '../ui/Card';

const COLOR_MAP = {
  accent: { bg: 'bg-accent-500/10', border: 'border-accent-500/20', text: 'text-accent-400' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
};

export function StatCard({ icon: Icon, label, value, sublabel, color = 'accent', trend }) {
  const c = COLOR_MAP[color] || COLOR_MAP.accent;
  return (
    <Card hover className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-surface-400 mb-2">{label}</p>
        <p className="text-2xl font-bold font-mono text-surface-50 tracking-tight">{value}</p>
        {sublabel && <p className="text-xs text-surface-500 mt-1">{sublabel}</p>}
        {trend && (
          <p className={`text-xs mt-1.5 font-medium ${trend.positive ? 'text-emerald-400' : 'text-surface-400'}`}>
            {trend.label}
          </p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
        <Icon size={18} className={c.text} />
      </div>
    </Card>
  );
}
