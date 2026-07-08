import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ThreeDScrollContainer from './components/ThreeDScrollContainer';
import CalorieCalculator from './components/CalorieCalculator';
import ClassSchedule from './components/ClassSchedule';
import CoachSection from './components/CoachSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import GymCultureBackground from './components/GymCultureBackground';
import GymJoinForm from './components/GymJoinForm';
import { Sparkles, ChevronDown } from 'lucide-react';

export default function App() {
  // Top laser scroll indicator tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#050505] text-zinc-100 overflow-x-hidden selection:bg-[#FF4D00] selection:text-black">
        {/* Gym Culture Interactive Live Background layer */}
        <GymCultureBackground />

        {/* Laser Top Scroll Progress Bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-[3px] bg-[#FF4D00] z-50 origin-left"
          style={{ scaleX }}
        />

        {/* Transparent Global Header */}
        <Navbar />

        {/* Main Hero Showcase */}
        <Hero />

        {/* Dynamic Scrolling Indicator */}
        <div className="relative h-1 bg-[#050505]">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce text-zinc-500 hover:text-[#FF4D00] cursor-pointer">
            <span className="font-mono text-[10px] tracking-widest uppercase">DISCOVER CHASSIS</span>
          </div>
        </div>

        {/* 3D Scrolling Architecture Panels */}
        <ThreeDScrollContainer />

        {/* 3D Interactive Object Section */}
        <section id="simulator" className="py-24 bg-transparent border-t border-white/5 relative overflow-hidden">
          {/* Soft background light */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4D00]/5 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <CalorieCalculator />
          </div>
        </section>

        {/* Active Workouts Matrix */}
        <ClassSchedule />

        {/* Instructor Showcase */}
        <CoachSection />

        {/* Pricing Matrix Plans */}
        <PricingSection />

        {/* Immersive Contact & Brand Directory */}
        <Footer />

        {/* Pop-up Custom Gym Registration Form */}
        <GymJoinForm />
      </div>
    </LanguageProvider>
  );
}
