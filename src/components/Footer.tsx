import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Dumbbell, Send, Github, Twitter, Instagram, Shield, HeartHandshake } from 'lucide-react';

export default function Footer() {
  const { lang, isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() !== '') {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-white/5 text-zinc-400 py-16 px-4 relative overflow-hidden">
      {/* Background soft lighting glows */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FF4D00]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#FF4D00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Brand Column (Col Span 4) */}
        <div className="md:col-span-4 space-y-5 text-left rtl:text-right">
          <a href="#" className="flex items-center gap-2 group rtl:flex-row-reverse">
            <div className="p-1.5 bg-[#FF4D00] rounded-xl text-black shadow-[0_0_10px_rgba(255,77,0,0.2)]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="font-sans text-xl font-black uppercase tracking-wider text-white">
              VORTEX<span className="text-[#FF4D00] font-light">ELITE</span>
            </span>
          </a>
          <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-sm">
            {lang === 'ar' ? 'صياغة الأداء البدني المطلق في بيئة من الفخامة الاستثنائية. معدات لا مثيل لها، منصات قياس حيوية تنافسية، وتخصيص رياضي مخصص.' : 'Forging absolute physical performance under atmospheric luxury. Uncompromising equipment, competitive biometric platforms, and custom athletic optimization.'}
          </p>

          {/* Social Icons row */}
          <div className="flex items-center gap-4 pt-2 rtl:flex-row-reverse">
            <a href="#" className="p-2 bg-black border border-white/5 rounded-lg text-gray-500 hover:text-[#FF4D00] hover:border-[#FF4D00]/20 transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-black border border-white/5 rounded-lg text-gray-500 hover:text-[#FF4D00] hover:border-[#FF4D00]/20 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-black border border-white/5 rounded-lg text-gray-500 hover:text-[#FF4D00] hover:border-[#FF4D00]/20 transition-all">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Links Column 1 (Col Span 2) */}
        <div className="md:col-span-2 space-y-4 text-left rtl:text-right">
          <h4 className="font-mono text-xs uppercase tracking-widest text-white font-extrabold">
            {lang === 'ar' ? 'مواقع المقر الرئيسي' : 'HQ Locations'}
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="text-gray-500">
              <strong className="text-gray-400 block text-[11px] uppercase font-mono tracking-wider">{lang === 'ar' ? 'وسط لوس أنجلوس' : 'Downtown LA'}</strong>
              {lang === 'ar' ? '٩١٤ شارع ساوث هوب، لوس أنجلوس، كاليفورنيا ٩٠٠١٥' : '914 South Hope St, Los Angeles, CA 90015'}
            </li>
            <li className="text-gray-500">
              <strong className="text-gray-400 block text-[11px] uppercase font-mono tracking-wider">{lang === 'ar' ? 'ترايبيكا نيويورك' : 'Tribeca New York'}</strong>
              {lang === 'ar' ? '١٥٦ شارع فرانكلين، نيويورك، نيويورك ١٠٠١٣' : '156 Franklin St, New York, NY 10013'}
            </li>
          </ul>
        </div>

        {/* Links Column 2 (Col Span 2) */}
        <div className="md:col-span-2 space-y-4 text-left rtl:text-right">
          <h4 className="font-mono text-xs uppercase tracking-widest text-white font-extrabold">
            {lang === 'ar' ? 'الوصول السريع' : 'Quick Hub'}
          </h4>
          <ul className="space-y-2 text-xs font-mono flex flex-col items-start rtl:items-end gap-1">
            <li>
              <a href="#philosophy" className="inline-block px-3.5 py-2 bg-black/40 border border-white/5 hover:border-[#FF4D00]/40 text-gray-400 hover:text-white rounded-xl transition-all">{lang === 'ar' ? 'الفلسفة' : 'Philosophy'}</a>
            </li>
            <li>
              <a href="#simulator" className="inline-block px-3.5 py-2 bg-black/40 border border-white/5 hover:border-[#FF4D00]/40 text-gray-400 hover:text-white rounded-xl transition-all">{lang === 'ar' ? 'المحاكي ثلاثي الأبعاد' : '3D Simulator'}</a>
            </li>
            <li>
              <a href="#schedule" className="inline-block px-3.5 py-2 bg-black/40 border border-white/5 hover:border-[#FF4D00]/40 text-gray-400 hover:text-white rounded-xl transition-all">{lang === 'ar' ? 'البرامج' : 'Programs'}</a>
            </li>
            <li>
              <a href="#pricing" className="inline-block px-3.5 py-2 bg-black/40 border border-white/5 hover:border-[#FF4D00]/40 text-gray-400 hover:text-white rounded-xl transition-all">{lang === 'ar' ? 'الباقات' : 'Packages'}</a>
            </li>
          </ul>
        </div>

        {/* Newsletter/Input Column (Col Span 4) */}
        <div className="md:col-span-4 space-y-4 text-left rtl:text-right">
          <h4 className="font-mono text-xs uppercase tracking-widest text-white font-extrabold">
            {lang === 'ar' ? 'استلام الإشعارات والرسائل' : 'Receive Transmission'}
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            {lang === 'ar' ? 'اشترك لتلقي سجلات القياسات الحيوية، ونصائح التدريب المتخصصة، وجداول الإصدارات الديناميكية من مجتمع فورتكس.' : 'Subscribe to receive biometric logs, specialized training tips, and dynamic release schedules from Vortex collective.'}
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 rtl:flex-row-reverse">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@domain.com"
              required
              className="flex-1 bg-black border border-white/5 focus:border-[#FF4D00]/50 focus:ring-1 focus:ring-[#FF4D00]/20 rounded-xl px-4 py-3 text-xs text-gray-300 font-mono transition-all outline-none text-left rtl:text-right"
            />
            <button
              type="submit"
              className="p-3 bg-[#FF4D00] hover:bg-[#ff5d1a] text-black rounded-xl transition-all shadow-[0_4px_12px_rgba(255,77,0,0.2)] flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {subscribed && (
            <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-wider animate-pulse">
              {lang === 'ar' ? '⚡ تم تأمين قنوات الاتصال بنجاح!' : '⚡ TRANS-COMMUNICATION CHANNELS SECURED!'}
            </p>
          )}
        </div>

      </div>

      {/* Sub-footer Bottom Credits */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-600 text-xs">
        <p className="font-mono">
          &copy; {new Date().getFullYear()} {lang === 'ar' ? 'مجموعة فورتكس إيليت. جميع الحقوق محفوظة.' : 'Vortex Elite Collective. All rights reserved.'}
        </p>

        <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-wider rtl:flex-row-reverse">
          <a href="#" className="hover:text-zinc-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> {lang === 'ar' ? 'بروتوكول الأمان' : 'Security Protocol'}
          </a>
          <a href="#" className="hover:text-zinc-400 flex items-center gap-1">
            <HeartHandshake className="w-3.5 h-3.5" /> {lang === 'ar' ? 'شروط الخصوصية' : 'Privacy Terms'}
          </a>
        </div>
      </div>
    </footer>
  );
}
