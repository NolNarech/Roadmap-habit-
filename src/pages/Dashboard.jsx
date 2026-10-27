import { Code2, Languages, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { useAppState } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/dashboard/StatCard';
import { GoalCard } from '../components/dashboard/GoalCard';
import { GreetingHeader } from '../components/dashboard/GreetingHeader';
import { ContinueLearningCard } from '../components/dashboard/ContinueLearningCard';
import MvpDashboard from '../components/dashboard/MvpDashboard';
import { minutesToHoursLabel } from '../utils/dateHelpers';

export default function Dashboard() {
  const stats = useStats();
  const { profile, lessonProgress } = useAppState();

  return (
    <div className="space-y-6">
      <GreetingHeader name={profile.name} avatarUrl={profile.avatarUrl} />

      {/* Streak + continue-learning row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center text-center">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2">
            <Flame size={20} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-surface-50">{stats.streak}d</p>
          <p className="text-xs text-surface-400 mt-0.5">
            {stats.streak > 0 ? 'Current streak — keep it alive today' : 'No streak yet — start today'}
          </p>
        </Card>
        <ContinueLearningCard lessonProgress={lessonProgress} />
      </div>

      {/* Core MVP: timer + checklist + vocab logger */}
      <MvpDashboard />

      {/* Simple stat row — no XP, no charts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Learning Streak" value={`${stats.streak}d`} sublabel="consecutive active days" color="rose" />
        <StatCard icon={TrendingUp} label="Total Study Hours" value={minutesToHoursLabel(stats.totalMinutes)} sublabel="all time" color="accent" />
        <StatCard icon={CheckCircle2} label="Completed Tasks" value={`${stats.completedTasks}/${stats.totalTasks}`} sublabel="all recorded tasks" color="emerald" />
        <StatCard icon={Code2} label="Coding Progress" value={`${stats.codingProgress}%`} sublabel="roadmap completion" color="accent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Code2} label="Coding Hours" value={minutesToHoursLabel(stats.codingMinutes)} color="accent" />
        <StatCard icon={Languages} label="English Hours" value={minutesToHoursLabel(stats.englishMinutes)} color="amber" />
        <StatCard icon={CheckCircle2} label="Completed Lessons" value={`${stats.completedLessons}/${stats.totalLessons}`} color="emerald" />
        <GoalCard todayMinutes={stats.todayMinutes} goalMinutes={profile.dailyGoalMinutes} />
      </div>
    </div>
  );
}
