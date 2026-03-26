import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import PlansListDashboard from "@/components/PlansListDashboard";
import SetupScreen from "@/components/SetupScreen";
import Dashboard from "@/components/Dashboard";
import FocusSession from "@/components/FocusSession";
import OverwhelmMode from "@/components/OverwhelmMode";
import type { PlanData } from "@/lib/planner";
import { savePlan, loadAllPlans, deletePlan, getTodayTarget, migrateOldPlan } from "@/lib/planner";

type Screen = "landing" | "plans" | "setup" | "dashboard" | "focus" | "overwhelm";

const Index = () => {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [screen, setScreen] = useState<Screen>("landing");

  useEffect(() => {
    migrateOldPlan();
    const saved = loadAllPlans();
    setPlans(saved);
    if (saved.length > 0) {
      setScreen("plans");
    }
  }, []);

  const activePlan = plans.find((p) => p.id === activePlanId) || null;

  const handleSetupComplete = (newPlan: PlanData) => {
    savePlan(newPlan);
    const updated = loadAllPlans();
    setPlans(updated);
    setActivePlanId(newPlan.id);
    setScreen("dashboard");
  };

  const handleUnitsCompleted = (units: number) => {
    if (!activePlan) return;
    if (screen !== "focus" || units <= 0) {
      setScreen("dashboard");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const todayTarget = getTodayTarget(activePlan);
    const existingLog = activePlan.dailyLog.find((l) => l.date === today);
    const previouslyCompleted = existingLog ? existingLog.completed : 0;
    const updated: PlanData = {
      ...activePlan,
      completedUnits: Math.min(activePlan.totalUnits, activePlan.completedUnits + units),
      dailyLog: [
        ...activePlan.dailyLog.filter((l) => l.date !== today),
        { date: today, completed: previouslyCompleted + units, target: todayTarget },
      ],
    };
    savePlan(updated);
    setPlans(loadAllPlans());
    setScreen("dashboard");
  };

  const handleDeletePlan = () => {
    if (!activePlanId) return;
    deletePlan(activePlanId);
    const updated = loadAllPlans();
    setPlans(updated);
    setActivePlanId(null);
    setScreen(updated.length > 0 ? "plans" : "landing");
  };

  const openPlan = (id: string) => {
    setActivePlanId(id);
    setScreen("dashboard");
  };

  if (screen === "landing") {
    return (
      <LandingPage
        onGetStarted={() => setScreen(plans.length > 0 ? "plans" : "setup")}
      />
    );
  }

  if (screen === "plans") {
    return (
      <PlansListDashboard
        plans={plans}
        onCreateNew={() => setScreen("setup")}
        onOpenPlan={openPlan}
      />
    );
  }

  if (screen === "setup") {
    return (
      <SetupScreen
        onComplete={handleSetupComplete}
        onBack={() => setScreen(plans.length > 0 ? "plans" : "landing")}
      />
    );
  }

  if (screen === "focus" && activePlan) {
    return (
      <FocusSession
        plan={activePlan}
        onComplete={handleUnitsCompleted}
        onCancel={() => setScreen("dashboard")}
      />
    );
  }

  if (screen === "overwhelm" && activePlan) {
    return (
      <OverwhelmMode
        onStartFocus={() => setScreen("focus")}
        onBack={() => setScreen("dashboard")}
      />
    );
  }

  if (activePlan) {
    return (
      <Dashboard
        plan={activePlan}
        onStartFocus={() => setScreen("focus")}
        onOverwhelm={() => setScreen("overwhelm")}
        onReset={handleDeletePlan}
        onBack={() => setScreen("plans")}
      />
    );
  }

  return <LandingPage onGetStarted={() => setScreen("setup")} />;
};

export default Index;
