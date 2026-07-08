import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Flame, Shield, Activity, Zap, Compass, HeartPulse } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { gatesTranslations } from '../translations';
import { getAssetPath } from '../utils';

interface GateProps {
  key?: any;
  index: number;
  num: string;
  title: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  bgImage: string;
  accentColor: string;
  features: string[];
  customStyle?: React.CSSProperties;
  isMobile: boolean;
}

function ScrollGate({ num, title, tagline, description, icon, bgImage, accentColor, features, customStyle, isMobile }: GateProps) {
  const gateRef = useRef<HTMLDivElement>(null);
  const { lang, t, isRtl } = useLanguage();
  
  // Track scroll progress of this specific gate card
  const { scrollYProgress } = useScroll({
    target: gateRef,
    offset: ["start end", "end start"]
  });

  // Smooth springs to avoid jerky scroll transitions
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 80 });

  // Map progress to 3D rotation, scaling, and skewing (tamed down on mobile for accessibility/performance)
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], isMobile ? [5, 0, -5] : [30, 0, -30]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], isMobile ? [0.95, 1, 0.95] : [0.85, 1, 0.85]);
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], isMobile ? [0.8, 1, 1, 0.8] : [0.3, 1, 1, 0.3]);
  const y = useTransform(smoothProgress, [0, 0.5, 1], isMobile ? [10, 0, -10] : [50, 0, -50]);

  // Lighting overlay shimmer based on scroll progress
  const shimmerY = useTransform(smoothProgress, [0, 1], ["-20%", "120%"]);

  return (
    <div 
      ref={gateRef}
      style={customStyle}
      className="relative min-h-[50vh] lg:min-h-[85vh] flex items-center justify-center py-8 lg:py-16 px-4 md:px-8 perspective-2000"
    >
      {/* 3D Animated Card Container */}
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: 'preserve-3d'
        }}
        className="relative w-full max-w-5xl rounded-3xl border border-white/5 bg-gradient-to-br from-[#0c0c0e] to-black overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Cinematic Background Image Layer */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src={bgImage.startsWith('http') ? bgImage : getAssetPath(bgImage)}
            alt={title}
            className="w-full h-full object-cover filter brightness-[0.3] grayscale hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Shimmer Light Bar Overlay (Simulating 3D light reflection sliding on scroll) */}
        <motion.div 
          className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none skew-y-12"
          style={{ top: shimmerY }}
        />

        {/* Content Box (Using translateZ for true 3D float) */}
        <div 
          className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 md:p-14 items-center transform-style-3d"
        >
          {/* Main info panel */}
          <div className="lg:col-span-7 space-y-6 text-left rtl:text-right" style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <span className="font-mono text-5xl font-black text-[#FF4D00]/20 select-none">
                {num}
              </span>
              <div className="h-8 w-px bg-white/10" />
              <div className={`p-2.5 rounded-xl bg-black border border-white/10 text-[#FF4D00]`}>
                {icon}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold">
                {tagline}
              </span>
            </div>

            <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight italic">
              {title}
            </h3>

            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              {description}
            </p>

            {/* Accent Border Line */}
            <div className="h-1 w-20 bg-[#FF4D00] rounded-full rtl:mr-0 rtl:ml-auto" />
          </div>

          {/* Interactive features list panel */}
          <div 
            className="lg:col-span-5 bg-black/60 border border-white/5 rounded-2xl p-6 md:p-8 text-left rtl:text-right space-y-4"
            style={{ transform: 'translateZ(80px)' }}
          >
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#FF4D00] font-extrabold flex items-center gap-2 rtl:flex-row-reverse">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              {t('chassis.systemSpecs')}
            </h4>
            
            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 rtl:flex-row-reverse">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-[#FF4D00] mt-2 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Glowing micro stats indicator */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between rtl:flex-row-reverse">
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold">{t('chassis.protocolReady')}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">{t('chassis.maximized')}</span>
            </div>
          </div>
        </div>

        {/* Cinematic outer glowing ambient lights */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF4D00]/10 blur-[80px] pointer-events-none rounded-full" />
      </motion.div>
    </div>
  );
}

export default function ThreeDScrollContainer() {
  const [isMobile, setIsMobile] = React.useState(false);
  const { lang, t, isRtl } = useLanguage();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sections = [
    {
      num: "01",
      title: gatesTranslations[lang]['g0.title'],
      tagline: gatesTranslations[lang]['g0.tagline'],
      description: gatesTranslations[lang]['g0.description'],
      icon: <Flame className="w-5 h-5 text-[#FF4D00]" />,
      bgImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200",
      accentColor: "orange",
      features: [
        gatesTranslations[lang]['g0.f0'],
        gatesTranslations[lang]['g0.f1'],
        gatesTranslations[lang]['g0.f2'],
        gatesTranslations[lang]['g0.f3'],
      ]
    },
    {
      num: "02",
      title: gatesTranslations[lang]['g1.title'],
      tagline: gatesTranslations[lang]['g1.tagline'],
      description: gatesTranslations[lang]['g1.description'],
      icon: <Activity className="w-5 h-5 text-[#FF4D00]" />,
      bgImage: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=1200",
      accentColor: "rose",
      features: [
        gatesTranslations[lang]['g1.f0'],
        gatesTranslations[lang]['g1.f1'],
        gatesTranslations[lang]['g1.f2'],
        gatesTranslations[lang]['g1.f3'],
      ]
    },
    {
      num: "03",
      title: gatesTranslations[lang]['g2.title'],
      tagline: gatesTranslations[lang]['g2.tagline'],
      description: gatesTranslations[lang]['g2.description'],
      icon: <HeartPulse className="w-5 h-5 text-[#FF4D00]" />,
      bgImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200",
      accentColor: "emerald",
      features: [
        gatesTranslations[lang]['g2.f0'],
        gatesTranslations[lang]['g2.f1'],
        gatesTranslations[lang]['g2.f2'],
        gatesTranslations[lang]['g2.f3'],
      ]
    }
  ];

  return (
    <section id="philosophy" className="py-24 bg-transparent relative overflow-hidden border-t border-white/5">
      {/* Background Section Title */}
      <div className="absolute top-12 left-0 right-0 text-center select-none pointer-events-none opacity-[0.015]">
        <div className="font-sans text-[12vw] font-black tracking-widest text-white uppercase">
          {t('chassis.backgroundText')}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-white/5 rounded-full text-zinc-400 text-xs font-mono tracking-widest uppercase">
          <Compass className="w-3.5 h-3.5 text-[#FF4D00]" />
          {t('chassis.tagline')}
        </div>
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic select-none">
          <span className="text-transparent text-stroke mr-3">{t('chassis.absolute')}</span>
          <span className="text-white">{t('chassis.output')}</span>
        </h2>
      </div>

      {/* Outer 3D Section Wrapper */}
      <div className={isMobile ? "space-y-8 px-4" : "space-y-4"}>
        {sections.map((section, idx) => {
          let customStyle: React.CSSProperties = {};
          if (!isMobile) {
            if (idx === 0) {
              customStyle = {
                paddingLeft: '32px',
                paddingTop: '64px',
                paddingBottom: '64px',
                marginTop: '-170px',
                marginBottom: '-180px',
              };
            } else if (idx === 1) {
              customStyle = {
                marginTop: '-300px',
                marginBottom: '-300px',
              };
            } else if (idx === 2) {
              customStyle = {
                marginBottom: '-200px',
              };
            }
          } else {
            customStyle = {
              marginTop: '0px',
              marginBottom: '16px',
              paddingLeft: '0px',
              paddingTop: '0px',
              paddingBottom: '0px',
            };
          }
          return (
            <ScrollGate 
              key={idx}
              index={idx}
              num={section.num}
              title={section.title || ''}
              tagline={section.tagline || ''}
              description={section.description || ''}
              icon={section.icon}
              bgImage={section.bgImage}
              accentColor={section.accentColor}
              features={section.features.filter((f): f is string => typeof f === 'string')}
              customStyle={customStyle}
              isMobile={isMobile}
            />
          );
        })}
      </div>
    </section>
  );
}
