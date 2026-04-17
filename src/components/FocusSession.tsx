import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import type { PlanData } from "@/lib/planner";
import { getTodayTarget } from "@/lib/planner";

interface FocusSessionProps {
  plan: PlanData;
  onComplete: (unitsCompleted: number) => void;
  onCancel: () => void;
}

const FOCUS_DURATION = 25 * 60;

export default function FocusSession({ plan, onComplete, onCancel }: FocusSessionProps) {
  const todayTarget = getTodayTarget(plan);
  const today = new Date().toISOString().split("T")[0];
  const todayLog = plan.dailyLog.find((l) => l.date === today);
  const alreadyCompleted = todayLog ? todayLog.completed : 0;

  const [completedThisSession, setCompletedThisSession] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalCompletedToday = alreadyCompleted + completedThisSession;
  const remainingToday = Math.max(0, todayTarget - totalCompletedToday);
  const currentUnit = totalCompletedToday + 1;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearTimer();
            setIsRunning(false);
            setTimerFinished(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, clearTimer]);

  const resetTimer = () => {
    setSecondsLeft(FOCUS_DURATION);
    setIsRunning(false);
    setTimerFinished(false);
  };

  const handleMarkCompleted = () => {
    setCompletedThisSession((c) => c + 1);
    resetTimer();
  };

  const handleSkip = () => {
    // Don't count it, just move on — the unit stays pending
    resetTimer();
  };

  const handleDone = () => {
    onComplete(completedThisSession);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPct = ((FOCUS_DURATION - secondsLeft) / FOCUS_DURATION) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-4">
        <BackButton onClick={onCancel} label="Back to dashboard" />
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-semibold">Focus Session</CardTitle>
            <p className="text-muted-foreground text-sm">{plan.goalName}</p>
          </CardHeader>
          <CardContent className="space-y-5">
          {/* Progress summary */}
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-muted-foreground text-xs">Today's target</p>
              <p className="text-lg font-semibold">{todayTarget}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-muted-foreground text-xs">Current unit</p>
              <p className="text-lg font-semibold">{remainingToday > 0 ? currentUnit : "—"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-muted-foreground text-xs">Completed today</p>
              <p className="text-lg font-semibold">{totalCompletedToday}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-2.5">
              <p className="text-muted-foreground text-xs">Remaining today</p>
              <p className="text-lg font-semibold">{remainingToday}</p>
            </div>
          </div>

          {/* Timer circle */}
          <div className="relative w-40 h-40 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" className="stroke-muted" />
              <circle
                cx="50" cy="50" r="45" fill="none" strokeWidth="4"
                className="stroke-primary transition-all duration-1000"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPct / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-semibold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {timerFinished ? "Time's up!" : isRunning ? "Focusing…" : secondsLeft === FOCUS_DURATION ? "Ready" : "Paused"}
              </span>
            </div>
          </div>

          {/* Timer controls */}
          <div className="flex justify-center gap-2">
            {!isRunning && !timerFinished && (
              <Button variant="secondary" size="sm" onClick={() => setIsRunning(true)}>
                {secondsLeft === FOCUS_DURATION ? "Start Timer" : "Resume"}
              </Button>
            )}
            {isRunning && (
              <Button variant="secondary" size="sm" onClick={() => setIsRunning(false)}>
                Pause
              </Button>
            )}
            {(timerFinished || (secondsLeft < FOCUS_DURATION && !isRunning)) && (
              <Button variant="outline" size="sm" onClick={resetTimer}>
                Restart Timer
              </Button>
            )}
          </div>

          {/* Manual progress actions */}
          {remainingToday > 0 ? (
            <div className="space-y-2 pt-1">
              <Button className="w-full" size="sm" onClick={handleMarkCompleted}>
                Mark current unit as completed
              </Button>
              <Button className="w-full" variant="outline" size="sm" onClick={handleSkip}>
                Skip this unit for now
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-2 pt-1">
              <p className="text-sm font-medium text-primary">Today's target reached 🎉</p>
            </div>
          )}

            {/* Done */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <Button variant="secondary" size="sm" className="w-full" onClick={handleDone}>
                Finish &amp; save progress
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
