import React, { useState } from 'react';
import { pricingPlans } from '../data';
import { useLanguage } from '../LanguageContext';
import { pricingTranslations } from '../translations';
import { Check, Star, Sparkles, Trophy, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PricingSection() {
  const { lang, t, isRtl } = useLanguage();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_elite');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const handleJoinClub = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the plan again when clicking the button
    window.dispatchEvent(new CustomEvent('open-gym-join', { detail: { planId } }));
  };

  const getLocalizedPlan = (plan: any) => {
    const pid = plan.id as 'plan_base' | 'plan_elite' | 'plan_alpha';
    const dict = pricingTranslations[lang];
    if (!dict) return plan;

    return {
      ...plan,
      name: dict[`${pid}.name`] || plan.name,
      description: dict[`${pid}.description`] || plan.description,
      features: [
        dict[`${pid}.f1`] || plan.features[0],
        dict[`${pid}.f2`] || plan.features[1],
        dict[`${pid}.f3`] || plan.features[2],
        dict[`${pid}.f4`] || plan.features[3],
        dict[`${pid}.f5`] || plan.features[4],
      ].filter(Boolean),
    };
  };

  return (
    <section id="pricing" className="py-24 bg-transparent relative overflow-hidden border-t border-white/5">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF4D00]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header Block */}
        <div className="text-center space-y-4 mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-white/5 rounded-full text-zinc-400 text-xs font-mono tracking-widest uppercase">
            <Trophy className="w-3.5 h-3.5 text-[#FF4D00]" />
            {lang === 'ar' ? 'باقات خطط العضوية' : 'MEMBER PLAN PACKAGES'}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">
            {lang === 'ar' ? (
              <>
                اختر باقات <br />
                <span className="text-transparent text-stroke select-none">
                  التدريب الخاصة بك
                </span>
              </>
            ) : (
              <>
                CHOOSE YOUR <br />
                <span className="text-transparent text-stroke select-none">
                  TRAINING PACKAGES
                </span>
              </>
            )}
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base">
            {lang === 'ar' ? 'لا توجد التزامات طويلة الأجل. حدد فئة الدخول التي تطابق طموحاتك الحركية والبدنية. وفر 20% مع الخطط السنوية.' : 'No long-term lock-ins. Select the access tier matching your kinetic ambitions. Save 20% on our annual plans.'}
          </p>

          {/* Billing Switcher (Tab Selector) */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center bg-black border border-white/5 p-1.5 rounded-full">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-full transition-all ${
                  billing === 'monthly'
                    ? 'bg-[#FF4D00] text-black shadow-[0_4px_15px_rgba(255,77,0,0.25)]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'خطة شهرية' : 'Monthly Plan'}
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-full transition-all ${
                  billing === 'annual'
                    ? 'bg-[#FF4D00] text-black shadow-[0_4px_15px_rgba(255,77,0,0.25)]'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {lang === 'ar' ? 'سنوي (وفر 20%)' : 'Annual (Save 20%)'}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {pricingPlans.map((rawPlan) => {
            const plan = getLocalizedPlan(rawPlan);
            // Price calculation based on switcher
            const isAnnual = billing === 'annual';
            const priceNum = parseInt(plan.price.replace('$', ''));
            const calculatedPrice = isAnnual ? Math.floor(priceNum * 0.8) : priceNum;
            const isSelected = selectedPlanId === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 ease-out select-none ${
                  isSelected
                    ? 'border-[#FF4D00] bg-black scale-[1.04] -translate-y-4 shadow-[0_25px_60px_rgba(255,77,0,0.18)] z-20'
                    : 'border-white/5 bg-black/40 hover:border-[#FF4D00]/70 hover:scale-[1.04] hover:-translate-y-4 hover:shadow-[0_25px_60px_rgba(255,77,0,0.15)] hover:bg-black/80 z-10 hover:z-20'
                }`}
              >
                {/* Popular Tier Badge Overlay */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF4D00] rounded-full text-[10px] font-black uppercase tracking-widest text-black shadow-lg flex items-center gap-1">
                    {lang === 'ar' ? 'الخيار الموصى به' : 'RECOMMENDED CONSOLE'}
                  </div>
                )}

                {/* Pricing Info */}
                <div className="space-y-6 text-left rtl:text-right">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                      {plan.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 leading-normal h-10">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price Plate */}
                  <div className="flex items-baseline gap-1 font-sans rtl:flex-row-reverse rtl:justify-end">
                    <span className="text-5xl font-black text-white">${calculatedPrice}</span>
                    <span className="text-gray-500 font-mono text-sm">/{lang === 'ar' ? (billing === 'annual' ? 'عام' : 'شهرياً') : plan.period}</span>
                  </div>

                  {/* Feature items */}
                  <div className="h-px bg-white/5" />

                  <ul className="space-y-3.5">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 rtl:flex-row-reverse">
                        <div className="p-0.5 rounded-md bg-[#FF4D00]/10 border border-[#FF4D00]/20 text-[#FF4D00] mt-0.5 flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-gray-300 text-xs md:text-sm leading-relaxed flex-1">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action Button */}
                <div className="pt-8">
                  {isSelected ? (
                    <button 
                      onClick={(e) => handleJoinClub(plan.id, e)}
                      className="group relative w-full"
                    >
                      <div className="absolute inset-0 bg-[#FF4D00] blur-md opacity-30 group-hover:opacity-60 transition-opacity rounded-sm"></div>
                      <div className="relative w-full bg-[#FF4D00] text-black py-4 font-black uppercase text-xs skew-x-[-12deg] flex items-center justify-center gap-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5">
                        {lang === 'ar' ? 'انضم إلى النادي الآن' : 'JOIN THE CLUB'}
                      </div>
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => handleJoinClub(plan.id, e)}
                      className="w-full py-3.5 bg-black hover:bg-zinc-900 text-gray-300 hover:text-white border border-white/10 hover:border-[#FF4D00]/50 rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                    >
                      {lang === 'ar' ? 'انضم إلى النادي الآن' : 'JOIN THE CLUB'}
                    </button>
                  )}
                  <p className="text-center text-[10px] text-zinc-600 font-mono mt-3 uppercase tracking-wider">
                    {lang === 'ar' ? 'تتضمن تجربة حيوية بدنية لمدة 7 أيام' : '7-Day biometric trial included'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bilingual Contact Form */}
        <div 
          id="contact-us-form-section" 
          dir={isRtl ? "rtl" : "ltr"}
          className="mt-16 max-w-xl mx-auto bg-black/80 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-left rtl:text-right"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            {/* Clickable Header Trigger */}
            <div 
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="cursor-pointer select-none flex items-center justify-between gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all duration-200"
            >
              <div className="flex-1 text-center">
                {lang === 'ar' ? (
                  <p className="text-zinc-300 text-sm md:text-base font-semibold leading-relaxed text-center">
                    إذا كنت تريد إضافة شيء ما، أو إذا كنت تريد الاستفسار عن أي شيء مثل <span className="text-[#FF4D00] font-bold">"اتصل بنا"</span>
                  </p>
                ) : (
                  <p className="text-zinc-300 text-sm md:text-base font-semibold leading-relaxed text-center">
                    If you want to add something, if you want to ask anything like <span className="text-[#FF4D00] font-bold">"contact us"</span>
                  </p>
                )}
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-zinc-400 transition-transform duration-300 flex-shrink-0 ${isFormExpanded ? 'rotate-180 text-[#FF4D00]' : ''}`} 
              />
            </div>

            <AnimatePresence>
              {isFormExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-6 border-t border-white/5 space-y-6 mt-2">
                    {formSubmitted ? (
                      <div className="text-center py-6 space-y-4 bg-zinc-950/50 border border-emerald-500/20 rounded-2xl p-4">
                        <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                          <Check className="w-6 h-6" />
                        </div>
                        {lang === 'ar' ? (
                          <div className="space-y-1">
                            <h4 className="text-white font-bold text-sm">تم استلام الرسالة!</h4>
                            <p className="text-zinc-400 text-xs">سيتواصل معك أخصائيو الأداء لدينا في أقرب وقت ممكن.</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <h4 className="text-white font-bold text-sm">Message Received!</h4>
                            <p className="text-zinc-400 text-xs">Our performance specialists will get back to you shortly.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (formData.name && formData.email && formData.message) {
                            setFormSubmitted(true);
                          }
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left rtl:text-right">
                            <label className="block text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider">
                              {lang === 'ar' ? 'الاسم' : 'Name'}
                            </label>
                            <input 
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your Name'}
                              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]/50 transition-colors"
                            />
                          </div>
                          
                          <div className="space-y-1.5 text-left rtl:text-right">
                            <label className="block text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider">
                              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                            </label>
                            <input 
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="you@example.com"
                              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]/50 transition-colors font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-left rtl:text-right">
                          <label className="block text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider">
                            {lang === 'ar' ? 'الرسالة' : 'Message'}
                          </label>
                          <textarea 
                            required
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder={lang === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we assist you?'}
                            className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4D00]/50 transition-colors resize-none"
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full relative group"
                        >
                          <div className="absolute inset-0 bg-[#FF4D00] blur-sm opacity-20 group-hover:opacity-40 transition-opacity rounded-sm"></div>
                          <div className="relative w-full bg-[#FF4D00] text-black py-3 font-black uppercase text-xs skew-x-[-10deg] flex items-center justify-center gap-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                            <span>{lang === 'ar' ? 'إرسال الرسالة' : 'Submit Message'}</span>
                          </div>
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
