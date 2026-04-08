import { useState, useCallback } from "react";
import { ScannerScreen } from "./features/scanner/ScannerScreen";
import { HomeScreen } from "./features/home/HomeScreen";
import { openSpotifyTrack } from "./utils/openSpotify";

type AppScreen = "home" | "scanner";

const App = () => {
  const [screen, setScreen] = useState<AppScreen>("home");

  const handleTrackFound = useCallback((id: string) => {
    openSpotifyTrack(id);
  }, []);

  const handleStartScan = useCallback(() => {
    setScreen("scanner");
  }, []);

  const handleCloseScanner = useCallback(() => {
    setScreen("home");
  }, []);

  return (
    <div className="h-full w-full bg-bg md:flex md:items-center md:justify-center">
      {/* Desktop: centered container for phone-like experience */}
      <div className="h-full w-full md:max-w-md md:h-[85vh] md:max-h-[900px] md:rounded-3xl md:overflow-hidden md:shadow-[0_0_60px_var(--color-primary-glow)] md:border md:border-primary/20 relative">
        {screen === "home" && <HomeScreen onStartScan={handleStartScan} />}

        {/* Scanner always mounted while active for instant return */}
        <div className={screen === "scanner" ? "h-full" : "h-full hidden"}>
          <ScannerScreen
            onTrackFound={handleTrackFound}
            onClose={handleCloseScanner}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
