import { useState, useEffect } from "react";
import SetupScreen from "@/components/SetupScreen";
import Dashboard from "@/components/Dashboard";
import FocusSession from "@/components/FocusSession";
import OverwhelmMode from "@/components/OverwhelmMode";
import type { PlanData } from "@/lib/planner";
import { savePlan, loadPlan, clearPlan, getTodayTarget } from "@/lib/planner";

type Screen = "setup" | "dashboard" | "focus" | "overwhelm";

const Index = () => {
  const [plan, setPlan] = useState<PlanData | null>(null);
  const [screen, setScreen] = useState<Screen>("setup");

  useEffect(() => {
    const saved = loadPlan();
    if (saved) {
      setPlan(saved);
      setScreen("dashboard");
    }
  }, []);

  const handleSetupComplete = (newPlan: PlanData) => {
    setPlan(newPlan);
    savePlan(newPlan);
    setScreen("dashboard");
  };

  const handleUnitsCompleted = (units: number) => {
    if (!plan) return;
    const today = new Date().toISOString().split("T")[0];
    const todayTarget = getTodayTarget(plan);
    const existingLog = plan.dailyLog.find((l) => l.date === today);
    const previouslyCompleted = existingLog ? existingLog.completed : 0;
    const updated: PlanData = {
      ...plan,
      completedUnits: Math.min(plan.totalUnits, plan.completedUnits + units),
      dailyLog: [
        ...plan.dailyLog.filter((l) => l.date !== today),
        { date: today, completed: previouslyCompleted + units, target: todayTarget },
      ],
    };
    setPlan(updated);
    savePlan(updated);
    setScreen("dashboard");
  };

  const handleReset = () => {
    clearPlan();
    setPlan(null);
    setScreen("setup");
  };

  if (!plan || screen === "setup") {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (screen === "focus") {
    return (
      <FocusSession
        plan={plan}
        onComplete={handleUnitsCompleted}
        onCancel={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "overwhelm") {
    return (
      <OverwhelmMode
        plan={plan}
        onComplete={handleUnitsCompleted}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      plan={plan}
      onStartFocus={() => setScreen("focus")}
      onOverwhelm={() => setScreen("overwhelm")}
      onReset={handleReset}
    />
  );
};

export default Index;
