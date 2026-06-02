'use client';

import SenticLogo from './SenticLogo';

type SenticRefreshButtonProps = {
  className?: string;
};

export default function SenticRefreshButton({ className = '' }: SenticRefreshButtonProps) {
  return (
    <button
      type="button"
      aria-label="Refresh page"
      onClick={() => window.location.reload()}
      className={`inline-flex items-center justify-center transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] ${className}`.trim()}
    >
      <SenticLogo className="text-3xl" />
    </button>
  );
}