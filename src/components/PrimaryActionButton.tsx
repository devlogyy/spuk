import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  /** Sticky bottom bar on mobile */
  sticky?: boolean;
  icon?: ReactNode;
}

export function PrimaryActionButton({ onClick, loading, disabled, children, sticky, icon }: Props) {
  const btn = (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-gold px-6 text-base font-bold text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-56"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : icon}
      {loading ? "Searching…" : children}
    </button>
  );

  if (!sticky) return btn;

  return (
    <>
      {/* desktop inline */}
      <div className="hidden sm:block">{btn}</div>
      {/* mobile sticky */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur sm:hidden"
      >
        {btn}
      </div>
      {/* spacer so content isn't hidden behind sticky bar */}
      <div className="h-20 sm:hidden" aria-hidden />
    </>
  );
}
