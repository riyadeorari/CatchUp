import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PlanData } from "@/lib/planner";
import { getDaysLeft, getRemainingUnits, getTodayTarget } from "@/lib/planner";
import { Clock, Target, Layers, CalendarDays } from "lucide-react";
import BackButton from "@/components/BackButton";

interface DashboardProps {
  plan: PlanData;
  onStartFocus: () => void;
  onOverwhelm: () => void;
  onReset: () => void;
  onBack: () => void;
}

export default function Dashboard({ plan, onStartFocus, onOverwhelm, onReset, onBack }: DashboardProps) {
  const remaining = getRemainingUnits(plan);
  const daysLeft = getDaysLeft(plan.deadline);
  const todayTarget = getTodayTarget(plan);
  const progress = plan.totalUnits > 0 ? ((plan.completedUnits / plan.totalUnits) * 100) : 0;
  const isDone = remaining === 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Back button */}
        <BackButton onClick={onBack} label="Back to plans" />

        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{plan.goalName}</h1>
          <p className="text-muted-foreground text-sm">
            {isDone ? "🎉 You did it! Amazing work." : "You're making progress. Keep going."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">
            {plan.completedUnits} of {plan.totalUnits} done ({Math.round(progress)}%)
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Layers className="h-4 w-4" />} label="Remaining" value={remaining} />
          <StatCard icon={<CalendarDays className="h-4 w-4" />} label="Days left" value={daysLeft} />
          <StatCard icon={<Target className="h-4 w-4" />} label="Today's target" value={todayTarget} />
          <StatCard icon={<Clock className="h-4 w-4" />} label="Completed" value={plan.completedUnits} />
        </div>

        {/* Actions */}
        {!isDone && (
          <div className="space-y-3">
            <Button onClick={onStartFocus} className="w-full" size="lg">
              Start Focus Session
            </Button>
            <Button onClick={onOverwhelm} variant="secondary" className="w-full" size="lg">
              Feeling Overwhelmed?
            </Button>
          </div>
        )}

        <button
          onClick={onReset}
          className="block mx-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Delete this plan
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="border-border/50">
      <CardContent className="p-4 flex flex-col items-center gap-1">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-2xl font-semibold">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  );
}
