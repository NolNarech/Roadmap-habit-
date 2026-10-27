export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center mb-4">
          <Icon size={22} className="text-surface-400" />
        </div>
      )}
      <h4 className="text-sm font-semibold text-surface-100 mb-1">{title}</h4>
      {description && <p className="text-xs text-surface-400 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}
