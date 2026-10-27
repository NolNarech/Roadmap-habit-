export function Field({ label, children, hint }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-medium text-surface-300 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-surface-500 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({ className = '', ...props }) {
  return <input className={`input-base ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`input-base min-h-[90px] resize-y ${className}`} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className="input-base cursor-pointer" {...props}>
      {children}
    </select>
  );
}
