export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`card p-5 ${hover ? 'transition-all duration-200 hover:border-surface-500/60 hover:-translate-y-0.5' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-surface-100 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
