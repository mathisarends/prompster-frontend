import { useQrScanner } from "./useQrScanner";
import { parseSpotifyTrackId } from "./parseSpotify";
import { PermissionGate } from "../../components/PermissionGate";
import { useEffect } from "react";

interface ScannerScreenProps {
  onTrackFound: (trackId: string) => void;
}

export const ScannerScreen = ({ onTrackFound }: ScannerScreenProps) => {
  const { videoRef, canvasRef, status, data, error, reset } = useQrScanner();
  const invalidFlash =
    status === "found" && !!data && !parseSpotifyTrackId(data);

  useEffect(() => {
    if (status !== "found" || !data) return;

    const trackId = parseSpotifyTrackId(data);
    if (trackId) {
      // Haptic feedback on success
      if (navigator.vibrate) navigator.vibrate(100);
      onTrackFound(trackId);
    } else {
      // Invalid QR — shake & continue scanning
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
      const timer = setTimeout(() => {
        reset();
      }, 1800);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [status, data, onTrackFound, reset]);

  if (status === "error") {
    return (
      <div className="h-full bg-bg">
        <PermissionGate
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
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

      {/* Dark overlay with centered rounded cutout */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-80 aspect-square rounded-3xl shadow-[0_0_0_9999px_rgba(0,0,0,0.78)]" />
      </div>

      {/* Scan frame */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6">
        <div
          className={`relative w-full max-w-80 aspect-square rounded-3xl border-[3px] transition-colors duration-300 ${
            invalidFlash
              ? "border-error animate-[shake_0.4s_ease-in-out]"
              : status === "found"
                ? "border-success animate-[neon-pulse-success_1s_ease-in-out_infinite]"
                : "border-secondary animate-[neon-pulse_2s_ease-in-out_infinite]"
          }`}
        >
          {/* Target hitmarkers */}
          <div className="absolute -top-6 -left-6 h-10 w-10 rounded-tl-2xl border-t-4 border-l-4 border-white/95" />
          <div className="absolute -top-6 -right-6 h-10 w-10 rounded-tr-2xl border-t-4 border-r-4 border-white/95" />
          <div className="absolute -bottom-6 -left-6 h-10 w-10 rounded-bl-2xl border-b-4 border-l-4 border-white/95" />
          <div className="absolute -bottom-6 -right-6 h-10 w-10 rounded-br-2xl border-b-4 border-r-4 border-white/95" />
        </div>
      </div>

      {/* Status text */}
      <div className="absolute z-30 bottom-[10%] left-1/2 -translate-x-1/2 w-[86%] max-w-sm text-center">
        {invalidFlash ? (
          <div className="animate-[shake_0.4s_ease-in-out] px-4 py-3">
            <p className="text-error font-bold text-lg">Kein Spotify-QR-Code</p>
            <p className="text-white/80 text-sm mt-1">
              Versuche eine Hitster-Karte
            </p>
          </div>
        ) : status === "scanning" || status === "idle" ? (
          <div className="px-4 py-3">
            <p className="text-white font-semibold text-lg">
              Hitster-Karte scannen
            </p>
            <p className="text-white/80 text-sm mt-1">
              Halte den QR-Code in den Rahmen
            </p>
          </div>
        ) : status === "found" ? (
          <p className="px-4 py-3 text-success font-bold text-lg">
            Song gefunden! 🎵
          </p>
        ) : null}
      </div>
    </div>
  );
};
