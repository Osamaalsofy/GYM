import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Dumbbell, ArrowRight, Zap, Target, Flame } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang, t, isRtl } = useLanguage();
  
  // Mouse hover coordinate listeners for the floating ambient light spot
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Translate to relative coordinates inside the hero frame
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll Progress calculations for cinematic parallax based on Hero section's exit scroll progress
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth out scroll progress using springs
  const smoothHeroScroll = useSpring(heroScrollProgress, { damping: 25, stiffness: 120 });

  // As user scrolls down, scale and translate background elements for 3D depth
  const bgScale = useTransform(smoothHeroScroll, [0, 1], [1, 1.12]);
  const bgY = useTransform(smoothHeroScroll, [0, 1], [0, 100]);
  const textY = useTransform(smoothHeroScroll, [0, 1], [0, -80]);
  const textOpacity = useTransform(smoothHeroScroll, [0, 0.6], [1, 0]);

  // Coach parallax scroll effects: floats up and disappears
  const coachY = useTransform(smoothHeroScroll, [0, 1], [0, -220]);
  const coachScale = useTransform(smoothHeroScroll, [0, 1], [1, 1.15]);
  const coachOpacity = useTransform(smoothHeroScroll, [0, 0.75], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent text-zinc-100 px-4 md:px-8 py-20"
    >
      {/* Dynamic Ambient Spotlight following user's mouse */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 blur-[120px] bg-[#FF4D00]"
        style={{
          left: smoothMouseX,
          top: smoothMouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* Subtle Grid Overlay from Sophisticated Dark design */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Background Image Parallax Container */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-35 select-none"
        style={{ scale: bgScale, y: bgY }}
      >
        <img 
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1600" 
          alt="Atmospheric gym backdrop"
          className="w-full h-full object-cover filter brightness-[0.25] contrast-[1.15] grayscale-[40%]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
      </motion.div>

      {/* Transparent Athletic Coach Graphic (Layered in front of the text for 3D depth and premium magazine layout feel) */}
      <motion.div 
        className="absolute bottom-0 inset-x-0 mx-auto flex items-end justify-center pointer-events-none select-none z-30 w-full max-w-5xl h-[85vh] overflow-hidden"
        style={{ 
          y: coachY,
          scale: coachScale,
          opacity: coachOpacity
        }}
      >
        {/* Glowing Orange Aura Behind Coach */}
        <div className="absolute bottom-24 w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full bg-[#FF4D00]/15 blur-[100px] -z-10" />
        
        <img 
          src="/images/BG.png" 
          alt="Athletic coach in action"
          className="h-[80%] md:h-[90%] object-contain filter brightness-[0.9] contrast-[1.1] drop-shadow-[0_0_50px_rgba(255,77,0,0.25)]"
          onError={(e) => {
            // Graceful fallback to avoid broken image if not yet fully loaded
            e.currentTarget.style.opacity = '0.7';
          }}
        />
        {/* Soft dark fading overlay at the bottom of the coach image to blend edges */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
      </motion.div>

      {/* Hero Title Section (Layered behind the coach graphic for a 3D overlay effect) */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-6 pt-10">
         {/* Cinematic Main Heading (Sophisticated Dark Style) */}
        <div className="space-y-4">
          <motion.h1
            style={{ y: textY, opacity: textOpacity }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-[115px] font-black leading-[0.82] tracking-tighter uppercase italic text-white max-w-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            {lang === 'ar' ? (
              <>
                اصنع جسدك <br />
                <span className="text-transparent text-stroke select-none">
                  الأقوى والأمثل
                </span>
              </>
            ) : (
              <>
                Forge Your <br />
                <span className="text-transparent text-stroke select-none">
                  Highest Self
                </span>
              </>
            )}
          </motion.h1>
        </div>

        {/* Elegant Minimalist Accent Symbol replacing the description text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex items-center justify-center gap-3 py-4 w-full max-w-[120px] mx-auto relative"
        >
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF4D00] shadow-[0_0_8px_#FF4D00]" />
          <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* Hero Actions Section (Layered in front of the coach so they are fully clickable and visible) */}
      <div className="relative z-40 w-full max-w-6xl mx-auto flex flex-col items-center justify-center pt-8">
        {/* Action Button Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Neon Skewed Button */}
          <div className="flex items-center gap-6">
            <a href="#simulator" className="group relative block">
              <div className="absolute inset-0 bg-[#FF4D00] blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-sm"></div>
              <div className="relative bg-[#FF4D00] text-black px-10 py-4 font-black uppercase text-sm skew-x-[-12deg] flex items-center gap-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                <Dumbbell className="w-5 h-5" />
                {t('hero.start')}
              </div>
            </a>
          </div>

          <a
            href="#schedule"
            className="group px-8 py-4 bg-black/60 hover:bg-black/90 border border-white/10 hover:border-[#FF4D00]/40 text-gray-200 rounded-xl text-base font-bold tracking-wider uppercase transition-all flex items-center gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {t('hero.explore')}
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform text-[#FF4D00]" />
          </a>
        </motion.div>
      </div>

      {/* Cinematic fading footer shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </div>
  );
}
