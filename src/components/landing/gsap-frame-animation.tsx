
'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type GsapFrameAnimationProps = {
  className?: string;
  style?: CSSProperties;
  frameCount: number;
  framePathPrefix: string; // e.g., "/frames/"
  frameFileExtension?: string; // e.g., "jpg", "png"
  canvasWidth: number;
  canvasHeight: number;
  /** The scroll duration in pixels or a selector string. Determines how long the animation takes to complete during scroll. Defaults to '200%' (twice the viewport height). */
  scrollDuration?: string | number;
};

export default function GsapFrameAnimation({
  className,
  style,
  frameCount,
  framePathPrefix,
  frameFileExtension = 'png',
  canvasWidth,
  canvasHeight,
  scrollDuration = '200%', // Default duration: scrolls twice the viewport height
}: GsapFrameAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the main container to pin
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null); // Ref for the text
  const cropPixels = 2; // <<< Number of pixels to crop from each side

  const getFrameSrc = useCallback((index: number): string => {
    // Frame numbers start from 48 as per previous logic
    const frameNumber = (index + 48).toString();
    return `${framePathPrefix}${frameNumber}.${frameFileExtension}`;
  }, [framePathPrefix, frameFileExtension]);

  // Function to draw image cropped
  const drawCroppedImage = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    // Source rectangle (crop from original image)
    const sx = cropPixels;
    const sy = cropPixels;
    const sWidth = img.naturalWidth - cropPixels * 2;
    const sHeight = img.naturalHeight - cropPixels * 2;

    // Destination rectangle (fill the canvas)
    const dx = 0;
    const dy = 0;
    const dWidth = canvasWidth;
    const dHeight = canvasHeight;

    // Clear canvas before drawing
    ctx.fillStyle = '#e9e9e9'; // Ensure background is cleared with the correct color
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw the cropped image onto the canvas, scaling it to fit
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  }, [canvasWidth, canvasHeight]);

  // Preload images
  useEffect(() => {
    setIsLoading(true);
    setLoadError(null);
    let loadedCount = 0;
    let errored = false;

    imagesRef.current = []; // Clear previous images if props change

    if (frameCount <= 0) {
      setIsLoading(false);
      setLoadError("frameCount must be a positive number.");
      return;
    }

    const loadPromises = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      imagesRef.current[i] = img; // Store image elements (0-based index)

      const promise = new Promise<void>((resolve, reject) => {
        img.onload = () => {
          loadedCount++;
          // Optionally update loading progress here
          resolve();
        };
        img.onerror = () => {
          if (!errored) {
            errored = true;
            const failedSrc = getFrameSrc(i);
            console.error(`Failed to load image: ${failedSrc}`);
            setLoadError(`Failed to load frame ${i + 48}. Check console & path: ${framePathPrefix}`);
          }
          reject(new Error(`Failed to load frame ${i + 48}`));
        };
      });

      img.src = getFrameSrc(i);
      loadPromises.push(promise);
    }

    Promise.all(loadPromises)
      .then(() => {
        if (!errored) {
          setIsLoading(false);
          // Draw the first frame once all loaded
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext('2d');
          if (ctx && imagesRef.current[0]) {
            drawCroppedImage(ctx, imagesRef.current[0]); // Draw cropped first frame
          }
        }
      })
      .catch(() => {
        // Error state is already set in onerror
        setIsLoading(false);
      });

  }, [frameCount, getFrameSrc, drawCroppedImage, framePathPrefix]); // Rerun if props change

  // GSAP ScrollTrigger Animation Setup
  useEffect(() => {
    if (isLoading || loadError || !canvasRef.current || !containerRef.current || !textRef.current) {
      return; // Don't run GSAP setup until loaded and refs are available
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Object to animate the frame index
    const frameData = { frame: 0 };

    // MASTER Timeline combining frame animation and text animation
    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true, // Pin the container
        scrub: 0.5, // Smooth scrubbing effect
        start: 'top top', // When the top of the trigger hits the top of the viewport
        end: `+=${scrollDuration}`, // End after scrolling duration
        // markers: true, // Uncomment for debugging
      },
    });

    // --- Frame Animation ---
    masterTl.to(frameData, {
      frame: frameCount - 1,
      snap: 'frame', // Snap to whole frame numbers
      ease: 'none', // Linear progression
      onUpdate: () => {
        // Update the canvas on each frame update
        const currentFrameIndex = Math.round(frameData.frame);
        const img = imagesRef.current[currentFrameIndex];
        if (img && img.complete && img.naturalHeight !== 0) {
          drawCroppedImage(ctx, img); // Draw the current frame cropped
        } else {
           if (ctx) {
              // Use container background color for placeholder
              ctx.fillStyle = '#e9e9e9'; // Use the desired background color
              ctx.fillRect(0, 0, canvasWidth, canvasHeight);
              ctx.fillStyle = 'black'; // Text color for loading message
              ctx.fillText(`Loading frame ${currentFrameIndex + 48}...`, 10, 20);
           }
        }
      },
    }, 0); // Add frame animation at the beginning of the timeline (position 0)

    // --- Text Animation ---
    // Add the text animation towards the end of the timeline
    masterTl.fromTo(textRef.current,
      { opacity: 0, scale: 0.8, y: 30 }, // Starting state (hidden)
      { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.5 }, // Ending state (visible)
      ">-0.3" // Start this animation 0.3 seconds before the timeline ends
    );


    // Cleanup function to kill ScrollTrigger instances on component unmount
    return () => {
      masterTl.kill(); // Kill the master timeline
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all ScrollTriggers
    };
  }, [isLoading, loadError, frameCount, canvasWidth, canvasHeight, scrollDuration, drawCroppedImage]); // Added drawCroppedImage dependency

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      // Apply the background color here
      style={{ ...style, backgroundColor: '#e9e9e9' }}
    >
       {/* This div's height will be controlled by the pinning duration */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 text-foreground">
          <p>Loading animation...</p>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive/20 text-destructive p-4 z-10">
          <p>Error: {loadError}</p>
        </div>
      )}
      {/* The canvas will be positioned sticky/fixed by the pinning */}
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className={cn("absolute inset-0 block mx-auto z-0", { 'opacity-0': isLoading || loadError })} // Position absolute, behind text
        // Style canvas to fit container width, height will adjust proportionally
        style={{ width: '100%', height: 'auto', maxHeight: '100vh', objectFit: 'contain' }}
      />
       {/* Animated Text - Positioned near the top */}
       <h2
        ref={textRef}
        className="absolute inset-x-0 top-0 flex justify-center pt-10 text-center text-4xl md:text-6xl font-bold text-foreground z-10 opacity-0 pointer-events-none" // Adjusted: reduced pt-20 to pt-10
        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }} // Add subtle shadow for readability
      >
        Meet RhythmSync
      </h2>
      {/* No spacer needed, pinning handles the duration */}
    </div>
  );
}

// --- Where to store frames ---
// Store your image frames (e.g., 48.png, 49.png, ...) in the `public/frames` directory of your Next.js project.
// For example, if `framePathPrefix` is `/frames/`, create a folder structure like:
// public/
// └── frames/
//         ├── 48.png
//         ├── 49.png
//         └── ... (up to frameCount + 47)
//
// Then, when using the component, pass `/frames/` as the `framePathPrefix`.
