

'use client'; // Add 'use client' directive

import Image from 'next/image';
import { Music, HeartPulse, Zap, Ruler, BatteryCharging, ArrowLeftRight } from 'lucide-react'; // Added ArrowLeftRight
// import { Button } from '@/components/ui/button'; // No longer needed
import ScrollReveal from '@/components/landing/scroll-reveal';
// import ScrollDrivenAnimation from '@/components/landing/scroll-driven-animation'; // No longer needed for the removed section
// import FrameByFrameAnimation from '@/components/landing/frame-by-frame-animation'; // Import the old component
import GsapFrameAnimation from '@/components/landing/gsap-frame-animation'; // Import the new GSAP component
import TypewriterAnimation from '@/components/typewriter-animation';
import ScrollDownButton from '@/components/landing/scroll-down-button'; // Import ScrollDownButton
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import type { CSSProperties } from 'react'; // No longer needed for the removed section

// Define inline SVG components for icons not in lucide-react
const HeadphonesIcon = ({ className }: { className?: string }) => ( // Keep HeadphonesIcon definition if needed elsewhere, though removing it from specs
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14v-4a8 8 0 0 1 16 0v4"/>
    <path d="M19 14v4a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-4"/>
    <path d="M7 14v4a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-4"/>
  </svg>
);

const OledIcon = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M7.05 7.05 5.64 5.64m12.72 0-1.41 1.41M18.36 18.36l1.41 1.41M5.64 18.36l1.41-1.41M12 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
   </svg>
);

const StorageIcon = ({ className }: { className?: string }) => (
   <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>
   </svg>
);

// NEW: Define WeightIcon SVG
const WeightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="7.5"/> {/* Simple circle representing mass */}
    <path d="M12 2v2"/> {/* Line indicating top */}
    <path d="M12 20v2"/> {/* Line indicating bottom */}
    <path d="M5 12H3"/> {/* Line indicating left */}
    <path d="M19 12h2"/> {/* Line indicating right */}
  </svg>
);


// Removed BluetoothIcon as it's no longer used in tech specs

export default function Home() {
  const features = [
    {
      icon: HeartPulse,
      title: 'Real-time Heart Rate Sync',
      description: 'RhythmSync monitors your heart rate continuously to understand your body\'s intensity level.',
      bgColor: 'bg-card', // Use card background for consistency within the section
    },
    {
      icon: Music,
      title: 'Dynamic Playlist Adaptation',
      description: 'Your music adapts on the fly, matching the tempo and energy to your current activity.',
      bgColor: 'bg-card',
    },
    {
      icon: Zap,
      title: 'Personalized Motivation',
      description: 'Experience a deeply immersive listening experience that keeps you motivated and in sync.',
      bgColor: 'bg-card',
    },
  ];

  const recommendationExamples = [
    "Finding upbeat tracks for your peak intensity...",
    "Queueing calming tunes for your cooldown...",
    "Matching tempo to your current heart rate...",
    "Discovering new music based on your workout...",
  ];

  // Removed imageStyleGeneratorRotate as the corresponding section is removed

  // Removed imageStyleGeneratorZoomOut as it's replaced by GsapFrameAnimation

  // Configuration for the GSAP frame-by-frame animation
  const frameAnimationConfig = {
    frameCount: 210, // <<< --- UPDATED: 257 - 48 + 1 = 210 frames
    framePathPrefix: '/frames/', // <<< --- IMPORTANT: Path in the `public` folder (ensure trailing slash)
    frameFileExtension: 'png', // <<< --- IMPORTANT: File extension of your frames
    canvasWidth: 1158, // Match canvas dimensions to your frame image dimensions
    canvasHeight: 770, // Match canvas dimensions to your frame image dimensions
    scrollDuration: '200%', // UPDATED: Faster animation (was 300%)
  };


  return (
    // Remove scroll snap container - animation is now tied to scroll position within sections
    <main className="flex flex-col items-center bg-background text-foreground overflow-x-hidden">

        {/* Section 1: GSAP Frame by Frame Animation */}
         <section id="frame-animation" className="w-full relative" style={{ backgroundColor: '#e9e9e9' }}> {/* Changed background to match canvas */}
           {/* Use the new GsapFrameAnimation component */}
           {/* The height of this section is determined by the pinning duration */}
           <GsapFrameAnimation
             className="w-full h-screen flex items-center justify-center" // Ensure it fills the viewport height initially
             style={{}} // Add any specific container styles if needed
             frameCount={frameAnimationConfig.frameCount}
             framePathPrefix={frameAnimationConfig.framePathPrefix}
             frameFileExtension={frameAnimationConfig.frameFileExtension}
             canvasWidth={frameAnimationConfig.canvasWidth}
             canvasHeight={frameAnimationConfig.canvasHeight}
             scrollDuration={frameAnimationConfig.scrollDuration}
           />
           {/* Position the button within the pinned container, but maybe lower down */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                {/* The button itself needs pointer-events enabled */}
                {/* UPDATED: Scroll down button now points to hero */}
                <ScrollDownButton targetId="hero" className="pointer-events-auto"/>
            </div>
         </section>

        {/* Section 2: Hero */}
        <section id="hero" className="w-full h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)' }}></div>
          <ScrollReveal>
            <h1 className="mb-4 leading-tight">
              <span className="inline-block animate-playful-bounce" style={{animationDelay: '0s'}}>Music</span>{' '}
              <span className="inline-block animate-playful-bounce" style={{animationDelay: '0.1s'}}>That</span>{' '}
              <span className="inline-block animate-playful-bounce" style={{animationDelay: '0.2s'}}>Moves</span>{' '}
              <span className="text-accent inline-block animate-playful-bounce" style={{animationDelay: '0.3s'}}>With</span>{' '}
              <span className="inline-block animate-playful-bounce" style={{animationDelay: '0.4s'}}>You.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay="delay-200">
            {/* Updated text and size for subheading */}
            <p className="max-w-3xl mb-8 text-xl md:text-2xl text-foreground/75">
              Introducing RhythmSync, the MP3 player that keeps you in sync with your music.
            </p>
          </ScrollReveal>
          {/* Removed the Learn More button */}
          {/* UPDATED: Scroll down button now points to features-combined (since feature-image is removed) */}
          <ScrollDownButton targetId="features-combined" />
        </section>

        {/* Section 3: REMOVED - Product Image + Big Text ("Intelligent Music, Effortless Flow") */}
        {/* ... (removed section content) ... */}


        {/* Section 4: Combined Features Section (How it Works + Typewriter) */}
        <section id="features-combined" className="w-full min-h-screen flex flex-col relative overflow-hidden bg-background"> {/* Adjusted to min-h-screen and bg */}
          {/* Top Half: How It Works */}
          <div id="features-grid" className="w-full flex-grow flex flex-col items-center justify-center py-10 px-8"> {/* Use flex-grow */}
            <ScrollReveal className="text-center mb-8 md:mb-12">
              <h2 className="mb-4 text-3xl md:text-4xl">How It Works</h2>
              {/* Removed the paragraph below */}
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={`delay-${index * 100}`} threshold={0.1}>
                  {/* Use Card component for better styling */}
                  <Card className={`${feature.bgColor} shadow-lg h-full flex flex-col items-center text-center`}>
                    <CardHeader className="items-center">
                       <feature.icon className="w-10 h-10 mb-3 text-accent" />
                       <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/70">{feature.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Bottom Half: Typewriter Animation */}
          <div id="typewriter" className="w-full flex-grow flex flex-col items-center justify-center py-10 px-8 bg-secondary text-center"> {/* Use flex-grow */}
            <ScrollReveal className="max-w-4xl mx-auto">
              <h2 className="mb-4 text-3xl md:text-4xl">Always the Right Vibe.</h2>
              <p className="mb-6 text-base md:text-lg">
                Watch how RhythmSync dynamically adjusts your playlist based on real-time biometric feedback.
              </p>
              <div className="bg-background p-4 rounded-lg shadow-inner inline-block min-w-[280px] md:min-w-[450px] text-left">
                <code className="text-base md:text-lg font-mono text-accent">
                   {/* Removed the dollar sign span */}
                  <TypewriterAnimation texts={recommendationExamples} />
                </code>
              </div>
            </ScrollReveal>
          </div>

          {/* Corrected ScrollDownButton target for the combined section */}
           <ScrollDownButton targetId="tech-specs" />
        </section>


        {/* Section 5: Tech Specs Section */}
        <section id="tech-specs" className="w-full min-h-screen flex flex-col items-center justify-center py-20 px-8 bg-background relative"> {/* Changed background & use min-h-screen */}
          <ScrollReveal className="text-center mb-16">
            <h2 className="mb-4">Tech Specs</h2>
            <p className="max-w-2xl mx-auto">
              A closer look at the details that make RhythmSync perform.
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto items-stretch"> {/* Changed items-start to items-stretch */}
            {/* CAD Image Placeholder - Updated */}
            <ScrollReveal threshold={0.2} className="flex items-center justify-center"> {/* Added flex container for image */}
              <Image
                src="/images/RhythmSyncExploded.png" // Using a taller placeholder
                alt="RhythmSync Exploded CAD Model"
                data-ai-hint="exploded cad render mp3 player components technical drawing" // Updated hint
                width={600}
                height={800} // Keep original aspect ratio intention
                className="rounded-lg object-contain h-full max-h-[70vh] bg-transparent shadow-none" // Adjusted: Use max-h relative to viewport height, removed shadow, set bg transparent
              />
            </ScrollReveal>

            {/* Specs List */}
            <ScrollReveal delay="delay-100" threshold={0.2}>
               {/* Changed background to bg-background and removed shadow */}
              <Card className="bg-background shadow-none border-none h-full flex flex-col justify-center">
                <CardHeader>
                  <CardTitle className="text-2xl">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Increased spacing between list items using space-y-8 */}
                  <ul className="space-y-8 text-lg">
                    <li className="flex items-center gap-3">
                      <ArrowLeftRight className="w-6 h-6 text-accent" /> {/* Replaced HeadphonesIcon with ArrowLeftRight for I/O */}
                      <span><strong>I/O:</strong> 3.5mm Headphone Jack, Optical Heart Rate Sensor</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Ruler className="w-6 h-6 text-accent" />
                      <span><strong>Dimensions:</strong> 99mm x 70mm x 72mm</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <WeightIcon className="w-6 h-6 text-accent" /> {/* Replaced Zap with custom WeightIcon */}
                      <span><strong>Weight:</strong> 100 grams</span> {/* Updated weight */}
                    </li>
                    <li className="flex items-center gap-3">
                      <BatteryCharging className="w-6 h-6 text-accent" />
                      <span><strong>Battery Life:</strong> Up to 30 hours playback</span> {/* Updated battery life */}
                    </li>
                     <li className="flex items-center gap-3">
                       <OledIcon className="h-6 w-6 text-accent" />
                       <span><strong>Display:</strong> 1" OLED Display</span> {/* Updated display */}
                     </li>
                    <li className="flex items-center gap-3">
                      <StorageIcon className="h-6 w-6 text-accent" />
                      <span><strong>Storage:</strong> Play any Spotify song you want</span> {/* Updated storage */}
                    </li>
                    {/* Removed Processor and Connectivity rows */}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
          {/* Corrected ScrollDownButton target */}
          <ScrollDownButton targetId="cta" />
        </section>


        {/* Section 6: Call to Action Section with Footer */}
        <section id="cta" className="w-full min-h-screen flex flex-col items-center justify-center py-24 px-8 text-center bg-gradient-to-t from-secondary to-background relative"> {/* Use min-h-screen */}
          <div className="flex-grow flex flex-col items-center justify-center">
            <ScrollReveal>
              <h2 className="mb-4">Ready to Sync Your Rhythm?</h2>
              <p className="max-w-xl mx-auto mb-8">
                Experience the future of personalized and immersive music
              </p>
              {/* Replaced Button with styled text - Enhanced prominence */}
              {/* Increased margin-top using mt-12, then further increased to mt-16 */}
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mt-16 tracking-tight drop-shadow-md">
                Launching Q1 2026
              </p>
            </ScrollReveal>
          </div>
          {/* Footer content moved here */}
          <div className="w-full py-8 border-t border-border/50">
            <p className="text-sm text-foreground/60">
              © {new Date().getFullYear()} RhythmSync. All rights reserved.
            </p>
          </div>
          {/* Removed the ScrollDownButton from CTA section */}
        </section>

    </main>
  );
}

