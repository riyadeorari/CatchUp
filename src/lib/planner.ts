export interface PlanData {
  goalName: string;
  totalUnits: number;
  completedUnits: number;
  startDate: string; // ISO date
  deadline: string; // ISO date
  dailyLog: DailyLog[];
}

export interface DailyLog {
  date: string;
  completed: number;
  target: number;
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

export function savePlan(plan: PlanData) {
  localStorage.setItem("study-plan", JSON.stringify(plan));
}

export function loadPlan(): PlanData | null {
  const raw = localStorage.getItem("study-plan");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPlan() {
  localStorage.removeItem("study-plan");
}
