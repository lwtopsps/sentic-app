'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

const panelVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/10"
        aria-expanded={isOpen}
        aria-controls="sentic-sidebar"
      >
        <span className="text-base leading-none">☰</span>
        <span>{isOpen ? 'Close' : 'Menu'}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.aside
            id="sentic-sidebar"
            key="sentic-sidebar"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            className="fixed inset-y-0 left-0 z-40 w-[18rem] border-r border-white/10 bg-[#070708]/95 px-5 py-6 shadow-[16px_0_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="mb-8 pt-12" />
            <nav className="space-y-3">
              <Link
                href="/home"
                className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/login"
                className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </Link>
            </nav>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
