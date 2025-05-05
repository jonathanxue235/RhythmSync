'use client';

import type { ReactNode, CSSProperties } from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

type ScrollDrivenAnimationProps = {
  children: ReactNode;
  className?: string;
  /** Start animation when element top hits viewport bottom (0) or center (0.5) or top (1)? Default 0.5 */
  startOffset?: number; // Note: This prop is currently less relevant with the center-based logic, but kept for potential future use.
  /** End animation when element bottom hits viewport bottom (0) or center (0.5) or top (1)? Default 0.5 */
  endOffset?: number; // Note: This prop is currently less relevant with the center-based logic, but kept for potential future use.
  /** Style applied based on scroll progress (0 to 1) */
  styleGenerator: (progress: number) => CSSProperties;
};

export default function ScrollDrivenAnimation({
  children,
  className,
  startOffset = 0.5, // Keep prop, but logic below primarily uses center-viewport calculation
  endOffset = 0.5,   // Keep prop, but logic below primarily uses center-viewport calculation
  styleGenerator,
}: ScrollDrivenAnimationProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Avoid division by zero or invalid calculations if viewportHeight is 0 or less
      if (viewportHeight <= 0) {
          setProgress(0); // Set a default progress
          return;
      }

      // --- Revised Progress Calculation ---
      // Calculate the element's center position relative to the viewport center.
      // Positive value means element center is below viewport center.
      // Negative value means element center is above viewport center.
      const elementCenterY = rect.top + rect.height / 2;
      const viewportCenterY = viewportHeight / 2;
      const distanceToCenter = elementCenterY - viewportCenterY;

      // Define the range over which the animation occurs (e.g., half the viewport height above and below the center)
      // You can adjust this range. A smaller range makes the animation faster.
      const animationRange = viewportHeight * 0.75; // Animate over 75% of the viewport height centered around the middle

      // Calculate progress: 0 when element center is at the bottom of the range, 1 when at the top.
      // Map the distanceToCenter (which ranges roughly from +animationRange/2 to -animationRange/2) to a 0-1 scale.
      const elementProgress = 0.5 - distanceToCenter / animationRange;


      // Clamp progress between 0 and 1, AND ensure it's not NaN
      const clampedProgress = Math.max(0, Math.min(1, isNaN(elementProgress) ? 0 : elementProgress));

      setProgress(clampedProgress);
    };

    // Throttling the scroll event
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', throttledScrollHandler);
    window.addEventListener('resize', throttledScrollHandler); // Recalculate on resize

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
    };
  // Dependency array includes offsets in case future logic uses them, and the styleGenerator function reference.
  }, [startOffset, endOffset, styleGenerator]);

  // Ensure progress passed to styleGenerator is never NaN
  const safeProgress = isNaN(progress) ? 0 : progress;
  const animatedStyle = styleGenerator(safeProgress);

  return (
    <div ref={ref} className={cn(className)}>
      {/* Apply the potentially animated style */}
      <div style={animatedStyle}>
        {children}
      </div>
    </div>
  );
}
