import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { coachesData, CoachConfig } from '../coachesData';
import { useLanguage } from '../LanguageContext';
import { trainersTranslations } from '../translations';
import { getAssetPath } from '../utils';
import { 
  Star, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Zap, 
  Activity, 
  User, 
  Sparkles,
  Clock,
  Check
} from 'lucide-react';

export default function CoachSection() {
  const { lang, t, isRtl } = useLanguage();
  const N = coachesData.length;
  const [startIndex, setStartIndex] = useState(N);
  const [selectedTrainerState, setSelectedTrainer] = useState<CoachConfig | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [animateTransition, setAnimateTransition] = useState(true);

  const getLocalizedTrainer = (coach: CoachConfig) => {
    const cid = coach.id as 't1' | 't2' | 't3' | 't4';
    const dict = trainersTranslations[lang];
    if (!dict) return coach;

    return {
      ...coach,
      name: dict[`${cid}.name`] || coach.name,
      role: dict[`${cid}.role`] || coach.role,
      specialty: dict[`${cid}.specialty`] || coach.specialty,
      bio: dict[`${cid}.bio`] || coach.bio,
      stats: coach.stats.map((st, sIdx) => {
        const labelKey = `${cid}.stat${sIdx + 1}.label`;
        const valueKey = `${cid}.stat${sIdx + 1}.value`;
        return {
          label: dict[labelKey] || st.label,
          value: dict[valueKey] || st.value,
        };
      }),
      proficiency: {
        ...coach.proficiency,
        targetAudience: lang === 'ar' ? (
          cid === 't1' ? "قتال ثقيل وضربات ملاكمة للرجال" :
          cid === 't2' ? "كيك بوكسينغ وحصص سرعة وكارديو للنساء" :
          cid === 't3' ? "تعديل تركيب الجسم والضخامة العضلية للجميع" :
          "كاليسثينيكس متقدمة وثبات الجذع بوزن الجسم"
        ) : coach.proficiency.targetAudience,
        focusDiscipline: lang === 'ar' ? (
          cid === 't1' ? "الملاكمة والضربات الثقيلة الفعالة" :
          cid === 't2' ? "المواي تاي وتحمل الأداء القلبي الرئوي" :
          cid === 't3' ? "كمال الأجسام وبناء القوة والضخامة" :
          "الجمباز والتحكم بالوزن وحركة المفاصل"
        ) : coach.proficiency.focusDiscipline,
        focusParameters: coach.proficiency.focusParameters.map((param, pIdx) => {
          let localizedLabel = param.label;
          if (lang === 'ar') {
            if (cid === 't1') {
              const labels = ["سرعة تسديد الضربات", "حركة القدمين ومعدل الارتكاز", "الاستشفاء القلبي الرئوي", "سرعة حركة الرأس الدفاعية"];
              localizedLabel = labels[pIdx] || param.label;
            } else if (cid === 't2') {
              const labels = ["دوران تمدد الورك", "سرعة الضربات (الإيقاع)", "ثبات معدل ضربات القلب والتحمل", "مؤشر سرعة الاستجابة"];
              localizedLabel = labels[pIdx] || param.label;
            } else if (cid === 't3') {
              const labels = ["التوجيه الميكانيكي الحركي", "معايرة توزيع المغذيات الكبرى", "حافز التحميل العصبي العضلي", "عزل وتفعيل المجموعات العضلية"];
              localizedLabel = labels[pIdx] || param.label;
            } else if (cid === 't4') {
              const labels = ["ثبات الجذع والوسط", "التماثل العصبي الحركي", "زيادة مدى المفاصل النشط", "قوة وثبات الارتكاز العلوي"];
              localizedLabel = labels[pIdx] || param.label;
            }
          }
          return { ...param, label: localizedLabel };
        }),
        philosophies: lang === 'ar' ? (
          cid === 't1' ? [
            "الدقة تهزم القوة، والتوقيت المناسب يهزم السرعة.",
            "حركة القدمين هي أساس كل ضربة حركية قوية.",
            "الدفاع المحكم مع الهجمات المرتدة المتفجرة."
          ] : cid === 't2' ? [
            "تدفق كالماء، واضرب كالصاعقة.",
            "تفعيل كامل للوسط والخصر في كل ركلة دائرية.",
            "حصص كيك بوكسينغ مكثفة مصممة لتحسين الأداء الهرموني."
          ] : cid === 't3' ? [
            "الميكانيكا الحركية المثالية تسبق زيادة الوزن دائماً.",
            "أبسط تدرج منتظم يهزم أي تمرين عشوائي معقد.",
            "التوجيه العصبي العضلي الواعي يحقق النمو الأقصى للعضل."
          ] : [
            "الحركة هي الفن والرياضة والصحة بآن واحد.",
            "الوقوف المقلوب على اليدين يعيد برمجة توازن وعيك الحركي.",
            "المرونة النشطة هي القوة الحقيقية الممتدة عبر المدى الكامل للحركة."
          ]
        ) : coach.proficiency.philosophies,
        schedule: lang === 'ar' ? (
          cid === 't1' ? "الاثنين / الأربعاء / الجمعة: 08:00 - 12:00" :
          cid === 't2' ? "الثلاثاء / الخميس / السبت: 09:00 - 13:00" :
          cid === 't3' ? "طوال الأسبوع بحجز مسبق" :
          "الاثنين / الثلاثاء / الخميس: 14:00 - 18:00"
        ) : coach.proficiency.schedule,
      }
    };
  };

  const selectedTrainer = selectedTrainerState ? getLocalizedTrainer(selectedTrainerState) : null;

  // Replicated data to enable infinite wrapping slides
  const extendedCoaches = [
    ...coachesData,
    ...coachesData,
    ...coachesData,
  ];

  // Track responsive screen size for slider translation steps
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Recenter index silently when transition resets
  useEffect(() => {
    if (!animateTransition) {
      const raft = requestAnimationFrame(() => {
        setAnimateTransition(true);
      });
      return () => cancelAnimationFrame(raft);
    }
  }, [animateTransition]);

  const handlePrev = () => {
    if (!animateTransition) return;
    setStartIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (!animateTransition) return;
    setStartIndex((prev) => prev + 1);
  };

  // Form Booking Simulation
  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <section id="coaches" className="pt-24 pb-0 -mt-[100px] mx-0 bg-transparent relative overflow-hidden border-t border-white/5">
      {/* Cinematic ambient vector backgrounds */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-[#FF4D00]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-amber-500/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4 mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-white/5 rounded-full text-zinc-400 text-xs font-mono tracking-widest uppercase">
            <Star className="w-3.5 h-3.5 text-[#FF4D00] fill-[#FF4D00]/20 animate-pulse" />
            {lang === 'ar' ? 'مصفوفة الإرشاد الرياضي الريادي' : 'Vanguard Mentorship Matrix'}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">
            {lang === 'ar' ? (
              <>
                اختر أخصائي <br />
                <span className="text-transparent text-stroke select-none">
                  النخبة الخاص بك
                </span>
              </>
            ) : (
              <>
                CHOOSE YOUR <br />
                <span className="text-transparent text-stroke select-none">
                  ELITE SPECIALIST
                </span>
              </>
            )}
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base">
            {lang === 'ar' ? 'قم بتهيئة مسارات تركيزك البدني. تنقل أفقياً لاستكشاف المصفوفة الكاملة لمدربي الأداء البدني النخبة. انقر على أي بطاقة لعرض تفاصيل الملف الشخصي المتقدم.' : 'Configure your focus vectors. Scroll horizontally to explore the full matrix of elite human performance trainers. Click on any card to view their advanced profile.'}
          </p>
        </div>

        {/* Carousel Outer Wrapper with Corner Navigations */}
        <div className="relative group/carousel px-4 md:px-12" dir="ltr">
          
          {/* Left Corner Floating Navigation Chevron Button */}
          <button
            onClick={handlePrev}
            id="coach-slide-prev"
            className="absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-zinc-950/95 border border-white/10 hover:border-[#FF4D00]/60 hover:bg-black text-gray-400 hover:text-[#FF4D00] transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_15px_rgba(255,77,0,0.15)] flex items-center justify-center backdrop-blur-md"
            title={lang === 'ar' ? 'شريحة لليمين' : 'Slide Left'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Corner Floating Navigation Chevron Button */}
          <button
            onClick={handleNext}
            id="coach-slide-next"
            className="absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-zinc-950/95 border border-white/10 hover:border-[#FF4D00]/60 hover:bg-black text-gray-400 hover:text-[#FF4D00] transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_15px_rgba(255,77,0,0.15)] flex items-center justify-center backdrop-blur-md"
            title={lang === 'ar' ? 'شريحة ليسار' : 'Slide Right'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Viewport for the Sliding Tray */}
          <div className="overflow-hidden w-full py-2">
            <motion.div 
              className="flex -mx-3"
              animate={{ x: `-${startIndex * (isMobile ? 100 : 33.333333)}%` }}
              transition={animateTransition ? { type: 'spring', stiffness: 150, damping: 22 } : { duration: 0 }}
              onAnimationComplete={() => {
                if (startIndex >= 2 * N) {
                  setAnimateTransition(false);
                  setStartIndex(startIndex - N);
                } else if (startIndex < N) {
                  setAnimateTransition(false);
                  setStartIndex(startIndex + N);
                }
              }}
            >
              {extendedCoaches.map((rawCoach, idx) => {
                const t = getLocalizedTrainer(rawCoach);
                return (
                  <div
                    key={`${t.id}-${idx}`}
                    className="w-full md:w-1/3 px-3 flex-shrink-0"
                  >
                    <div
                      onClick={() => setSelectedTrainer(rawCoach)}
                      dir={isRtl ? "rtl" : "ltr"}
                      className="group relative rounded-3xl bg-black border border-white/5 p-4 overflow-hidden transition-all duration-300 shadow-2xl hover:border-[#FF4D00]/40 flex flex-col justify-between h-[540px] min-h-[540px] max-h-[540px] text-left rtl:text-right cursor-pointer hover:shadow-[0_0_30px_rgba(255,77,0,0.06)] hover:-translate-y-1.5 transform"
                    >
                      {/* Spotlight effect behind card contents */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,77,0,0.04)_0%,transparent_50%)] pointer-events-none" />

                      <div className="space-y-3.5">
                        {/* Cinematic Header Image Block */}
                        <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 relative flex-shrink-0">
                          <img 
                            src={getAssetPath(t.image)} 
                            alt={t.name} 
                            className="w-full h-full object-cover filter brightness-[0.75] contrast-105 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Dark cinematic linear gradient fade */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                          {/* Specialty overlay badge */}
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/90 border border-white/10 rounded-lg text-[8px] font-mono text-[#FF4D00] font-black uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm">
                            <Award className="w-2.5 h-2.5 text-[#FF4D00]" />
                            {t.specialty.split(' ')[0]} PRO
                          </div>
                        </div>

                        {/* Identity Details */}
                        <div className="space-y-0.5">
                          <span className="font-mono text-[8px] text-[#FF4D00] uppercase tracking-widest font-black block">
                            {t.role}
                          </span>
                          <h3 className="text-base font-black text-white group-hover:text-[#FF4D00] transition-colors uppercase leading-tight truncate">
                            {t.name}
                          </h3>
                          <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2 mt-1">
                            {t.bio}
                          </p>
                        </div>

                        {/* Focus spec snippet */}
                        <div className="bg-zinc-950/80 border border-white/5 p-2 rounded-xl text-[9px] text-zinc-300 font-mono truncate flex items-center gap-1.5 rtl:flex-row-reverse">
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500/10 flex-shrink-0 animate-pulse" />
                          <span className="truncate">{t.specialty}</span>
                        </div>
                      </div>

                      {/* Dynamic Custom Stats & Booking Trigger CTA */}
                      <div className="space-y-2.5 pt-3 border-t border-white/5 mt-3">
                        <div className="grid grid-cols-2 gap-2">
                          {t.stats.map((st, sIdx) => (
                            <div key={sIdx} className="bg-zinc-950/40 border border-white/5 rounded-xl p-1.5 text-left rtl:text-right">
                              <span className="text-[7px] font-mono text-zinc-500 uppercase font-semibold block truncate">{st.label}</span>
                              <span className="text-[10px] font-black text-white font-mono block truncate">{st.value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Inspect proficiency trigger button */}
                        <button className="w-full py-2 bg-[#FF4D00]/10 group-hover:bg-[#FF4D00] group-hover:text-black border border-[#FF4D00]/20 group-hover:border-[#FF4D00] text-[#FF4D00] text-[9px] font-mono uppercase tracking-widest font-black rounded-lg transition-all flex items-center justify-center gap-1 rtl:flex-row-reverse">
                          <Sparkles className="w-3 h-3" />
                          {lang === 'ar' ? 'توسيع الملف الشخصي' : 'EXPAND PROFILE'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>

      </div>

      {/* IMMERSIVE POP-UP CARD MODAL */}
      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal Backdrop overlay with smooth blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrainer(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Box Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', duration: 0.5 }}
              dir={isRtl ? "rtl" : "ltr"}
              className="relative w-full max-w-4xl bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
            >
              
              {/* Floating absolute close button */}
              <button
                onClick={() => setSelectedTrainer(null)}
                className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all backdrop-blur-md"
                title={lang === 'ar' ? 'إغلاق الملف الشخصي' : 'Close Profile'}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Column 1: Image panel (Left) */}
              <div className="md:col-span-5 relative bg-zinc-950 border-r border-white/5 h-64 md:h-auto overflow-hidden">
                <img 
                  src={getAssetPath(selectedTrainer.image)} 
                  alt={selectedTrainer.name} 
                  className="w-full h-full object-cover filter brightness-[0.8] contrast-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/10 md:to-black" />

                {/* Trainer bottom caption inside photo */}
                <div className="absolute bottom-6 left-6 right-6 text-left rtl:text-right">
                  <span className="px-2.5 py-1 bg-[#FF4D00] text-black text-[9px] font-mono font-black uppercase rounded-lg tracking-widest inline-block mb-2">
                    {lang === 'ar' ? 'مرشد نشط' : 'ACTIVE MENTOR'}
                  </span>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">{selectedTrainer.name}</h4>
                  <p className="text-xs font-mono text-zinc-400 uppercase mt-0.5">{selectedTrainer.role}</p>
                </div>
              </div>

              {/* Column 2: Detailed bio & custom proficiency stats (Right) */}
              <div className="md:col-span-7 p-6 md:p-8 overflow-y-auto space-y-6 text-left rtl:text-right max-h-[calc(90vh-16rem)] md:max-h-[85vh]">
                
                {/* Header info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-500 rtl:flex-row-reverse">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold">{lang === 'ar' ? 'ملف الكفاءة الرياضية' : 'PROFICIENCY PROFILE'}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                    {selectedTrainer.proficiency.focusDiscipline}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#FF4D00] font-mono font-bold uppercase tracking-wider bg-[#FF4D00]/5 px-2.5 py-1 rounded-lg border border-[#FF4D00]/20 rtl:flex-row-reverse">
                    <User className="w-3.5 h-3.5" />
                    {lang === 'ar' ? 'الفئة المستهدفة:' : 'Target:'} {selectedTrainer.proficiency.targetAudience}
                  </div>
                </div>

                {/* Biography block */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">{lang === 'ar' ? 'السيرة الذاتية' : 'BIOGRAPHY'}</span>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    {selectedTrainer.bio}
                  </p>
                </div>

                {/* Target Proficiency Parameters (The progress bar stats) */}
                <div className="space-y-3">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">{lang === 'ar' ? 'مسارات كفاءة التدريب الرياضي' : 'COACHING EFFICIENCY VECTORS'}</span>
                  <div className="space-y-2.5">
                    {selectedTrainer.proficiency.focusParameters.map((param, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono font-bold rtl:flex-row-reverse">
                          <span className="text-gray-400">{param.label}</span>
                          <span className="text-white font-black">{param.value}%</span>
                        </div>
                        {/* Custom progress gauge bar */}
                        <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#FF4D00] to-amber-500 h-full rounded-full"
                            style={{ width: `${param.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Philosophy Bullets */}
                <div className="space-y-2.5 bg-zinc-950 border border-white/5 p-4 rounded-2xl">
                  <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block font-bold">{lang === 'ar' ? 'فلسفات التدريب البدني' : 'TRAINING PHILOSOPHIES'}</span>
                  <ul className="space-y-2 text-xs text-gray-400 leading-snug">
                    {selectedTrainer.proficiency.philosophies.map((ph, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 rtl:flex-row-reverse">
                        <span className="text-[#FF4D00] text-sm mt-0.5">•</span>
                        <span>{ph}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mock Booking Simulator */}
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono rtl:flex-row-reverse">
                    <span className="text-zinc-500 uppercase">{lang === 'ar' ? 'جدول التدريب والتعليم' : 'INSTRUCTION SCHEDULE'}</span>
                    <span className="text-white font-bold flex items-center gap-1.5 rtl:flex-row-reverse">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      {selectedTrainer.proficiency.schedule}
                    </span>
                  </div>

                  <form onSubmit={handleBookSession} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 rtl:flex-row-reverse">
                      <input 
                        type="email" 
                        required
                        placeholder={lang === 'ar' ? 'أدخل بريدك الإلكتروني لتقديم طلب الالتحاق' : 'Enter your email to request intake'} 
                        className="bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4D00] flex-1 font-mono text-left rtl:text-right"
                      />
                      <button 
                        type="submit"
                        disabled={bookingSuccess}
                        className="px-5 py-2.5 bg-[#FF4D00] text-black text-xs font-mono font-black uppercase tracking-wider rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-1.5 disabled:bg-emerald-500 disabled:text-white"
                      >
                        {bookingSuccess ? (
                          <>
                            <Check className="w-4 h-4" /> {lang === 'ar' ? 'تم الحجز بنجاح' : 'SECURED'}
                          </>
                        ) : (
                          lang === 'ar' ? 'حجز جلسة خاصة' : 'BOOK PRIVATE INTAKE'
                        )}
                      </button>
                    </div>
                    {bookingSuccess && (
                      <span className="text-[10px] text-emerald-400 font-mono block text-center animate-pulse">
                        {lang === 'ar' ? 'تم تسجيل طلبك بنجاح! سيرسل لك ممثل التدريب البدني تفاصيل القبول البدئي خلال ساعتين.' : 'Application compiled! A physical trainer representative will send intake details within 2 hours.'}
                      </span>
                    )}
                  </form>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

