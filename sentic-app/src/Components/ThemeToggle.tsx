"use client";

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mode, setMode] = useState<'dark'|'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') setMode('light');
  }, []);

  useEffect(() => {
    if (mode === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [mode]);

  return (
    <button
      onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      className="px-3 py-1 rounded bg-white/5 text-sm text-neutral-200"
    >
      {mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
