// Static definition for the "Today's Learning Checklist" widget.
// Kept separate from taskTemplates.js (which drives the auto-generated
// daily task list) since this is a distinct, user-facing checklist with
// its own submit/lock flow.
import { CATEGORIES } from './taskTemplates';

// Minutes credited toward Study Hours / Weekly / Monthly stats for each
// checklist item marked complete on submit. Adjust freely — it's the only
// place this number lives.
export const MINUTES_PER_CHECKLIST_ITEM = 15;

export const CHECKLIST_SECTIONS = [
  {
    category: CATEGORIES.CODING,
    label: 'Coding',
    items: [
      { id: 'html', label: 'HTML' },
      { id: 'css', label: 'CSS' },
      { id: 'javascript', label: 'JavaScript' },
      { id: 'react', label: 'React' },
      { id: 'tailwind', label: 'Tailwind CSS' },
      { id: 'project-practice', label: 'Project Practice' },
    ],
  },
  {
    category: CATEGORIES.ENGLISH,
    label: 'English',
    items: [
      { id: 'vocabulary', label: 'Vocabulary' },
      { id: 'listening', label: 'Listening' },
      { id: 'speaking', label: 'Speaking' },
      { id: 'reading', label: 'Reading' },
      { id: 'writing', label: 'Writing' },
    ],
  },
];
