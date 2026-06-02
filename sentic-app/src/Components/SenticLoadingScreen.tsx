'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

import SenticLogo from './SenticLogo';

type SenticLoadingScreenProps = {
  children: ReactNode;
  isFetching?: boolean;
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
};

export default function SenticLoadingScreen({
  children,
  isFetching = false,
  className = '',
  contentClassName = '',
  overlayClassName = '',
}: SenticLoadingScreenProps) {
  const [documentComplete, setDocumentComplete] = useState(false);

  useEffect(() => {
    const updateDocumentState = () => {
      setDocumentComplete(document.readyState === 'complete');
    };

    updateDocumentState();
    document.addEventListener('readystatechange', updateDocumentState);
    window.addEventListener('load', updateDocumentState);

    return () => {
      document.removeEventListener('readystatechange', updateDocumentState);
      window.removeEventListener('load', updateDocumentState);
    };
  }, []);

  const isLoading = !documentComplete || isFetching;

  return (
    <div className={`relative min-h-screen overflow-hidden bg-[#0a0a0a] text-[#f5f5f7] ${className}`.trim()}>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] transition-[opacity,transform] duration-700 ease-out ${
          isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'
        } ${overlayClassName}`.trim()}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/12 blur-[140px] sm:h-[44rem] sm:w-[44rem]" />
          <div className="absolute left-[42%] top-[38%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[110px]" />
          <div className="absolute left-[58%] top-[62%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/8 blur-[120px]" />
        </div>

        <div className="relative z-10 flex items-center justify-center px-6 transition-transform duration-700 ease-out">
          <SenticLogo className="text-4xl tracking-[0.18em] sm:text-6xl" />
        </div>
      </div>

      <div
        className={`relative z-0 transition-[opacity,transform,filter] duration-700 ease-out ${
          isLoading ? 'pointer-events-none scale-[1.02] opacity-0 blur-sm' : 'scale-100 opacity-100 blur-0'
        } ${contentClassName}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}