export function AppFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-black/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-sm text-[var(--muted)] sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <span>Research/demo simulator only. Not for clinical use.</span>
        <span className="text-monitor text-xs uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Playback uses saved model artifacts and mock-safe fallbacks
        </span>
      </div>
    </footer>
  );
}
