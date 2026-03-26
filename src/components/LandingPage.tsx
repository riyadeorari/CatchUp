import { Button } from "@/components/ui/button";
import { Sparkles, Target, RefreshCw } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Brand */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            CatchUp
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Plan your work. Catch up when life gets in the way.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-4 text-left">
          <FeatureRow
            icon={<Target className="h-5 w-5 text-primary" />}
            text="Break work into daily targets that adapt to your pace."
          />
          <FeatureRow
            icon={<Sparkles className="h-5 w-5 text-accent" />}
            text="Stay focused with built-in Pomodoro sessions."
          />
          <FeatureRow
            icon={<RefreshCw className="h-5 w-5 text-primary" />}
            text="Fall behind? CatchUp redistributes work automatically."
          />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          CatchUp helps learners and goal-driven users break work into daily targets,
          stay focused with Pomodoro sessions, and automatically recover when they fall behind.
        </p>

        {/* CTA */}
        <Button onClick={onGetStarted} size="lg" className="px-10 text-base">
          Get Started
        </Button>
      </div>
    </div>
  );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-card p-4 border border-border/50">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <p className="text-sm text-foreground">{text}</p>
    </div>
  );
}
