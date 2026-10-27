const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-20 h-20 text-2xl',
};

function initialsFrom(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const second = parts.length > 1 ? parts[1]?.[0] || '' : '';
  return (first + second).toUpperCase();
}

/** Avatar — shows the person's uploaded photo, or a colored initials circle if none is set. */
export function Avatar({ name, avatarUrl, size = 'md', className = '' }) {
  const sizeClasses = SIZE_MAP[size] || SIZE_MAP.md;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ? `${name}'s avatar` : 'Avatar'}
        className={`${sizeClasses} rounded-full object-cover border-2 border-surface-700 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-surface-950 font-bold flex items-center justify-center shrink-0 border-2 border-surface-700 ${className}`}
    >
      {initialsFrom(name)}
    </div>
  );
}
