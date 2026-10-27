import { uid, todayISO } from '../utils/dateHelpers';

export const seedProjects = () => [
  {
    id: uid(),
    name: 'Portfolio Website',
    description: 'Personal portfolio to showcase projects and skills.',
    technologies: ['React', 'Tailwind CSS', 'Vite'],
    progress: 65,
    deadline: addDays(14),
    tasks: [
      { id: uid(), title: 'Design hero section', completed: true },
      { id: uid(), title: 'Build projects grid', completed: true },
      { id: uid(), title: 'Add contact form', completed: false },
      { id: uid(), title: 'Deploy to production', completed: false },
    ],
  },
  {
    id: uid(),
    name: 'E-commerce Website',
    description: 'Full-featured store with cart, checkout, and admin panel.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    progress: 30,
    deadline: addDays(45),
    tasks: [
      { id: uid(), title: 'Product listing page', completed: true },
      { id: uid(), title: 'Shopping cart logic', completed: false },
      { id: uid(), title: 'Stripe checkout integration', completed: false },
      { id: uid(), title: 'Admin product management', completed: false },
    ],
  },
  {
    id: uid(),
    name: 'Admin Dashboard',
    description: 'Reusable analytics dashboard template with charts and tables.',
    technologies: ['React', 'Recharts', 'Tailwind CSS'],
    progress: 10,
    deadline: addDays(60),
    tasks: [
      { id: uid(), title: 'Sidebar + layout shell', completed: true },
      { id: uid(), title: 'Chart components', completed: false },
      { id: uid(), title: 'Data table with filters', completed: false },
    ],
  },
  {
    id: uid(),
    name: 'Coffee POS System',
    description: 'Point-of-sale system for a small coffee shop.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Authentication'],
    progress: 0,
    deadline: addDays(90),
    tasks: [
      { id: uid(), title: 'Define menu data model', completed: false },
      { id: uid(), title: 'Order flow UI', completed: false },
      { id: uid(), title: 'Receipt printing', completed: false },
    ],
  },
];

export const seedNotes = () => [
  {
    id: uid(),
    title: 'JavaScript Promises',
    category: 'coding',
    content: '## Promises\n\nA **Promise** handles asynchronous operations. It has three states:\n\n- `pending`\n- `fulfilled`\n- `rejected`\n\n```js\nfetch(url).then(res => res.json());\n```',
    date: todayISO(),
  },
  {
    id: uid(),
    title: 'New Vocabulary',
    category: 'english',
    content: '## Today\'s Words\n\nToday I learned **10 new words**:\n\n1. Robust\n2. Concise\n3. Iterate\n4. Deprecate\n5. Refactor',
    date: todayISO(),
  },
];

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
