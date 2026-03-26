import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverwhelmModeProps {
  onStartFocus: () => void;
  onBack: () => void;
}

const suggestions = [
  { emoji: "📖", text: "Read just 1 chapter" },
  { emoji: "⏱️", text: "Study for 10 minutes" },
  { emoji: "📝", text: "Open your notes and begin" },
  { emoji: "🎯", text: "Focus only on the next small step" },
];

export default function OverwhelmMode({ onStartFocus, onBack }: OverwhelmModeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm border-border/50 shadow-lg text-center">
        <CardHeader className="pb-2 space-y-2">
          <div className="text-3xl">🫂</div>
          <CardTitle className="text-xl font-semibold">It's okay. Take a breath.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground text-sm leading-relaxed">
            You don't need to finish everything right now. Just begin with one small step.
          </p>

          <div className="space-y-2">
            {suggestions.map((s) => (
              <div
                key={s.text}
                className="rounded-lg bg-secondary px-4 py-3 flex items-center gap-3 text-left"
              >
                <span className="text-lg">{s.emoji}</span>
                <span className="text-sm text-secondary-foreground">{s.text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Pick any one thing above. That's enough for now.
          </p>

          <div className="space-y-2">
            <Button onClick={onStartFocus} className="w-full">
              Go to focus session
            </Button>
            <Button onClick={onBack} variant="secondary" className="w-full">
              Return to my plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
