import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanData } from "@/lib/planner";
import { generateId } from "@/lib/planner";
import BackButton from "@/components/BackButton";

interface SetupScreenProps {
  onComplete: (plan: PlanData) => void;
  onBack: () => void;
}

export default function SetupScreen({ onComplete, onBack }: SetupScreenProps) {
  const [goalName, setGoalName] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [deadline, setDeadline] = useState("");

  const isValid = goalName.trim() && Number(totalUnits) > 0 && startDate && deadline && deadline > startDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onComplete({
      id: generateId(),
      goalName: goalName.trim(),
      totalUnits: Number(totalUnits),
      completedUnits: 0,
      startDate,
      deadline,
      dailyLog: [],
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-4">
        <BackButton onClick={onBack} label="Back to plans" />
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="text-3xl">🌱</div>
            <CardTitle className="text-2xl font-semibold tracking-tight">Create New Plan</CardTitle>
            <p className="text-muted-foreground text-sm">Break it down. One step at a time.</p>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="goal">What are you working on?</Label>
              <Input
                id="goal"
                placeholder="e.g. Read 12 chapters"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="units">How many units of work total?</Label>
              <Input
                id="units"
                type="number"
                min="1"
                placeholder="e.g. 12"
                value={totalUnits}
                onChange={(e) => setTotalUnits(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Chapters, pages, problems — whatever makes sense.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start">Start date</Label>
                <Input
                  id="start"
                  type="date"
                  className="w-full min-w-0 text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  className="w-full min-w-0 text-sm"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={!isValid}>
              Create Plan
            </Button>
          </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
