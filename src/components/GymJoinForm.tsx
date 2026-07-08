import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { X, Dumbbell, ShieldCheck, Flame, Trophy, Sparkles } from 'lucide-react';

interface JoinFormProps {
  defaultPlanId?: string;
}

export default function GymJoinForm() {
  const { lang, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [planId, setPlanId] = useState('plan_elite');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goal: 'muscle',
    level: 'intermediate',
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.planId) {
        setPlanId(customEvent.detail.planId);
      }
      setIsOpen(true);
      setIsSuccess(false);
    };

    window.addEventListener('open-gym-join', handleOpen);
    return () => window.removeEventListener('open-gym-join', handleOpen);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);
    
    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Automatically close after a few seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        // Reset form
        setFormData({
          name: '',
          email: '',
          goal: 'muscle',
          level: 'intermediate',
          motivation: '',
        });
      }, 3500);
    }, 1500);
  };

  const getPlanName = (id: string) => {
    switch(id) {
      case 'plan_base':
      case 'plan_starter':
        return lang === 'ar' ? 'الأساسي الرياضي' : 'Starter Core';
      case 'plan_elite':
        return lang === 'ar' ? 'فورتكس النخبة' : 'Vortex Elite';
      case 'plan_alpha':
      case 'plan_pro':
        return lang === 'ar' ? 'تيتان برو' : 'Titan Pro';
      default:
        return lang === 'ar' ? 'عضو فورتكس' : 'Vortex Member';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(255,77,0,0.15)] text-left"
          >
            {/* Visual Header bar */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-500 via-[#FF4D00] to-amber-500" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner Content */}
            <div className="p-8">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div className="space-y-1 text-left rtl:text-right">
                    <div className="flex items-center gap-2 text-[#FF4D00] rtl:flex-row-reverse">
                      <Dumbbell className="w-5 h-5" />
                      <span className="text-[10px] font-black tracking-widest uppercase font-mono">{lang === 'ar' ? 'التسجيل في النادي' : 'CLUB ENROLLMENT'}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                      {lang === 'ar' ? 'انضم إلى معبد الحديد' : 'JOIN THE IRON TEMPLE'}
                    </h3>
                    <p className="text-zinc-400 text-xs font-mono">
                      {lang === 'ar' ? 'الفئة المختارة:' : 'Selected Tier:'} <span className="text-[#FF4D00] font-bold">{getPlanName(planId)}</span>
                    </p>
                  </div>

                  {/* Input - Name */}
                  <div className="space-y-1.5 text-left rtl:text-right">
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                      {lang === 'ar' ? 'الاسم الكامل *' : 'FULL NAME *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={lang === 'ar' ? 'مثال: آرنولد شوارزنيجر' : 'e.g. Arnold Schwarzenegger'}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]/60 transition-colors text-left rtl:text-right"
                    />
                  </div>

                  {/* Input - Email */}
                  <div className="space-y-1.5 text-left rtl:text-right">
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                      {lang === 'ar' ? 'البريد الإلكتروني *' : 'EMAIL ADDRESS *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={lang === 'ar' ? 'مثال: champ@vortex.club' : 'e.g. champ@vortex.club'}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]/60 transition-colors text-left rtl:text-right"
                    />
                  </div>

                  {/* Grid Selector: Goal and level */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Select Goal */}
                    <div className="space-y-1.5 text-left rtl:text-right">
                      <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                        {lang === 'ar' ? 'الهدف التدريبي' : 'WORKOUT GOAL'}
                      </label>
                      <select
                        value={formData.goal}
                        onChange={e => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#FF4D00]/60 transition-colors cursor-pointer text-left rtl:text-right"
                      >
                        <option value="muscle">{lang === 'ar' ? '💪 بناء العضلات' : '💪 Build Muscle'}</option>
                        <option value="strength">{lang === 'ar' ? '⚡ رفع أثقال ثقيل' : '⚡ Heavy Powerlifting'}</option>
                        <option value="fat_loss">{lang === 'ar' ? '🔥 حرق الدهون والتنشيف' : '🔥 Fat Loss / Shred'}</option>
                        <option value="stamina">{lang === 'ar' ? '🧘 العقل والجسم والكارديو' : '🧘 Mind-Muscle & Cardio'}</option>
                      </select>
                    </div>

                    {/* Select Level */}
                    <div className="space-y-1.5 text-left rtl:text-right">
                      <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                        {lang === 'ar' ? 'مستوى الخبرة' : 'EXPERIENCE LEVEL'}
                      </label>
                      <select
                        value={formData.level}
                        onChange={e => setFormData(prev => ({ ...prev, level: e.target.value }))}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-3 text-xs text-white focus:outline-none focus:border-[#FF4D00]/60 transition-colors cursor-pointer text-left rtl:text-right"
                      >
                        <option value="beginner">{lang === 'ar' ? 'مبتدئ (بداية جديدة)' : 'Beginner (Start New)'}</option>
                        <option value="intermediate">{lang === 'ar' ? 'متوسط (مواظب)' : 'Intermediate (Consistent)'}</option>
                        <option value="advanced">{lang === 'ar' ? 'متقدم (محترف)' : 'Advanced (Gym Rat)'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Input - One-liner motivation */}
                  <div className="space-y-1.5 text-left rtl:text-right">
                    <label className="block text-[10px] font-bold font-mono text-zinc-400 uppercase tracking-wider">
                      {lang === 'ar' ? 'ما الذي يحفزك؟ (اختياري)' : 'WHAT MOTIVATES YOU? (OPTIONAL)'}
                    </label>
                    <input
                      type="text"
                      value={formData.motivation}
                      onChange={e => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                      placeholder={lang === 'ar' ? 'مثال: كسر حواجزي وتجاوز الحدود' : 'e.g. Breaking my plateaus and pushing limits'}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]/60 transition-colors text-left rtl:text-right"
                    />
                  </div>

                  {/* Guarantee notice */}
                  <div className="flex items-start gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl rtl:flex-row-reverse">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-zinc-500 leading-normal flex-1">
                      {lang === 'ar' ? 'لا توجد رسوم تسجيل، تقييم بدني مجاني مخصص، ووصول كامل على مدار الساعة طوال أيام الأسبوع إلى أدوات التدريب البدني.' : 'No sign-up fee, free custom fitness assessment, and full 24/7 access to physical coaching tools.'}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative group mt-2"
                  >
                    <div className="absolute inset-0 bg-[#FF4D00] blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-sm"></div>
                    <div className="relative w-full bg-[#FF4D00] text-black py-4 font-black uppercase text-xs skew-x-[-12deg] flex items-center justify-center gap-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:flex-row-reverse">
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          <span>{lang === 'ar' ? 'جاري معالجة الوصول...' : 'PROCESSING ACCESS...'}</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'تأمين الوصول للعضوية' : 'SECURE MEMBERSHIP ACCESS'}</span>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              ) : (
                /* Success screen */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500">
                    <Trophy className="w-12 h-12 animate-bounce" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                      {lang === 'ar' ? 'مرحباً بك في النادي!' : 'WELCOME TO THE CLUB!'}
                    </h3>
                    <p className="text-zinc-400 text-xs font-mono">
                      {lang === 'ar' ? 'لقد تم إنشاء أوراق اعتماد الأداء العالي الخاصة بك الآن.' : 'Your high-performance credentials are now generated.'}
                    </p>
                  </div>
                  <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl text-left rtl:text-right max-w-sm mx-auto space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 rtl:flex-row-reverse">
                      <span>{lang === 'ar' ? 'اسم العضو:' : 'MEMBER NAME:'}</span>
                      <span className="text-white font-bold">{formData.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 rtl:flex-row-reverse">
                      <span>{lang === 'ar' ? 'فئة الخطة:' : 'PLAN LEVEL:'}</span>
                      <span className="text-[#FF4D00] font-black uppercase">{getPlanName(planId)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 rtl:flex-row-reverse">
                      <span>{lang === 'ar' ? 'الهدف الرئيسي:' : 'PRIMARY GOAL:'}</span>
                      <span className="text-zinc-300 font-bold uppercase">
                        {formData.goal === 'muscle' 
                          ? (lang === 'ar' ? 'بناء العضلات' : 'Build Muscle') 
                          : formData.goal === 'strength' 
                            ? (lang === 'ar' ? 'رفع أثقال ثقيل' : 'Heavy Powerlifting') 
                            : formData.goal === 'fat_loss' 
                              ? (lang === 'ar' ? 'حرق الدهون' : 'Fat Loss') 
                              : (lang === 'ar' ? 'تركيز الاستشفاء' : 'Recovery Focus')}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-500 animate-pulse">
                    {lang === 'ar' ? 'نافذة الجهاز هذه آمنة. سيتم إغلاق لوحة التحكم قريباً...' : 'This terminal window is secure. Closing dashboard shortly...'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
