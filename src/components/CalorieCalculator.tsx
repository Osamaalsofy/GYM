import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Flame, 
  Activity, 
  User, 
  Scale, 
  Ruler, 
  Calendar, 
  TrendingUp, 
  Info, 
  ChevronRight,
  TrendingDown,
  LineChart
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { calculatorTranslations } from '../translations';

// Define goals and activity levels
interface GoalPreset {
  id: string;
  name: string;
  description: string;
  carbRatio: number; // percentage (e.g., 40 for 40%)
  proteinRatio: number;
  fatRatio: number;
  calorieOffset: number; // kcal adjustment from TDEE
  icon: React.ReactNode;
}

interface ActivityLevel {
  id: string;
  name: string;
  description: string;
  multiplier: number;
}

export default function CalorieCalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang, t, isRtl } = useLanguage();
  
  // Track mouse coordinates for cinematic 3D tilt effect on the results card
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const rotateX = useSpring(rotateXValue, springConfig);
  const rotateY = useSpring(rotateYValue, springConfig);

  // Dynamic glare overlay for the results card
  const glareX = useTransform(rotateY, [-15, 15], ['100%', '0%']);
  const glareY = useTransform(rotateX, [-15, 15], ['100%', '0%']);
  const glareOpacity = useTransform(rotateX, [-15, 0, 15], [0.5, 0.1, 0.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Relative coordinates (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Convert to degrees of rotation (max 12 degrees)
    rotateXValue.set(-y * 24);
    rotateYValue.set(x * 24);
  };

  const handleMouseLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
  };

  // State parameters
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  
  // Height state
  const [heightCm, setHeightCm] = useState<number>(180);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(11);
  
  // Weight state
  const [weightKg, setWeightKg] = useState<number>(80);
  const [weightLbs, setWeightLbs] = useState<number>(175);

  const [selectedActivity, setSelectedActivity] = useState<string>('moderate');
  const [selectedGoal, setSelectedGoal] = useState<string>('maintain');

  // Activity presets
  const activityLevels: ActivityLevel[] = [
    { id: 'sedentary', name: calculatorTranslations[lang]['sedentary.name'] || 'Sedentary', description: calculatorTranslations[lang]['sedentary.desc'] || 'Desk job, minimal formal exercise', multiplier: 1.2 },
    { id: 'light', name: calculatorTranslations[lang]['light.name'] || 'Light Intensity', description: calculatorTranslations[lang]['light.desc'] || 'Active 1-3 days/week, light sports', multiplier: 1.375 },
    { id: 'moderate', name: calculatorTranslations[lang]['moderate.name'] || 'Moderate Chassis', description: calculatorTranslations[lang]['moderate.desc'] || 'Intense training 3-5 days/week', multiplier: 1.55 },
    { id: 'active', name: calculatorTranslations[lang]['active.name'] || 'Heavy Load', description: calculatorTranslations[lang]['active.desc'] || 'Daily athletic conditioning / physical job', multiplier: 1.725 },
    { id: 'extreme', name: calculatorTranslations[lang]['extreme.name'] || 'Elite Protocol', description: calculatorTranslations[lang]['extreme.desc'] || 'Twice daily professional athletic loads', multiplier: 1.9 },
  ];

  // Goal / Diet presets
  const goalPresets: GoalPreset[] = [
    { 
      id: 'shred', 
      name: calculatorTranslations[lang]['shred.name'] || 'Vortex Shred', 
      description: calculatorTranslations[lang]['shred.desc'] || 'Optimized lipid oxidation and lean cut protocol', 
      carbRatio: 30, 
      proteinRatio: 40, 
      fatRatio: 30, 
      calorieOffset: -500,
      icon: <TrendingDown className="w-4 h-4 text-rose-500" />
    },
    { 
      id: 'maintain', 
      name: calculatorTranslations[lang]['maintain.name'] || 'Chassis Balance', 
      description: calculatorTranslations[lang]['maintain.desc'] || 'Stabilize body composition and optimize compound output', 
      carbRatio: 45, 
      proteinRatio: 30, 
      fatRatio: 25, 
      calorieOffset: 0,
      icon: <Activity className="w-4 h-4 text-amber-500" />
    },
    { 
      id: 'bulk', 
      name: calculatorTranslations[lang]['bulk.name'] || 'Anabolic Surge', 
      description: calculatorTranslations[lang]['bulk.desc'] || 'Caloric surplus for absolute power & glycogen loading', 
      carbRatio: 55, 
      proteinRatio: 25, 
      fatRatio: 20, 
      calorieOffset: 450,
      icon: <TrendingUp className="w-4 h-4 text-[#FF4D00]" />
    }
  ];

  // Calculated values
  const [bmr, setBmr] = useState<number>(1800);
  const [tdee, setTdee] = useState<number>(2500);
  const [targetCalories, setTargetCalories] = useState<number>(2500);

  // Dynamic calculated nutrients
  const [macros, setMacros] = useState({
    carbsCal: 1000,
    carbsG: 250,
    proteinCal: 750,
    proteinG: 187,
    fatCal: 750,
    fatG: 83
  });

  // Calculate whenever inputs change
  useEffect(() => {
    // Determine weight in kg
    const finalWeightKg = unitSystem === 'metric' ? weightKg : weightLbs * 0.45359237;
    
    // Determine height in cm
    const finalHeightCm = unitSystem === 'metric' 
      ? heightCm 
      : (heightFt * 12 + heightIn) * 2.54;

    // BMR using Mifflin-St Jeor Equation
    let calculatedBmr = 0;
    if (gender === 'male') {
      calculatedBmr = 10 * finalWeightKg + 6.25 * finalHeightCm - 5 * age + 5;
    } else {
      calculatedBmr = 10 * finalWeightKg + 6.25 * finalHeightCm - 5 * age - 161;
    }

    // Safely clip BMR
    calculatedBmr = Math.max(500, Math.round(calculatedBmr));

    // Get activity multiplier
    const activityObj = activityLevels.find(a => a.id === selectedActivity) || activityLevels[2];
    const calculatedTdee = Math.round(calculatedBmr * activityObj.multiplier);

    // Get goal offset
    const goalObj = goalPresets.find(g => g.id === selectedGoal) || goalPresets[1];
    const calculatedTargetCal = Math.max(1000, calculatedTdee + goalObj.calorieOffset);

    // Calculate Macro divisions
    const carbsCal = Math.round(calculatedTargetCal * (goalObj.carbRatio / 100));
    const carbsG = Math.round(carbsCal / 4);

    const proteinCal = Math.round(calculatedTargetCal * (goalObj.proteinRatio / 100));
    const proteinG = Math.round(proteinCal / 4);

    const fatCal = Math.round(calculatedTargetCal * (goalObj.fatRatio / 100));
    const fatG = Math.round(fatCal / 9);

    setBmr(calculatedBmr);
    setTdee(calculatedTdee);
    setTargetCalories(calculatedTargetCal);
    setMacros({
      carbsCal,
      carbsG,
      proteinCal,
      proteinG,
      fatCal,
      fatG
    });
  }, [unitSystem, gender, age, heightCm, heightFt, heightIn, weightKg, weightLbs, selectedActivity, selectedGoal]);

  // Adjust sliders
  const handleAgeChange = (val: number) => {
    setAge(Math.min(99, Math.max(10, val)));
  };

  const handleWeightChange = (val: number) => {
    if (unitSystem === 'metric') {
      setWeightKg(Math.min(250, Math.max(30, val)));
    } else {
      setWeightLbs(Math.min(550, Math.max(60, val)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeightCm(Math.min(240, Math.max(100, val)));
  };

  // Preset button macros
  const activeGoalPreset = goalPresets.find(g => g.id === selectedGoal) || goalPresets[1];

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-stretch justify-between w-full max-w-6xl mx-auto p-4">
      {/* Inputs panel (Left Column) */}
      <div className="w-full lg:w-7/12 text-left rtl:text-right space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-white/5 rounded-full text-[#FF4D00] text-xs font-mono tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            {lang === 'ar' ? 'مختبر فورتكس لعمليات الأيض' : 'Vortex Metabolic Lab'}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight uppercase italic">
            {lang === 'ar' ? (
              <>
                محاكي السعرات <br />
                <span className="text-transparent text-stroke select-none">
                  والماكروز الذكي
                </span>
              </>
            ) : (
              <>
                Calorie & Macro <br/>
                <span className="text-transparent text-stroke select-none">
                  Optimization Chassis
                </span>
              </>
            )}
          </h2>
          
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            {lang === 'ar' 
              ? 'قم بضبط مؤشراتك الحيوية أدناه. يقوم محركنا الديناميكي الحراري المتقدم بحساب استهلاك الطاقة المستهدف وتوزيع الكربوهيدرات والدهون والبروتينات ديناميكياً بناءً على مصفوفتك البدنية.'
              : 'Configure your biometrics below. Our advanced thermodynamic engine computes your target energy expenditure and distributes carbs and lipids dynamically based on your physical matrix.'}
          </p>

          {/* Unit and Gender Quick Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {/* System select */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                {lang === 'ar' ? 'نظام القياس' : 'Measurement Standard'}
              </span>
              <div className="grid grid-cols-2 bg-black border border-white/5 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    unitSystem === 'metric'
                      ? 'bg-[#FF4D00] text-black font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t('calc.metric')}
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    unitSystem === 'imperial'
                      ? 'bg-[#FF4D00] text-black font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t('calc.imperial')}
                </button>
              </div>
            </div>

            {/* Gender Select */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                {lang === 'ar' ? 'الجنس البدني' : 'Gender Alignment'}
              </span>
              <div className="grid grid-cols-2 bg-black border border-white/5 rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-[#FF4D00] text-black font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t('calc.male')}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-[#FF4D00] text-black font-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t('calc.female')}
                </button>
              </div>
            </div>
          </div>

          {/* Sliders and fields */}
          <div className="space-y-4 pt-2">
            
            {/* Age Parameter */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <div className="flex items-center gap-2 font-mono text-xs text-gray-400 uppercase tracking-wider rtl:flex-row-reverse">
                  <Calendar className="w-3.5 h-3.5 text-[#FF4D00]" />
                  {lang === 'ar' ? 'العمر الفسيولوجي' : 'Biological Age'}
                </div>
                <div className="text-xl font-mono font-black text-white">
                  {age} <span className="text-xs text-gray-500 uppercase">{t('calc.years')}</span>
                </div>
              </div>
              <input 
                type="range"
                min="14"
                max="85"
                value={age}
                onChange={(e) => handleAgeChange(parseInt(e.target.value))}
                className="w-full accent-[#FF4D00] bg-[#111] h-1 rounded-full appearance-none cursor-pointer animate-none"
              />
            </div>

            {/* Height Parameter */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <div className="flex items-center gap-2 font-mono text-xs text-gray-400 uppercase tracking-wider rtl:flex-row-reverse">
                  <Ruler className="w-3.5 h-3.5 text-[#FF4D00]" />
                  {lang === 'ar' ? 'الطول والقامة' : 'Vertical Stature'}
                </div>
                {unitSystem === 'metric' ? (
                  <div className="text-xl font-mono font-black text-white">
                    {heightCm} <span className="text-xs text-gray-500 uppercase">{t('calc.cm')}</span>
                  </div>
                ) : (
                  <div className="text-xl font-mono font-black text-white rtl:flex-row-reverse flex gap-1">
                    <span>{heightFt}</span><span className="text-xs text-gray-500 mr-2 uppercase">{t('calc.ft')}</span>
                    <span>{heightIn}</span><span className="text-xs text-gray-500 uppercase">{t('calc.in')}</span>
                  </div>
                )}
              </div>
              
              {unitSystem === 'metric' ? (
                <input 
                  type="range"
                  min="120"
                  max="225"
                  value={heightCm}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                  className="w-full accent-[#FF4D00] bg-[#111] h-1 rounded-full appearance-none cursor-pointer animate-none"
                />
              ) : (
                <div className="flex gap-4 pt-1 rtl:flex-row-reverse">
                  <div className="flex-1 flex items-center gap-2 bg-black border border-white/5 rounded-lg px-3 py-1.5 rtl:flex-row-reverse">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{t('calc.ft')}</span>
                    <input 
                      type="number" 
                      min="3" 
                      max="8" 
                      value={heightFt}
                      onChange={(e) => setHeightFt(Math.min(8, Math.max(3, parseInt(e.target.value) || 0)))}
                      className="bg-transparent text-white font-mono text-right rtl:text-left w-full outline-none"
                    />
                  </div>
                  <div className="flex-1 flex items-center gap-2 bg-black border border-white/5 rounded-lg px-3 py-1.5 rtl:flex-row-reverse">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{t('calc.in')}</span>
                    <input 
                      type="number" 
                      min="0" 
                      max="11" 
                      value={heightIn}
                      onChange={(e) => setHeightIn(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="bg-transparent text-white font-mono text-right rtl:text-left w-full outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Weight Parameter */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between rtl:flex-row-reverse">
                <div className="flex items-center gap-2 font-mono text-xs text-gray-400 uppercase tracking-wider rtl:flex-row-reverse">
                  <Scale className="w-3.5 h-3.5 text-[#FF4D00]" />
                  {lang === 'ar' ? 'الكتلة والوزن النشط' : 'Active Mass'}
                </div>
                <div className="text-xl font-mono font-black text-white">
                  {unitSystem === 'metric' ? `${weightKg} ${t('calc.kg')}` : `${weightLbs} ${t('calc.lbs')}`}
                </div>
              </div>
              <input 
                type="range"
                min={unitSystem === 'metric' ? "40" : "90"}
                max={unitSystem === 'metric' ? "180" : "400"}
                value={unitSystem === 'metric' ? weightKg : weightLbs}
                onChange={(e) => handleWeightChange(parseInt(e.target.value))}
                className="w-full accent-[#FF4D00] bg-[#111] h-1 rounded-full appearance-none cursor-pointer animate-none"
              />
            </div>
          </div>

          {/* Activity Matrix List */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
              {lang === 'ar' ? 'معدل النشاط البدني' : 'Activity Velocity'}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-black/40 border border-white/5 p-1.5 rounded-2xl">
              {activityLevels.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setSelectedActivity(act.id)}
                  className={`px-3 py-2.5 rounded-xl text-left rtl:text-right font-sans transition-all border cursor-pointer ${
                    selectedActivity === act.id
                      ? 'bg-black border-[#FF4D00] text-white shadow-[0_0_15px_rgba(255,77,0,0.15)]'
                      : 'bg-transparent border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-black uppercase truncate tracking-tight">{act.name}</div>
                  <div className="text-[9px] text-gray-500 font-mono mt-0.5 truncate leading-none">
                    {act.multiplier}x {lang === 'ar' ? 'محرك' : 'Engine'}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Goal Preset Select */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
            {lang === 'ar' ? 'الاتجاه والهدف الحركي' : 'Target Vector / Energy Shift'}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {goalPresets.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGoal(g.id)}
                className={`p-4 rounded-xl text-left rtl:text-right flex items-start gap-3 transition-all border cursor-pointer ${
                  selectedGoal === g.id
                    ? 'bg-[#FF4D00]/10 border-[#FF4D00] text-white shadow-[0_0_15px_rgba(255,77,0,0.1)]'
                    : 'bg-black/60 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <div className="p-2 rounded-lg bg-black border border-white/5 mt-0.5 flex-shrink-0">
                  {g.icon}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                    {g.name}
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {g.calorieOffset > 0 ? `+${g.calorieOffset}` : g.calorieOffset} {t('calc.kcal')}
                  </div>
                  <p className="text-[9px] text-gray-400 leading-snug line-clamp-1">
                    {g.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results HUD Dashboard (Right Column - Cinematic 3D Card) */}
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center">
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full h-full perspective-container"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Neon backlighting glow shadow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#FF4D00]/10 to-transparent blur-3xl rounded-3xl opacity-60 pointer-events-none" />

          {/* Interactive Card Body */}
          <motion.div
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: 'preserve-3d' 
            }}
            className="w-full bg-gradient-to-b from-[#0a0a0c] to-black border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.9)] relative min-h-[520px] overflow-hidden"
          >
            {/* Glossy Dynamic Glare */}
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 65%)`,
                opacity: glareOpacity,
              }}
            />

            {/* Card Content Wrapper */}
            <div className="space-y-6 relative z-10" style={{ transform: 'translateZ(30px)' }}>
              
              {/* Header Title */}
              <div className="flex items-center justify-between pb-4 border-b border-white/5 rtl:flex-row-reverse">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                    {lang === 'ar' ? 'التقرير الحيوي والقياسي' : 'BIOMETRIC FEEDBACK'}
                  </span>
                  <h3 className="text-lg font-black text-white tracking-tight uppercase">
                    {lang === 'ar' ? 'التقرير الأيضي للجسد' : 'METABOLIC METRICS'}
                  </h3>
                </div>
                <div className="p-2 rounded-xl bg-black border border-white/5 text-[#FF4D00]">
                  <LineChart className="w-5 h-5" />
                </div>
              </div>

              {/* TDEE Giant Gauge readout */}
              <div className="relative py-4 flex flex-col items-center justify-center text-center" style={{ transform: 'translateZ(45px)' }}>
                {/* Hollow outer border track */}
                <div className="w-44 h-44 rounded-full border-2 border-white/5 flex items-center justify-center relative animate-none">
                  
                  {/* Dynamic rotating outer accent */}
                  <div className="absolute inset-[-4px] border border-dashed border-[#FF4D00]/20 rounded-full animate-slow-rotate pointer-events-none" />

                  {/* Inner ring */}
                  <div className="w-36 h-36 rounded-full bg-black/80 border border-white/10 flex flex-col items-center justify-center text-center shadow-inner relative">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                      {lang === 'ar' ? 'المدخول اليومي المستهدف' : 'DAILY TARGET'}
                    </span>
                    <motion.div 
                      key={targetCalories}
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-black text-white font-mono my-0.5"
                    >
                      {targetCalories}
                    </motion.div>
                    <span className="text-[10px] font-mono text-[#FF4D00] uppercase tracking-wider font-extrabold flex items-center gap-1">
                      <Flame className="w-3 h-3 animate-none" /> {lang === 'ar' ? 'سعرة / يوم' : 'KCAL / DAY'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 w-full text-center">
                  <div className="bg-black/50 border border-white/5 p-2 rounded-xl">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                      {lang === 'ar' ? 'معدل الأيض الأساسي (BMR)' : 'BASAL BMR'}
                    </span>
                    <span className="text-sm font-bold text-gray-300 font-mono">{bmr} {t('calc.kcal')}</span>
                  </div>
                  <div className="bg-black/50 border border-white/5 p-2 rounded-xl">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                      {lang === 'ar' ? 'إجمالي حرق محرك الجسم (TDEE)' : 'TDEE ENGINE'}
                    </span>
                    <span className="text-sm font-bold text-gray-300 font-mono">{tdee} {t('calc.kcal')}</span>
                  </div>
                </div>
              </div>

              {/* Macros Matrix Section (Eating carbs and fat, plus protein) */}
              <div className="space-y-3.5 text-left rtl:text-right" style={{ transform: 'translateZ(60px)' }}>
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">
                  {lang === 'ar' ? `نسب الوقود التكتيكية (${activeGoalPreset.name})` : `TACTICAL FUEL RATIOS (${activeGoalPreset.name})`}
                </span>
                
                {/* Carbohydrates */}
                <div className="space-y-1 bg-black/40 border border-white/5 p-3.5 rounded-xl hover:bg-black/80 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono font-bold rtl:flex-row-reverse">
                    <span className="text-white flex items-center gap-1.5 uppercase rtl:flex-row-reverse">
                      <span className="w-2 h-2 rounded-full bg-[#FF4D00]" />
                      {t('calc.carbs')}
                    </span>
                    <span className="text-[#FF4D00]">{activeGoalPreset.carbRatio}% <span className="text-gray-500">({macros.carbsG}{t('calc.g')})</span></span>
                  </div>
                  <div className="h-1 bg-[#111] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 bg-[#FF4D00] h-full" style={{ width: `${activeGoalPreset.carbRatio}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-500 rtl:flex-row-reverse">
                    <span>{lang === 'ar' ? 'طاقة ووقود عضلات عالي السرعة' : 'High-intensity muscle glycogen fuel'}</span>
                    <span>{macros.carbsCal} {lang === 'ar' ? 'سعرة' : 'KCAL'}</span>
                  </div>
                </div>

                {/* Lipids / Fats */}
                <div className="space-y-1 bg-black/40 border border-white/5 p-3.5 rounded-xl hover:bg-black/80 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono font-bold rtl:flex-row-reverse">
                    <span className="text-white flex items-center gap-1.5 uppercase rtl:flex-row-reverse">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {t('calc.fat')}
                    </span>
                    <span className="text-amber-500">{activeGoalPreset.fatRatio}% <span className="text-gray-500">({macros.fatG}{t('calc.g')})</span></span>
                  </div>
                  <div className="h-1 bg-[#111] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 bg-amber-500 h-full" style={{ width: `${activeGoalPreset.fatRatio}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-500 rtl:flex-row-reverse">
                    <span>{lang === 'ar' ? 'دعم الهرمونات الحيوية واستشفاء المفاصل' : 'Hormonal homeostasis & joint recovery'}</span>
                    <span>{macros.fatCal} {lang === 'ar' ? 'سعرة' : 'KCAL'}</span>
                  </div>
                </div>

                {/* Protein */}
                <div className="space-y-1 bg-black/40 border border-white/5 p-3.5 rounded-xl hover:bg-black/80 transition-colors">
                  <div className="flex items-center justify-between text-xs font-mono font-bold rtl:flex-row-reverse">
                    <span className="text-white flex items-center gap-1.5 uppercase rtl:flex-row-reverse">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      {t('calc.protein')}
                    </span>
                    <span className="text-gray-300">{activeGoalPreset.proteinRatio}% <span className="text-gray-500">({macros.proteinG}{t('calc.g')})</span></span>
                  </div>
                  <div className="h-1 bg-[#111] rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 bg-gray-400 h-full" style={{ width: `${activeGoalPreset.proteinRatio}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-gray-500 rtl:flex-row-reverse">
                    <span>{lang === 'ar' ? 'البناء العضلي وتجديد الأنسجة التالفة' : 'Nitrogen balance & tissue restoration'}</span>
                    <span>{macros.proteinCal} {lang === 'ar' ? 'سعرة' : 'KCAL'}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Status strip */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-left rtl:text-right relative z-10" style={{ transform: 'translateZ(15px)' }}>
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                  {lang === 'ar' ? 'معالج السعرات الحرارية نشط الآن' : 'CALORIE CO-PROCESSOR ACTIVE'}
                </span>
              </div>
              <span className="text-[9px] font-mono text-gray-600">v3.5</span>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
