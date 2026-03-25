import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanData } from "@/lib/planner";
import { getSmallestStep } from "@/lib/planner";

interface OverwhelmModeProps {
  plan: PlanData;
  onComplete: (units: number) => void;
  onBack: () => void;
}

export default function OverwhelmMode({ plan, onComplete, onBack }: OverwhelmModeProps) {
  const smallStep = getSmallestStep(plan);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm border-border/50 shadow-lg text-center">
        <CardHeader className="pb-2 space-y-2">
          <div className="text-3xl">🫂</div>
          <CardTitle className="text-xl font-semibold">It's okay. Let's go small.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            You don't have to do everything today. Just try this:
          </p>
          <div className="rounded-lg bg-secondary p-5">
            <p className="text-3xl font-semibold">{smallStep}</p>
            <p className="text-sm text-secondary-foreground mt-1">
              unit{smallStep !== 1 ? "s" : ""} — that's all
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Any progress counts. The rest will be spread across your remaining days.
          </p>
          <div className="space-y-2">
            <Button onClick={() => onComplete(smallStep)} className="w-full">
              I did it ✓
            </Button>
            <Button onClick={onBack} variant="secondary" className="w-full">
              Go back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
