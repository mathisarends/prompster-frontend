import { Button } from "../../components/Button";

interface HomeScreenProps {
  onStartScan: () => void;
}

export const HomeScreen = ({ onStartScan }: HomeScreenProps) => {
  return (
    <div className="h-full w-full bg-bg flex flex-col items-center justify-between px-6 py-12">
      {/* Top: Branding */}
      <div className="flex flex-col items-center gap-3 mt-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_var(--color-primary-glow)]">
          <svg
            className="w-8 h-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75V16.5ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75V13.5ZM13.5 19.5h.75v.75h-.75V19.5ZM19.5 13.5h.75v.75h-.75V13.5ZM19.5 19.5h.75v.75h-.75V19.5ZM16.5 16.5h.75v.75h-.75V16.5Z"
            />
          </svg>
        </div>
        <h1 className="text-text text-3xl font-bold tracking-tight">Prompster</h1>
        <p className="text-text-muted text-sm text-center">Dein Hitster-Begleiter</p>
      </div>

      {/* Middle: Description */}
      <div className="flex flex-col gap-5 text-center max-w-xs">
        <div className="flex flex-col gap-2">
          <h2 className="text-text text-xl font-semibold">Wie funktioniert's?</h2>
          <p className="text-text-muted text-sm leading-relaxed">
            Scanne den QR-Code auf deiner Hitster-Karte und öffne den Song direkt in Spotify — kein Herumsuchen, einfach spielen.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: "1", text: "Hitster-Karte zur Hand nehmen" },
            { icon: "2", text: "QR-Code scannen" },
            { icon: "3", text: "Song in Spotify öffnen" },
          ].map(({ icon, text }) => (
            <div key={icon} className="flex items-center gap-3 text-left">
              <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {icon}
              </span>
              <span className="text-text-muted text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: CTA */}
      <div className="w-full flex flex-col items-center gap-3">
        <Button onClick={onStartScan} className="w-full">
          Karte scannen
        </Button>
        <p className="text-text-muted text-xs text-center">
          Kamera-Zugriff wird beim ersten Scan angefragt
        </p>
      </div>
    </div>
  );
};
