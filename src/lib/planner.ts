export interface PlanData {
  id: string;
  goalName: string;
  totalUnits: number;
  completedUnits: number;
  startDate: string;
  deadline: string;
  dailyLog: DailyLog[];
}

export interface DailyLog {
  date: string;
  completed: number;
  target: number;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getDaysLeft(deadline: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(deadline);
  end.setHours(0, 0, 0, 0);
  const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export function getRemainingUnits(plan: PlanData): number {
  return Math.max(0, plan.totalUnits - plan.completedUnits);
}

export function getTodayTarget(plan: PlanData): number {
  const remaining = getRemainingUnits(plan);
  const days = getDaysLeft(plan.deadline);
  if (days <= 0) return remaining;
  return Math.ceil(remaining / days);
}

export function getSmallestStep(plan: PlanData): number {
  const target = getTodayTarget(plan);
  return Math.max(1, Math.ceil(target / 4));
}

const STORAGE_KEY = "catchup-plans";

export function saveAllPlans(plans: PlanData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function loadAllPlans(): PlanData[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function savePlan(plan: PlanData) {
  const plans = loadAllPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx >= 0) {
    plans[idx] = plan;
  } else {
    plans.push(plan);
  }
  saveAllPlans(plans);
}

export function deletePlan(id: string) {
  const plans = loadAllPlans().filter((p) => p.id !== id);
  saveAllPlans(plans);
}

// Migration: convert old single-plan storage to new format
export function migrateOldPlan() {
  const old = localStorage.getItem("study-plan");
  if (!old) return;
  try {
    const parsed = JSON.parse(old);
    if (parsed && parsed.goalName) {
      const migrated: PlanData = { ...parsed, id: parsed.id || generateId() };
      const existing = loadAllPlans();
      if (!existing.find((p) => p.goalName === migrated.goalName)) {
        existing.push(migrated);
        saveAllPlans(existing);
      }
      localStorage.removeItem("study-plan");
    }
  } catch {
    localStorage.removeItem("study-plan");
  }
}
