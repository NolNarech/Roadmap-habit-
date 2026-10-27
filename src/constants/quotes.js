export const QUOTES = [
  'Small daily progress compounds into mastery.',
  'You don\u2019t have to be great to start, but you have to start to be great.',
  'Consistency beats intensity. Show up today.',
  'Every expert was once a beginner who refused to give up.',
  'Code a little, learn a little, repeat forever.',
  'The streak isn\u2019t the goal — the habit is. The streak just proves it.',
  'Progress, not perfection.',
  'One more lesson. One more rep. That\u2019s all today needs.',
  'Future you is built by what you do in the next 60 minutes.',
  'Discipline is choosing between what you want now and what you want most.',
  'Learning a language and learning to code are the same game: repetition wins.',
  'The best developers aren\u2019t the smartest — they\u2019re the ones who kept showing up.',
  'Bugs fixed, words learned, XP earned — it all adds up.',
  'Your only competition is who you were yesterday.',
  'A little bit every day beats a lot some days.',
];

/** Deterministic "quote of the day" — same quote all day, changes at midnight. */
export function quoteOfTheDay(date = new Date()) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 86_400_000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}
