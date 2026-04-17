import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import BackButton from "@/components/BackButton";
import type { PlanData } from "@/lib/planner";
import { getDaysLeft, getRemainingUnits, getTodayTarget } from "@/lib/planner";
import { Plus, ArrowRight, CalendarDays, Target } from "lucide-react";

interface PlansListDashboardProps {
  plans: PlanData[];
  onCreateNew: () => void;
  onOpenPlan: (id: string) => void;
  onBack: () => void;
}

export default function PlansListDashboard({ plans, onCreateNew, onOpenPlan, onBack }: PlansListDashboardProps) {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <BackButton onClick={onBack} label="Back" />
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">CatchUp</h1>
            <p className="text-sm text-muted-foreground">Your active plans</p>
          </div>
          <Button onClick={onCreateNew} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Plan
          </Button>
        </div>

        {/* Plans */}
        {plans.length === 0 ? (
          <Card className="border-border/50 border-dashed">
            <CardContent className="p-8 text-center space-y-3">
              <p className="text-muted-foreground text-sm">No plans yet. Create your first one!</p>
              <Button onClick={onCreateNew} variant="secondary" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Create New Plan
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onOpen={() => onOpenPlan(plan.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({ plan, onOpen }: { plan: PlanData; onOpen: () => void }) {
  const remaining = getRemainingUnits(plan);
  const daysLeft = getDaysLeft(plan.deadline);
  const todayTarget = getTodayTarget(plan);
  const progress = plan.totalUnits > 0 ? (plan.completedUnits / plan.totalUnits) * 100 : 0;
  const isDone = remaining === 0;

  return (
    <Card
      className="border-border/50 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onOpen}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{plan.goalName}</h3>
            <p className="text-xs text-muted-foreground">
              {isDone ? "✅ Completed" : `${plan.completedUnits} / ${plan.totalUnits} units`}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
        </div>

        <Progress value={progress} className="h-2" />

        {!isDone && (
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
            </span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {todayTarget} today
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
