import { useState, useCallback } from "react";
import { ScannerScreen } from "./features/scanner/ScannerScreen";
import { ResultCard } from "./features/result/ResultCard";
import { TutorialOverlay } from "./features/tutorial/TutorialOverlay";

type AppScreen = "tutorial" | "scanner" | "result";

const TUTORIAL_KEY = "hitster_tutorial_seen";

function App() {
  const tutorialSeen = localStorage.getItem(TUTORIAL_KEY) === "true";
  const [screen, setScreen] = useState<AppScreen>(
    tutorialSeen ? "scanner" : "tutorial",
  );
  const [trackId, setTrackId] = useState<string | null>(null);

  const handleTutorialDone = useCallback(() => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setScreen("scanner");
  }, []);

  const handleTrackFound = useCallback((id: string) => {
    setTrackId(id);
    setScreen("result");
  }, []);

  const handleNextCard = useCallback(() => {
    setTrackId(null);
    setScreen("scanner");
  }, []);

  return (
    <div className="h-full w-full bg-bg md:flex md:items-center md:justify-center">
      {/* Desktop: centered container for phone-like experience */}
      <div className="h-full w-full md:max-w-md md:h-[85vh] md:max-h-[900px] md:rounded-3xl md:overflow-hidden md:shadow-[0_0_60px_var(--color-primary-glow)] md:border md:border-primary/20 relative">
        {screen === "tutorial" && (
          <TutorialOverlay onDone={handleTutorialDone} />
        )}

        {/* Scanner always mounted for instant return */}
        <div className={screen === "scanner" ? "h-full" : "h-full hidden"}>
          <ScannerScreen onTrackFound={handleTrackFound} />
        </div>

        {screen === "result" && trackId && (
          <ResultCard trackId={trackId} onNextCard={handleNextCard} />
        )}
      </div>
    </div>
  );
}

export default App;
