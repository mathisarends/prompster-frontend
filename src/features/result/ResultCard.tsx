import { Button } from "../../components/Button";
import { openSpotifyTrack, copyTrackLink } from "../../utils/openSpotify";
import { useState } from "react";

interface ResultCardProps {
  trackId: string;
  onNextCard: () => void;
}

export const ResultCard = ({ trackId, onNextCard }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleOpen = () => {
    openSpotifyTrack(trackId);
  };

  const handleCopy = async () => {
    try {
      await copyTrackLink(trackId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — ignore silently
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 animate-[fade-in_0.3s_ease-out]">
      <div className="w-full max-w-md mx-4 mb-[max(env(safe-area-inset-bottom),16px)] md:mb-0 animate-[slide-up_0.4s_ease-out]">
        <div className="bg-surface rounded-3xl border border-primary/30 shadow-[0_0_30px_var(--color-primary-glow)] p-6 space-y-5">
          {/* Success indicator */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-[glow-flash_1s_ease-out]">
              <span className="text-3xl">🎵</span>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">Song gefunden!</h2>
              <p className="text-text-muted text-sm mt-1 font-mono">
                Track: {trackId.slice(0, 8)}…{trackId.slice(-4)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={handleOpen} className="w-full">
              🎧 In Spotify öffnen
            </Button>

            <Button variant="secondary" onClick={onNextCard} className="w-full">
              Nächste Karte scannen
            </Button>
          </div>

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="w-full text-center text-sm text-text-muted hover:text-text transition-colors cursor-pointer py-1"
          >
            {copied ? "✓ Link kopiert!" : "Link kopieren"}
          </button>
        </div>
      </div>
    </div>
  );
};
