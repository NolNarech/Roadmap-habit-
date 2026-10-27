import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { formatDisplayDate, formatTime } from '../../utils/dateHelpers';
import { quoteOfTheDay } from '../../constants/quotes';

function timeOfDayGreeting(hour) {
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function GreetingHeader({ name, avatarUrl }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Avatar name={name} avatarUrl={avatarUrl} size="lg" />
          </Link>
          <div>
            <p className="text-xs text-surface-400">{formatDisplayDate(now)}</p>
            <h2 className="text-xl font-bold text-surface-50 mt-0.5">
              {timeOfDayGreeting(now.getHours())}, {name} 👋
            </h2>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="font-mono text-2xl font-bold text-surface-50 tabular-nums">{formatTime(now)}</p>
        </div>
      </div>
      <div className="relative mt-4 pt-4 border-t border-surface-700/70 flex items-start gap-2 text-surface-400">
        <Quote size={14} className="text-accent-400 shrink-0 mt-0.5" />
        <p className="text-xs italic leading-relaxed">{quoteOfTheDay(now)}</p>
      </div>
    </Card>
  );
}
