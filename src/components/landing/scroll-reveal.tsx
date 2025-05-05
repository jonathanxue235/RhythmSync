'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import useIntersectionObserver from '@/hooks/use-intersection-observer';
import { cn } from '@/lib/utils';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: string; // Tailwind delay class like 'delay-100', 'delay-300'
  threshold?: number;
};

export default function ScrollReveal({
  children,
  className,
  delay = 'delay-0',
  threshold = 0.1, // Trigger when 10% of the element is visible
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, { threshold, freezeOnceVisible: true });
  const isVisible = !!entry?.isIntersecting;

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-1000 ease-out', // Smooth transition
        delay, // Apply delay
        isVisible
          ? 'opacity-100 translate-y-0 blur-0' // Visible state
          : 'opacity-0 translate-y-8 blur-sm', // Initial hidden state (subtle slide up + fade + blur)
        className
      )}
    >
      {children}
    </div>
  );
}
