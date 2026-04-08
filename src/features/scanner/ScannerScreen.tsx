import { useQrScanner } from "./useQrScanner";
import { parseSpotifyTrackId } from "./parseSpotify";
import { Header } from "../../components/Header";
import { PermissionGate } from "../../components/PermissionGate";
import { useEffect, useState } from "react";

interface ScannerScreenProps {
  onTrackFound: (trackId: string) => void;
}

export function ScannerScreen({ onTrackFound }: ScannerScreenProps) {
  const { videoRef, canvasRef, status, data, error, reset } = useQrScanner();
  const [invalidFlash, setInvalidFlash] = useState(false);

  useEffect(() => {
    if (status !== "found" || !data) return;

    const trackId = parseSpotifyTrackId(data);
    if (trackId) {
      // Haptic feedback on success
      if (navigator.vibrate) navigator.vibrate(100);
      onTrackFound(trackId);
    } else {
      // Invalid QR — shake & continue scanning
      setInvalidFlash(true);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      const timer = setTimeout(() => {
        setInvalidFlash(false);
        reset();
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [status, data, onTrackFound, reset]);

  if (status === "error") {
    return (
      <div className="h-full bg-bg">
        <Header />
        <PermissionGate
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <Header />

      {/* Hidden canvas for QR processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera feed */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Dark overlay with cutout */}
      <div className="absolute inset-0 z-10">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 h-[25%] bg-black/60" />
        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-black/60" />
        {/* Left bar */}
        <div className="absolute top-[25%] left-0 w-[12%] h-[45%] bg-black/60" />
        {/* Right bar */}
        <div className="absolute top-[25%] right-0 w-[12%] h-[45%] bg-black/60" />
      </div>

      {/* Scan frame */}
      <div className="absolute z-20 top-[25%] left-[12%] right-[12%] h-[45%] flex items-center justify-center">
        <div
          className={`w-full h-full max-w-72 max-h-72 rounded-3xl border-3 transition-colors duration-300 ${
            invalidFlash
              ? "border-error animate-[shake_0.4s_ease-in-out]"
              : status === "found"
                ? "border-success animate-[neon-pulse-success_1s_ease-in-out_infinite]"
                : "border-secondary animate-[neon-pulse_2s_ease-in-out_infinite]"
          }`}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-current rounded-tl-3xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-current rounded-tr-3xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-current rounded-bl-3xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-current rounded-br-3xl" />
        </div>
      </div>

      {/* Status text */}
      <div className="absolute z-30 bottom-[18%] left-0 right-0 text-center">
        {invalidFlash ? (
          <div className="animate-[shake_0.4s_ease-in-out]">
            <p className="text-error font-bold text-lg">Kein Spotify-QR-Code</p>
            <p className="text-text-muted text-sm mt-1">
              Versuche eine Hitster-Karte
            </p>
          </div>
        ) : status === "scanning" || status === "idle" ? (
          <div>
            <p className="text-white font-semibold text-lg">
              Hitster-Karte scannen
            </p>
            <p className="text-text-muted text-sm mt-1">
              Halte den QR-Code in den Rahmen
            </p>
          </div>
        ) : status === "found" ? (
          <p className="text-success font-bold text-lg">Song gefunden! 🎵</p>
        ) : null}
      </div>
    </div>
  );
}
