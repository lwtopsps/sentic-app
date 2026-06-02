'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import SenticLogo from './SenticLogo';

type LoadingOverlayProps = {
  children: ReactNode;
  isFetching?: boolean;
};

export default function LoadingOverlay({ children, isFetching = false }: LoadingOverlayProps) {
  const [documentReady, setDocumentReady] = useState(false);

  useEffect(() => {
    const syncDocumentState = () => {
      setDocumentReady(document.readyState === 'complete');
    };

    syncDocumentState();
    document.addEventListener('readystatechange', syncDocumentState);

    return () => {
      document.removeEventListener('readystatechange', syncDocumentState);
    };
  }, []);

  const isLoading = !documentReady || isFetching;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050506] text-[#f5f6f7]">
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-lg transition-[opacity,backdrop-filter,transform] duration-700 ease-out ${
          isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.01]'
        }`}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[140px] sm:h-[38rem] sm:w-[38rem]" />
          <div className="absolute left-[42%] top-[40%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-[110px]" />
          <div className="absolute left-[58%] top-[60%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 transition-transform duration-700 ease-out">
          <SenticLogo className="text-4xl tracking-[0.22em] text-white sm:text-6xl" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">Loading</span>
        </div>
      </div>

      <div
        className={`relative z-0 transition-[opacity,transform,filter] duration-700 ease-out ${
          isLoading ? 'pointer-events-none scale-[1.01] opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}