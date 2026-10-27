export function ProgressBar({ value, color = 'accent', height = 'h-2', showLabel = false }) {
  const clamped = Math.max(0, Math.min(100, value));
  const colorMap = {
    accent: 'bg-accent-400',
    amber: 'bg-amber-400',
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
  };
  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-surface-700 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${colorMap[color] || colorMap.accent} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && <span className="text-xs text-surface-400 mt-1 block">{clamped}%</span>}
    </div>
  );
}

export function CircularProgress({ value, size = 64, stroke = 6, color = '#22d3ee', label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e2836" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-mono font-semibold text-surface-100">{label ?? `${value}%`}</span>
    </div>
  );
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${className}`}>
      {children}
    </span>
  );
}
