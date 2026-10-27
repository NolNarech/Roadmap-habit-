// Date helpers kept dependency-light and pure so they're easy to test/reuse.

export const todayISO = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export const formatDisplayDate = (date = new Date()) =>
  date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export const formatShortDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatTime = (date = new Date()) =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

/** Returns array of last N days as ISO date strings, oldest first. */
export const lastNDays = (n) => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

export const dayLabel = (isoString) =>
  new Date(isoString).toLocaleDateString('en-US', { weekday: 'short' });

/** Calculates a consecutive-day streak from an array of ISO date strings (dates with activity). */
export const calculateStreak = (activeDates) => {
  if (!activeDates || activeDates.length === 0) return 0;
  const dateSet = new Set(activeDates);
  let streak = 0;
  let cursor = new Date();

  // If nothing logged today yet, streak can still count from yesterday backwards.
  if (!dateSet.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const minutesToHoursLabel = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/** Builds a YouTube search URL for a topic. Search (not a pinned video ID) so
 * the link never rots — it always resolves to current, relevant free videos. */
export const youtubeSearchUrl = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
