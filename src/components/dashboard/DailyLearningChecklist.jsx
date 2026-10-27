import { Check, Code2, Languages, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { useDailyChecklist } from '../../hooks/useDailyChecklist';
import { CATEGORIES } from '../../constants/taskTemplates';
import { formatDisplayDate } from '../../utils/dateHelpers';

const SECTION_ICON = { [CATEGORIES.CODING]: Code2, [CATEGORIES.ENGLISH]: Languages };

function ChecklistItem({ item, checked, disabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.id)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors disabled:cursor-not-allowed ${
        checked ? 'bg-surface-800/40 border-surface-700/60' : 'bg-surface-850 border-surface-700 hover:border-surface-600'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
          checked ? 'bg-accent-500 border-accent-500' : 'border-surface-500'
        }`}
      >
        {checked && <Check size={13} className="text-surface-950" strokeWidth={3} />}
      </span>
      <span className={`text-sm font-medium ${checked ? 'text-surface-500 line-through' : 'text-surface-100'}`}>
        {item.label}
      </span>
    </button>
  );
}

export function DailyLearningChecklist() {
  const { sections, checked, submitted, checkedCount, toggleItem, submit, statusMessage } = useDailyChecklist();

  return (
    <Card>
      <CardHeader
        title="Today's Learning Checklist"
        subtitle={formatDisplayDate()}
        action={
          submitted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Lock size={12} /> Submitted for today
            </span>
          ) : (
            <span className="text-xs font-mono text-surface-400">{checkedCount} selected</span>
          )
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map((section) => {
          const Icon = SECTION_ICON[section.category];
          return (
            <div key={section.category} className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    section.category === CATEGORIES.CODING
                      ? 'bg-accent-500/10 border border-accent-500/20'
                      : 'bg-amber-500/10 border border-amber-500/20'
                  }`}
                >
                  <Icon size={15} className={section.category === CATEGORIES.CODING ? 'text-accent-400' : 'text-amber-400'} />
                </div>
                <h3 className="text-sm font-semibold text-surface-100">{section.label}</h3>
              </div>
              {section.items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={!!checked[item.id]}
                  disabled={submitted}
                  onToggle={toggleItem}
                />
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-4 border-t border-surface-700">
        <div className="min-h-[1.25rem]">
          {statusMessage && (
            <p
              className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                statusMessage.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {statusMessage.text}
            </p>
          )}
        </div>
        <Button onClick={submit} disabled={submitted} className="self-start sm:self-auto">
          <CheckCircle2 size={15} /> Submit Today's Progress
        </Button>
      </div>
    </Card>
  );
}
