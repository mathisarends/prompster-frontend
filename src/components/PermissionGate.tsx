import { Button } from "./Button";

interface PermissionGateProps {
  error: string | null;
  onRetry: () => void;
}

export const PermissionGate = ({ error, onRetry }: PermissionGateProps) => {
  const isDenied = error === "permission-denied";

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6">
      {/* Camera icon */}
      <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center">
        <svg
          className="w-12 h-12 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {isDenied ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 015.636 5.636"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
          )}
          {!isDenied && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          )}
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">
          {isDenied ? "Kamera blockiert" : "Kamera nicht verfügbar"}
        </h2>
        <p className="text-text-muted leading-relaxed max-w-xs mx-auto">
          {isDenied
            ? "Du hast den Kamerazugriff abgelehnt. Bitte erlaube den Zugriff in deinen Browser-Einstellungen und lade die Seite neu."
            : "Die Kamera konnte nicht gestartet werden. Stelle sicher, dass kein anderes Programm die Kamera verwendet."}
        </p>
      </div>

      {isDenied ? (
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Seite neu laden
        </Button>
      ) : (
        <Button variant="secondary" onClick={onRetry}>
          Erneut versuchen
        </Button>
      )}
    </div>
  );
};
