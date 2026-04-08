import { useQrScanner } from "./useQrScanner";
import { parseSpotifyTrackId } from "./parseSpotify";
import { PermissionGate } from "../../components/PermissionGate";
import { Button } from "../../components/Button";
import { useEffect, useState } from "react";

interface ScannerScreenProps {
  onTrackFound: (trackId: string) => void;
  onClose?: () => void;
}

export const ScannerScreen = ({
  onTrackFound,
  onClose,
}: ScannerScreenProps) => {
  const { videoRef, canvasRef, status, data, error, reset } = useQrScanner();
  const invalidFlash =
    status === "found" && !!data && !parseSpotifyTrackId(data);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    if (status !== "found" || !data) return;

    const trackId = parseSpotifyTrackId(data);
    if (trackId) {
      // Haptic feedback on success
      if (navigator.vibrate) navigator.vibrate(100);
      onTrackFound(trackId);

      // Show "next card" modal when user returns from Spotify
      const handleVisibility = () => {
        if (document.visibilityState === "visible") {
          setShowReturnModal(true);
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);
      return () =>
        document.removeEventListener("visibilitychange", handleVisibility);
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

  const handleNextCard = () => {
    setShowReturnModal(false);
    reset();
  };

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

      {/* Close button */}
      {onClose && (
        <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex justify-center">
          <button
            onClick={onClose}
            aria-label="Scanner schließen"
            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 active:scale-95 transition-all duration-200 backdrop-blur-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Status text */}
      <div
        className={`absolute z-30 left-1/2 -translate-x-1/2 w-[86%] max-w-sm text-center ${onClose ? "bottom-[18%]" : "bottom-[10%]"}`}
      >
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

      {/* Return-from-Spotify modal */}
      {showReturnModal && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-black/70 animate-[fade-in_0.3s_ease-out]">
          <div className="w-full max-w-md mx-4 mb-[max(env(safe-area-inset-bottom),16px)] animate-[slide-up_0.4s_ease-out]">
            <div className="bg-surface rounded-3xl border border-primary/30 shadow-[0_0_30px_var(--color-primary-glow)] p-6 space-y-5">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="text-4xl">🎵</span>
                <h2 className="text-xl font-bold text-white">
                  Song wird gespielt
                </h2>
                <p className="text-text-muted text-sm">
                  Bereit für die nächste Karte?
                </p>
              </div>
              <Button onClick={handleNextCard} className="w-full">
                Nächste Karte scannen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
