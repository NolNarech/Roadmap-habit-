// Static roadmap structure. Lesson progress/status/notes are stored separately
// in LocalStorage (keyed by lesson id) so this file can stay a pure blueprint.
//
// Structure per lesson:
//   - videoUrl: a specific, verified free video (mostly freeCodeCamp's YouTube
//     channel) covering the whole topic — not a search link.
//   - steps: an ordered path through the lesson. Each step has a short
//     explanation, a specific "Watch" search (topic is narrow enough that a
//     search reliably surfaces the right clip), and a `practice` — something
//     to actually do, not just watch, so progress means real skill.

export const LESSON_STATUS = {
  NOT_STARTED: 'Not Started',
  LEARNING: 'Learning',
  COMPLETED: 'Completed',
};

export const ROADMAP = [
  {
    id: 'frontend',
    title: 'Frontend',
    accent: 'accent',
    lessons: [
      {
        id: 'fe-html',
        title: 'HTML',
        description: 'Semantic structure, forms, accessibility basics.',
        videoUrl: 'https://www.youtube.com/watch?v=a_iQb1lnAEQ',
        videoTitle: 'Learn HTML & CSS – Full Course for Beginners (freeCodeCamp/Scrimba)',
        steps: [
          {
            id: 'fe-html-1', title: 'Document structure & tags',
            description: 'DOCTYPE, head/body, headings, paragraphs, links, images — the skeleton every page starts from.',
            videoQuery: 'HTML basics tags tutorial for beginners',
            practice: 'Create index.html with a heading, two paragraphs, one image, and one link to another site.',
          },
          {
            id: 'fe-html-2', title: 'Lists, tables & forms',
            description: 'Ordered/unordered lists, table markup, form inputs and labels.',
            videoQuery: 'HTML forms and tables tutorial',
            practice: 'Build a signup form with name, email, and password fields, plus a submit button.',
          },
          {
            id: 'fe-html-3', title: 'Semantic HTML',
            description: 'header, nav, main, section, article, footer — and why they matter for SEO and screen readers.',
            videoQuery: 'semantic HTML tutorial',
            practice: 'Rewrite a page that only uses <div> tags so it uses proper semantic tags instead.',
          },
          {
            id: 'fe-html-4', title: 'Accessibility basics',
            description: 'alt text, labels, aria attributes, keyboard navigation — make your page usable by everyone.',
            videoQuery: 'HTML accessibility basics tutorial',
            practice: 'Add meaningful alt text to every image on a page you\u2019ve built, and check every input has a <label>.',
          },
          {
            id: 'fe-html-5', title: 'Build: a static profile page',
            description: 'Put everything together into one real page, from scratch, with no help.',
            videoQuery: 'build a webpage with HTML tutorial project',
            practice: 'Build a one-page developer profile: photo, bio, a list of skills, and a contact form — no CSS yet.',
          },
        ],
      },
      {
        id: 'fe-css',
        title: 'CSS',
        description: 'Layout, flexbox, grid, responsive design.',
        videoUrl: 'https://www.youtube.com/watch?v=mU6anWqZJcc',
        videoTitle: 'Learn HTML5 and CSS3 From Scratch - Full Course (freeCodeCamp)',
        steps: [
          {
            id: 'fe-css-1', title: 'Selectors, box model & units',
            description: 'Specificity, margin/border/padding, px vs rem vs %.',
            videoQuery: 'CSS box model tutorial',
            practice: 'Style three boxes with different padding/margin/border and explain out loud why each looks different.',
          },
          {
            id: 'fe-css-2', title: 'Flexbox',
            description: 'One-dimensional layout — align, justify, grow, wrap.',
            videoQuery: 'CSS flexbox crash course',
            practice: 'Build a navbar with a logo on the left and 3 links on the right, using only flexbox.',
          },
          {
            id: 'fe-css-3', title: 'CSS Grid',
            description: 'Two-dimensional layout — grid-template, areas, gaps.',
            videoQuery: 'CSS grid crash course',
            practice: 'Build a 3-column photo gallery grid that collapses to 1 column on mobile.',
          },
          {
            id: 'fe-css-4', title: 'Responsive design',
            description: 'Media queries, mobile-first, fluid typography.',
            videoQuery: 'responsive web design media queries tutorial',
            practice: 'Take your HTML profile page from the HTML lesson and make it look good from 360px to 1440px wide.',
          },
          {
            id: 'fe-css-5', title: 'Build: responsive landing page',
            description: 'Combine flexbox + grid + media queries in one real layout.',
            videoQuery: 'build responsive landing page CSS tutorial',
            practice: 'Build a landing page with a hero section, a 3-card features grid, and a footer — fully responsive.',
          },
        ],
      },
      {
        id: 'fe-tailwind',
        title: 'Tailwind CSS',
        description: 'Utility-first styling and design systems.',
        videoUrl: 'https://www.youtube.com/watch?v=ft30zcMlFao',
        videoTitle: 'Learn Tailwind CSS – Course for Beginners (freeCodeCamp)',
        steps: [
          {
            id: 'fe-tw-1', title: 'Utility-first fundamentals',
            description: 'Spacing, color, typography utilities instead of custom CSS files.',
            videoQuery: 'Tailwind CSS basics tutorial',
            practice: 'Rebuild one card from your CSS landing page using only Tailwind classes, no custom CSS.',
          },
          {
            id: 'fe-tw-2', title: 'Responsive & state variants',
            description: 'sm:/md:/lg: breakpoints, hover:, focus:, dark: variants.',
            videoQuery: 'Tailwind CSS responsive design variants tutorial',
            practice: 'Make a button that changes color on hover and a layout that goes 1-col on mobile, 3-col on desktop.',
          },
          {
            id: 'fe-tw-3', title: 'Custom theme & config',
            description: 'Extending tailwind.config with your own colors and tokens.',
            videoQuery: 'Tailwind CSS custom theme config tutorial',
            practice: 'Add one custom color and one custom font to tailwind.config and use both on a page.',
          },
          {
            id: 'fe-tw-4', title: 'Build: a component library page',
            description: 'Buttons, cards, forms — all styled with utility classes, all reusable.',
            videoQuery: 'Tailwind CSS build UI components tutorial',
            practice: 'Build a page showing 3 button styles, 2 card styles, and 1 form — all with Tailwind only.',
          },
        ],
      },
      {
        id: 'fe-js',
        title: 'JavaScript',
        description: 'Core language, async, DOM, ES6+.',
        videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        videoTitle: 'JavaScript Programming - Full Course (freeCodeCamp)',
        steps: [
          {
            id: 'fe-js-1', title: 'Syntax & data types',
            description: 'Variables, functions, arrays, objects, template literals.',
            videoQuery: 'JavaScript basics tutorial for beginners',
            practice: 'Write a function that takes an array of numbers and returns the sum, using a loop.',
          },
          {
            id: 'fe-js-2', title: 'DOM manipulation & events',
            description: 'querySelector, event listeners, updating the page dynamically.',
            videoQuery: 'JavaScript DOM manipulation tutorial',
            practice: 'Make a button that, when clicked, adds a new list item with today\u2019s date to the page.',
          },
          {
            id: 'fe-js-3', title: 'ES6+ features',
            description: 'Arrow functions, destructuring, spread/rest, modules.',
            videoQuery: 'JavaScript ES6 tutorial',
            practice: 'Rewrite 3 of your earlier functions using arrow functions and destructuring.',
          },
          {
            id: 'fe-js-4', title: 'Async JavaScript',
            description: 'Callbacks, Promises, async/await, fetch.',
            videoQuery: 'JavaScript async await promises tutorial',
            practice: 'Fetch data from https://jsonplaceholder.typicode.com/users and log each name to the console.',
          },
          {
            id: 'fe-js-5', title: 'Build: an interactive app',
            description: 'A small vanilla-JS app that fetches and renders real data.',
            videoQuery: 'JavaScript project fetch API tutorial',
            practice: 'Build a page that fetches a list of users and renders them as cards, with a search box to filter by name.',
          },
        ],
      },
      {
        id: 'fe-react',
        title: 'React',
        description: 'Components, hooks, state, routing.',
        videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        videoTitle: 'React Course - Beginner\u2019s Tutorial for React JavaScript Library (freeCodeCamp)',
        steps: [
          {
            id: 'fe-react-1', title: 'Components & JSX',
            description: 'Function components, props, composing UI from pieces.',
            videoQuery: 'React components and JSX tutorial for beginners',
            practice: 'Build a Card component that takes title and description as props, and render 3 of them.',
          },
          {
            id: 'fe-react-2', title: 'State & events',
            description: 'useState, controlled inputs, handling user interaction.',
            videoQuery: 'React useState hook tutorial',
            practice: 'Build a counter with +1 / -1 buttons, and a text input that shows what you type live below it.',
          },
          {
            id: 'fe-react-3', title: 'Effects & data fetching',
            description: 'useEffect, fetching from an API, cleanup functions.',
            videoQuery: 'React useEffect data fetching tutorial',
            practice: 'Fetch a list of posts on mount and render them, showing a loading state while waiting.',
          },
          {
            id: 'fe-react-4', title: 'Routing',
            description: 'React Router — multi-page apps, params, nested routes.',
            videoQuery: 'React Router tutorial for beginners',
            practice: 'Build a 3-page app (Home, About, Contact) with a navbar that links between them.',
          },
          {
            id: 'fe-react-5', title: 'Build: a full mini project',
            description: 'Tie components, state, and routing together end to end.',
            videoQuery: 'React project tutorial for beginners',
            practice: 'Build a small notes app: add/delete notes, list route + single-note detail route.',
          },
        ],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    accent: 'accent',
    lessons: [
      {
        id: 'be-node',
        title: 'Node.js',
        description: 'Runtime fundamentals, modules, event loop.',
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        videoTitle: 'Node.js and Express.js - Full Course (freeCodeCamp)',
        steps: [
          {
            id: 'be-node-1', title: 'Runtime & modules',
            description: 'require/import, npm, package.json, the module system.',
            videoQuery: 'Node.js modules npm tutorial',
            practice: 'Create a Node project with npm init, write a math.js module that exports add/subtract, and use it.',
          },
          {
            id: 'be-node-2', title: 'The event loop & async I/O',
            description: 'Why Node is non-blocking, callbacks vs promises here.',
            videoQuery: 'Node.js event loop explained',
            practice: 'Write a script with 3 setTimeout calls of different delays and predict the print order before running it.',
          },
          {
            id: 'be-node-3', title: 'File system & core modules',
            description: 'fs, path, http — building blocks before frameworks.',
            videoQuery: 'Node.js file system http module tutorial',
            practice: 'Write a script that reads a .txt file and logs its contents, using fs.readFile.',
          },
          {
            id: 'be-node-4', title: 'Build: a raw HTTP server',
            description: 'A tiny server with no framework, to see what Express automates for you.',
            videoQuery: 'Node.js build a server from scratch tutorial',
            practice: 'Build an http server (no Express) that returns "Hello" on / and "About" on /about.',
          },
        ],
      },
      {
        id: 'be-express',
        title: 'Express',
        description: 'Routing, middleware, REST conventions.',
        videoUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
        videoTitle: 'Node.js and Express.js - Full Course (freeCodeCamp)',
        steps: [
          {
            id: 'be-exp-1', title: 'Routing basics',
            description: 'GET/POST/PUT/DELETE, route params, query strings.',
            videoQuery: 'Express.js routing tutorial',
            practice: 'Build routes GET /tasks and GET /tasks/:id that return hardcoded JSON.',
          },
          {
            id: 'be-exp-2', title: 'Middleware',
            description: 'Request pipeline, body-parser, custom middleware, error handling.',
            videoQuery: 'Express.js middleware tutorial',
            practice: 'Write a middleware that logs the method + URL of every request, and one that catches errors.',
          },
          {
            id: 'be-exp-3', title: 'REST API conventions',
            description: 'Resource-based routes, status codes, structuring a real API.',
            videoQuery: 'REST API design tutorial Express',
            practice: 'List out the 5 REST routes (GET/POST/PUT/DELETE) you\u2019d need for a "tasks" resource, with correct status codes.',
          },
          {
            id: 'be-exp-4', title: 'Build: a REST API',
            description: 'CRUD endpoints for a single resource, tested with Postman/Thunder Client.',
            videoQuery: 'build REST API with Express tutorial',
            practice: 'Build a full CRUD API for "tasks" using an in-memory array, tested with Postman.',
          },
        ],
      },
      {
        id: 'be-mongo',
        title: 'MongoDB',
        description: 'Schema design, queries, aggregation.',
        videoUrl: 'https://www.youtube.com/watch?v=x1-naBN7e84',
        videoTitle: 'MongoDB Zero to Hero — Complete Course with Real-time Projects',
        steps: [
          {
            id: 'be-mongo-1', title: 'Documents & collections',
            description: 'How MongoDB stores data vs a relational DB.',
            videoQuery: 'MongoDB basics documents collections tutorial',
            practice: 'Create a free MongoDB Atlas cluster and manually insert 3 sample documents in the Atlas UI.',
          },
          {
            id: 'be-mongo-2', title: 'CRUD with Mongoose',
            description: 'Schemas, models, find/create/update/delete from Node.',
            videoQuery: 'Mongoose tutorial Node.js MongoDB',
            practice: 'Define a Task schema in Mongoose and write create/find/update/delete functions for it.',
          },
          {
            id: 'be-mongo-3', title: 'Relationships & population',
            description: 'Referencing documents, .populate(), embedding vs referencing.',
            videoQuery: 'MongoDB Mongoose populate relationships tutorial',
            practice: 'Add a User model, reference it from Task (owner field), and populate it when fetching tasks.',
          },
          {
            id: 'be-mongo-4', title: 'Build: connect Express to MongoDB',
            description: 'Wire your REST API to a real Atlas database instead of an array.',
            videoQuery: 'connect Express MongoDB Atlas tutorial',
            practice: 'Swap the in-memory array in your Task API for real MongoDB reads/writes.',
          },
        ],
      },
      {
        id: 'be-auth',
        title: 'Authentication',
        description: 'Sessions, JWT, password hashing, OAuth basics.',
        videoUrl: 'https://www.youtube.com/watch?v=x5gLL8-M9Fo',
        videoTitle: 'What are JSON Web Tokens? JWT Auth Tutorial (freeCodeCamp)',
        steps: [
          {
            id: 'be-auth-1', title: 'Password hashing',
            description: 'Why you never store plaintext passwords — bcrypt basics.',
            videoQuery: 'bcrypt password hashing Node.js tutorial',
            practice: 'Write a signup function that hashes the password with bcrypt before saving the user.',
          },
          {
            id: 'be-auth-2', title: 'Sessions vs JWT',
            description: 'Two common approaches to keeping users logged in.',
            videoQuery: 'JWT vs sessions explained',
            practice: 'In your own words (2-3 sentences), explain to a friend why JWT doesn\u2019t need server-side storage.',
          },
          {
            id: 'be-auth-3', title: 'Implementing JWT auth',
            description: 'Issuing tokens on login, protecting routes with middleware.',
            videoQuery: 'JWT authentication Node.js Express tutorial',
            practice: 'Add a /login route that returns a JWT, and a middleware that blocks requests without a valid token.',
          },
          {
            id: 'be-auth-4', title: 'OAuth basics',
            description: '"Sign in with Google/GitHub" — what happens under the hood.',
            videoQuery: 'OAuth explained tutorial',
            practice: 'Draw (on paper) the 4 steps of an OAuth login flow, from clicking the button to being logged in.',
          },
        ],
      },
      {
        id: 'be-api',
        title: 'API Development',
        description: 'Designing and documenting production APIs.',
        videoUrl: 'https://www.youtube.com/watch?v=2JYT5f2isg4',
        videoTitle: 'Full HTTP Networking Course – Fetch and REST APIs (freeCodeCamp)',
        steps: [
          {
            id: 'be-api-1', title: 'Designing resources & versioning',
            description: 'Naming, nesting, /v1, pagination, filtering.',
            videoQuery: 'REST API design best practices tutorial',
            practice: 'Redesign your Task API routes to support pagination (?page=1&limit=10) and filtering by status.',
          },
          {
            id: 'be-api-2', title: 'Validation & error handling',
            description: 'Consistent error shapes, input validation libraries.',
            videoQuery: 'API input validation error handling tutorial',
            practice: 'Add validation so creating a task without a title returns a 400 with a clear error message.',
          },
          {
            id: 'be-api-3', title: 'Documenting your API',
            description: 'Swagger/OpenAPI basics so others (or future you) can use it.',
            videoQuery: 'Swagger OpenAPI documentation tutorial',
            practice: 'Write down every endpoint your Task API has, with method, path, body, and response shape.',
          },
          {
            id: 'be-api-4', title: 'Build: document your REST API',
            description: 'Turn that into a real OpenAPI spec.',
            videoQuery: 'write OpenAPI spec tutorial',
            practice: 'Write a minimal openapi.yaml covering your Task API\u2019s 5 endpoints.',
          },
        ],
      },
    ],
  },
  {
    id: 'english',
    title: 'English',
    accent: 'amber',
    lessons: [
      {
        id: 'en-beginner',
        title: 'Beginner',
        description: 'Core grammar, everyday vocabulary, basic conversation.',
        videoUrl: 'https://www.youtube.com/watch?v=0ZPwyB_h-40',
        videoTitle: 'English Speaking Course for Beginners, Intermediate, Advanced',
        steps: [
          {
            id: 'en-beg-1', title: 'Present tense & everyday verbs',
            description: 'I am / I have / I do — the sentences you use constantly.',
            videoQuery: 'English grammar present tense for beginners',
            practice: 'Write 5 sentences about your daily routine using only present tense.',
          },
          {
            id: 'en-beg-2', title: 'Core vocabulary (500 words)',
            description: 'The most frequent words that cover most daily conversation.',
            videoQuery: 'most common English words for beginners',
            practice: 'Pick 10 new words today, use each one in a sentence out loud.',
          },
          {
            id: 'en-beg-3', title: 'Asking & answering questions',
            description: 'Wh-questions, yes/no questions, short answers.',
            videoQuery: 'English question words tutorial beginners',
            practice: 'Write 5 questions you\u2019d ask a new coworker, then write short answers to them yourself.',
          },
          {
            id: 'en-beg-4', title: 'Listening: slow, everyday English',
            description: 'Practice understanding simple spoken conversations.',
            videoQuery: 'English listening practice for beginners slow',
            practice: 'Watch one 5-minute beginner listening video with no subtitles, then again with subtitles. Note what you missed.',
          },
        ],
      },
      {
        id: 'en-intermediate',
        title: 'Intermediate',
        description: 'Fluency building, tenses, technical reading.',
        videoUrl: 'https://www.youtube.com/watch?v=0ZPwyB_h-40',
        videoTitle: 'English Speaking Course for Beginners, Intermediate, Advanced',
        steps: [
          {
            id: 'en-int-1', title: 'Past, present, future tenses',
            description: 'Combining tenses correctly in real conversation.',
            videoQuery: 'English tenses explained intermediate',
            practice: 'Write a 5-sentence story about yesterday, today, and your plan for tomorrow — one tense per part.',
          },
          {
            id: 'en-int-2', title: 'Reading technical/programming English',
            description: 'Docs, error messages, comments — the English developers read daily.',
            videoQuery: 'reading technical English for programmers',
            practice: 'Read one page of the official React or MDN docs and summarize it in your own words, in English.',
          },
          {
            id: 'en-int-3', title: 'Phrasal verbs & idioms',
            description: 'The everyday expressions native speakers use constantly.',
            videoQuery: 'common English phrasal verbs tutorial',
            practice: 'Learn 5 phrasal verbs (e.g. "figure out", "give up") and use each in a sentence about coding.',
          },
          {
            id: 'en-int-4', title: 'Speaking practice: describing your work',
            description: 'Explain what you built and why, out loud.',
            videoQuery: 'English speaking practice describing your job',
            practice: 'Record yourself explaining one of your coding projects in English for 1 minute. Listen back.',
          },
        ],
      },
      {
        id: 'en-advanced',
        title: 'Advanced',
        description: 'Professional writing, nuanced speaking, presentations.',
        videoUrl: 'https://www.youtube.com/watch?v=gDpVENFa94U',
        videoTitle: 'Advanced English Speaking Course - Full Video',
        steps: [
          {
            id: 'en-adv-1', title: 'Professional writing',
            description: 'Emails, PR descriptions, technical documentation tone.',
            videoQuery: 'professional English writing tutorial',
            practice: 'Write a short professional email asking a teammate to review your pull request.',
          },
          {
            id: 'en-adv-2', title: 'Giving a technical presentation',
            description: 'Structuring and delivering a talk about your work in English.',
            videoQuery: 'English presentation skills tutorial',
            practice: 'Prepare a 5-slide outline (just bullet points) explaining a project you built, in English.',
          },
          {
            id: 'en-adv-3', title: 'Nuance: tone, register, hedging',
            description: 'Softening feedback, disagreeing politely, reading between the lines.',
            videoQuery: 'English tone and register advanced tutorial',
            practice: 'Rewrite "This code is wrong" as 3 different, more polite versions you could say to a teammate.',
          },
          {
            id: 'en-adv-4', title: 'Mock interview practice',
            description: 'Practice a technical interview conducted fully in English.',
            videoQuery: 'English technical interview practice',
            practice: 'Answer "Tell me about a project you\u2019re proud of" out loud in English for 2 minutes, unscripted.',
          },
        ],
      },
    ],
  },
];
