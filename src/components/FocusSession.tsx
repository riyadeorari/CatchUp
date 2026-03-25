import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PlanData } from "@/lib/planner";
import { getTodayTarget } from "@/lib/planner";

interface FocusSessionProps {
  plan: PlanData;
  onComplete: (unitsCompleted: number) => void;
  onCancel: () => void;
}

const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds

export default function FocusSession({ plan, onComplete, onCancel }: FocusSessionProps) {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const todayTarget = getTodayTarget(plan);

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
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return clearTimer;
  }, [isRunning, clearTimer]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPct = ((FOCUS_DURATION - secondsLeft) / FOCUS_DURATION) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm border-border/50 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl font-semibold">Focus Session</CardTitle>
          <p className="text-muted-foreground text-sm">
            Today's target: {todayTarget} unit{todayTarget !== 1 ? "s" : ""}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer circle */}
          <div className="relative w-48 h-48 mx-auto">
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
              <span className="text-4xl font-semibold tabular-nums">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {secondsLeft === 0 ? "Time's up!" : isRunning ? "Focusing…" : "Paused"}
              </span>
            </div>
          </div>

          {/* Pause/Resume */}
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRunning((r) => !r)}
              disabled={secondsLeft === 0}
            >
              {isRunning ? "Pause" : "Resume"}
            </Button>
          </div>

          {/* Completion buttons */}
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">How did it go?</p>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => onComplete(todayTarget)} size="sm">
                Completed ({todayTarget})
              </Button>
              <Button onClick={() => onComplete(Math.max(1, Math.floor(todayTarget / 2)))} variant="secondary" size="sm">
                Partial ({Math.max(1, Math.floor(todayTarget / 2))})
              </Button>
              <Button onClick={() => onComplete(0)} variant="outline" size="sm">
                Skipped
              </Button>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="block mx-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Back to dashboard
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
