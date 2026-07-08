import React, { useState, useEffect } from 'react';
import { Dumbbell, ShieldAlert, AlignRight, X, Sparkles, Languages } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t, isRtl } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t('nav.philosophy'), href: '#philosophy' },
    { label: t('nav.simulator'), href: '#simulator' },
    { label: t('nav.programs'), href: '#schedule' },
    { label: t('nav.instructors'), href: '#coaches' },
    { label: t('nav.packages'), href: '#pricing' },
  ];

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('open-gym-join', { detail: { planId: 'plan_elite' } }));
  };

  const handleToggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-3.5'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Branding Logo - Sophisticated Dark Vortex style */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#FF4D00] rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(255,77,0,0.4)] group-hover:rotate-90 transition-transform duration-500">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          </div>
          <span className="font-sans text-xl font-black tracking-tighter uppercase text-white">
            {lang === 'ar' ? (
              <>
                فورتكس <span className="text-[#FF4D00]">إيليت</span>
              </>
            ) : (
              <>
                VORTEX<span className="text-[#FF4D00]">ELITE</span>
              </>
            )}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-3">
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="px-4 py-2 bg-[#050505] border border-white/10 hover:border-[#FF4D00]/40 text-gray-400 hover:text-white text-xs font-bold font-mono uppercase tracking-wider rounded-full transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button Row & Language Selector */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Desktop Join Club Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={handleJoinClick}
              className="px-6 py-2.5 border border-[#FF4D00]/40 hover:border-[#FF4D00] text-[#FF4D00] hover:text-white rounded-full text-xs uppercase font-bold tracking-widest hover:bg-[#FF4D00]/10 transition-all cursor-pointer"
            >
              {t('nav.joinClub')}
            </button>
          </div>

          {/* Clean Stylish Language Switcher */}
          <button
            onClick={handleToggleLang}
            className="px-3.5 py-2 border border-white/10 hover:border-[#FF4D00]/50 text-gray-400 hover:text-white rounded-full text-[11px] uppercase font-mono tracking-wider transition-all bg-black/50 hover:bg-zinc-900/80 flex items-center gap-1.5 cursor-pointer shadow-md select-none"
            aria-label="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-[#FF4D00] animate-pulse" />
            <span className={lang === 'en' ? 'text-[#FF4D00] font-black' : 'text-zinc-500'}>EN</span>
            <span className="text-white/10">|</span>
            <span className={`font-sans ${lang === 'ar' ? 'text-[#FF4D00] font-black' : 'text-zinc-500'}`}>العربية</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <AlignRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-[#050505] border-b border-white/5 p-6 flex flex-col gap-6 shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-40 animate-fade-in">
          <div className="flex flex-col gap-3 text-left">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 bg-[#050505] border border-white/5 hover:border-[#FF4D00]/40 text-gray-400 hover:text-white text-xs font-bold font-mono uppercase tracking-widest rounded-xl transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex flex-col gap-3">
            <button
              onClick={handleJoinClick}
              className="w-full py-3 bg-[#FF4D00] text-center text-black text-xs font-black font-mono uppercase tracking-widest rounded-xl shadow-[0_4px_15px_rgba(255,77,0,0.3)] cursor-pointer"
            >
              {t('nav.joinVortex')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
