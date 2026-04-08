import { useState } from "react";
import { Button } from "../../components/Button";

interface TutorialOverlayProps {
  onDone: () => void;
}

const steps = [
  {
    icon: "📸",
    title: "Karte scannen",
    description: "Halte dein Handy über den QR-Code einer Hitster-Karte.",
  },
  {
    icon: "⚡",
    title: "Automatisch erkennen",
    description: "Der QR-Code wird sofort erkannt — kein Tippen nötig.",
  },
  {
    icon: "🎵",
    title: "Song in Spotify öffnen",
    description: "Öffne den Song direkt in der Spotify-App oder im Web Player.",
  },
];

export function TutorialOverlay({ onDone }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function next() {
    if (isLast) {
      onDone();
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-bg/95 flex flex-col items-center justify-center px-6 animate-[fade-in_0.3s_ease-out]">
      {/* Skip button */}
      <button
        onClick={onDone}
        className="absolute top-[max(env(safe-area-inset-top),16px)] right-4 text-text-muted text-sm hover:text-text transition-colors cursor-pointer"
      >
        Überspringen
      </button>

      {/* Logo */}
      <h1 className="text-3xl font-black tracking-[0.15em] text-white drop-shadow-[0_0_15px_var(--color-primary-glow)] mb-12">
        HITSTER
      </h1>

      {/* Step content */}
      <div className="flex flex-col items-center gap-6 max-w-xs text-center">
        <div className="w-24 h-24 rounded-full bg-surface-elevated flex items-center justify-center text-5xl shadow-[0_0_30px_var(--color-primary-glow)]">
          {current.icon}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{current.title}</h2>
          <p className="text-text-muted leading-relaxed">
            {current.description}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex flex-col items-center gap-6 w-full max-w-xs">
        <Button onClick={next} className="w-full">
          {isLast ? "Los geht's!" : "Weiter"}
        </Button>

        {/* Dots indicator */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "bg-primary w-6 shadow-[0_0_8px_var(--color-primary-glow)]"
                  : i < step
                    ? "bg-primary/50"
                    : "bg-text-muted/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step counter */}
      <p className="absolute bottom-[max(env(safe-area-inset-bottom),24px)] text-text-muted text-xs">
        {step + 1} / {steps.length}
      </p>
    </div>
  );
}
