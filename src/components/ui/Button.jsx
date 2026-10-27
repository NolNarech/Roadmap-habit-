const VARIANTS = {
  primary: 'bg-accent-500 hover:bg-accent-400 text-surface-950 font-semibold shadow-glow',
  secondary: 'bg-surface-700 hover:bg-surface-600 text-surface-100',
  ghost: 'bg-transparent hover:bg-surface-800 text-surface-300 hover:text-surface-100',
  danger: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20',
  outline: 'bg-transparent border border-surface-600 hover:border-accent-400 text-surface-200',
};

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
  icon: 'p-2',
};

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
