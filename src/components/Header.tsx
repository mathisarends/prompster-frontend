export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center pt-[max(env(safe-area-inset-top),12px)] pb-2">
      <h1 className="text-2xl md:text-3xl font-black tracking-[0.15em] text-white drop-shadow-[0_0_15px_var(--color-primary-glow)]">
        HITSTER
      </h1>
    </header>
  );
}
