'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const pageTransition: Variants = {
  initial: {
    x: '12%',
    opacity: 0,
    filter: 'blur(8px)',
  },
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.62,
      ease: smoothEase,
    },
  },
  exit: {
    x: '-12%',
    opacity: 0,
    filter: 'blur(8px)',
    transition: {
      duration: 0.5,
      ease: smoothEase,
    },
  },
};

type RouteTransitionProps = {
  children: ReactNode;
};

export default function RouteTransition({ children }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-full"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}