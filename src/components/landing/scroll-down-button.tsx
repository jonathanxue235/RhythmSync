
'use client';

import { ArrowDownCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Import cn utility

type ScrollDownButtonProps = {
  targetId: string;
  className?: string;
};

export default function ScrollDownButton({ targetId, className }: ScrollDownButtonProps) {
  const handleClick = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // Ensure smooth scrolling behavior
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.warn(`Scroll target element with ID "${targetId}" not found.`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      // Use cn utility for cleaner class merging and ensure centering classes are applied
      className={cn(
        'absolute bottom-10 left-1/2 transform -translate-x-1/2 w-fit z-10', // Centering using absolute positioning and transform
        'text-foreground/50 hover:text-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'rounded-full p-2 animate-bounce', // Animation and styling
        className // Allow external classes
      )}
      aria-label={`Scroll down to ${targetId.replace(/-/g, ' ')} section`}
    >
      <ArrowDownCircle className="w-8 h-8" />
    </Button>
  );
}
