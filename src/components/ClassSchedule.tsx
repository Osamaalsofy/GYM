import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { workoutPrograms } from '../data';
import { WorkoutProgram } from '../types';
import { 
  Activity, 
  Flame, 
  ShieldAlert, 
  Timer, 
  ChevronRight, 
  CheckCircle2, 
  Gauge, 
  Heart, 
  Zap, 
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  Play,
  Pause
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { programsTranslations } from '../translations';
import { getAssetPath } from '../utils';

// Specialized workout-specific exercise steps with baseline intensity values
interface ExerciseStep {
  name: string;
  defaultSets: number;
  durationMin: number;
}

const workoutSteps: Record<string, ExerciseStep[]> = {
  p1: [
    { name: "Heavy Barbell Back Squats (85% 1RM)", defaultSets: 5, durationMin: 12 },
    { name: "Heavy Barbell Flat Bench Press", defaultSets: 5, durationMin: 10 },
    { name: "Deadlift Pull Compounds (Deficit blocks)", defaultSets: 3, durationMin: 12 },
    { name: "Fatigued Weighted Pull-Ups", defaultSets: 3, durationMin: 8 },
    { name: "Metabolic Kettlebell High-Velocity Finishers", defaultSets: 2, durationMin: 5 }
  ],
  p2: [
    { name: "Agility Ladder & Hip Mobility Drills", defaultSets: 3, durationMin: 10 },
    { name: "Heavy Russian Kettlebell Swings", defaultSets: 4, durationMin: 8 },
    { name: "Goblet Squats & Alternating Reverse Lunges", defaultSets: 4, durationMin: 12 },
    { name: "Dynamic Plank to Push-Up Rotations", defaultSets: 3, durationMin: 8 },
    { name: "Tactical Static Stretch Cooldown", defaultSets: 1, durationMin: 6 }
  ],
  p3: [
    { name: "Full-Body Kinetic Movement & Scan Drills", defaultSets: 2, durationMin: 8 },
    { name: "Controlled Goblet Squats for Depth Focus", defaultSets: 3, durationMin: 12 },
    { name: "Incline Chest-Supported Dumbbell Rows", defaultSets: 3, durationMin: 10 },
    { name: "Incline Bench Dumbbell Press (Mechanical focus)", defaultSets: 3, durationMin: 10 },
    { name: "Ankle Mobility & Core Braced Plank Hold", defaultSets: 3, durationMin: 8 }
  ]
};

export default function ClassSchedule() {
  const { lang, t, isRtl } = useLanguage();
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Elite'>('All');
  const [activeWorkout, setActiveWorkout] = useState<WorkoutProgram | null>(workoutPrograms[0]);
  
  // Custom steps state that includes the exercise, interactive sets, and completion status
  const [currentSteps, setCurrentSteps] = useState<(ExerciseStep & { completed: boolean; currentSets: number })[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  
  // Dynamic user control states for physiological calculation
  const [heartRatePercent, setHeartRatePercent] = useState<number>(75); // 50% to 100% HR Max
  
  // Live session timer simulation states
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Initialize steps whenever the active workout program changes
  useEffect(() => {
    if (activeWorkout) {
      const stepsList = workoutSteps[activeWorkout.id] || workoutSteps['p1'];
      setCurrentSteps(
        stepsList.map((step, idx) => {
          const translationKey = `${activeWorkout.id}.step${idx + 1}`;
          const localizedName = programsTranslations[lang]?.[translationKey as any] || step.name;
          return {
            ...step,
            name: localizedName,
            completed: false,
            currentSets: step.defaultSets
          };
        })
      );
      setElapsedSeconds(0);
      setIsTimerRunning(false);
      setActiveStepIndex(0);
    }
  }, [activeWorkout, lang]);

  // Live Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const filteredPrograms = selectedLevel === 'All'
    ? workoutPrograms
    : workoutPrograms.filter(p => p.level === selectedLevel);

  // Action togglers
  const toggleStepCompleted = (index: number) => {
    setCurrentSteps(prev => 
      prev.map((step, idx) => idx === index ? { ...step, completed: !step.completed } : step)
    );
  };

  const adjustSets = (index: number, delta: number) => {
    setCurrentSteps(prev =>
      prev.map((step, idx) => 
        idx === index 
          ? { ...step, currentSets: Math.min(8, Math.max(1, step.currentSets + delta)) } 
          : step
      )
    );
  };

  // Base computations
  const totalOriginalSets = currentSteps.reduce((acc, s) => acc + s.defaultSets, 0) || 1;
  const currentTotalSets = currentSteps.reduce((acc, s) => acc + s.currentSets, 0) || 1;
  const completedSteps = currentSteps.filter(s => s.completed);
  
  // Compute multiplier based on completed sets and current set weights
  const completedSetsCount = currentSteps.reduce((acc, s) => acc + (s.completed ? s.currentSets : 0), 0);
  
  // Dynamic completion percentage
  const completionRate = currentSteps.length > 0 
    ? Math.round((completedSteps.length / currentSteps.length) * 100) 
    : 0;

  // Heart Rate multiplier affects the caloric output density
  // Standard HR multiplier ranges from 0.7x (at 50% HR) to 1.3x (at 100% HR)
  const hrMultiplier = 0.7 + ((heartRatePercent - 50) / 50) * 0.6;
  
  // Custom interactive set modifier (compares user configured sets with baseline template sets)
  const setScalingMultiplier = currentTotalSets / totalOriginalSets;

  // Final Live Calories Calculated
  const baseCalories = activeWorkout ? activeWorkout.calories : 500;
  // Live calories scaled by completion rate, current sets scaling, and intensity/heart rate
  const liveTotalCalories = Math.round(
    (completedSetsCount / totalOriginalSets) * baseCalories * hrMultiplier
  );

  // Dynamic Substrate partition / Average needs for carbs and fat during high-exertion (physiological RER)
  // Higher heart rate/intensity uses more Carbohydrates (anaerobic glycolosis).
  // Lower heart rate uses more Lipids/Fats (aerobic lipolysis).
  // Carb burn percentage: ranges from 35% (at 50% HR) up to 90% (at 100% HR)
  const carbBurnPercent = Math.round(35 + ((heartRatePercent - 50) / 50) * 55);
  const fatBurnPercent = 100 - carbBurnPercent;

  // Calories divided between Carbs and Fat
  const carbCalBurned = Math.round(liveTotalCalories * (carbBurnPercent / 100));
  const fatCalBurned = Math.round(liveTotalCalories * (fatBurnPercent / 100));

  // Convert calories to grams: 1g Carbohydrates = 4.1 kcal, 1g Fat = 9.3 kcal
  const carbGramsBurned = parseFloat((carbCalBurned / 4.1).toFixed(1));
  const fatGramsBurned = parseFloat((fatCalBurned / 9.3).toFixed(1));

  // Format Stopwatch time
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    setCurrentSteps(prev => prev.map(s => ({ ...s, completed: false, currentSets: s.defaultSets })));
    setElapsedSeconds(0);
    setIsTimerRunning(false);
  };

  return (
    <section id="schedule" className="py-24 bg-transparent relative overflow-hidden border-t border-white/5">
      {/* Dynamic ambient background glowing grids */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-[#FF4D00]/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-amber-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-white/5 rounded-full text-zinc-400 text-xs font-mono tracking-widest uppercase">
            <Activity className="w-3.5 h-3.5 text-[#FF4D00] animate-pulse" />
            {lang === 'ar' ? 'مصفوفة البرامج النشطة' : 'Active Program Matrix'}
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">
            {lang === 'ar' ? (
              <>
                اختر برنامجك <br />
                <span className="text-transparent text-stroke select-none">
                  التدريبي المتكامل
                </span>
              </>
            ) : (
              <>
                CHOOSE YOUR <br />
                <span className="text-transparent text-stroke select-none">
                  WORKOUT INTERFACE
                </span>
              </>
            )}
          </h2>
          
          <p className="text-gray-500 text-sm md:text-base">
            {lang === 'ar' 
              ? 'حدد مستوى شدة التمرين البدني، وفلتر النتائج حسب مستوى خبرتك المستهدف، ثم انقر على أي روتين لتشغيل محاكي التدريب النشط.'
              : 'Select an intensity vector below, filter your target experience level, and click any routine to deploy the active training simulator.'}
          </p>

          {/* Level Filter Tabs */}
          <div className="pt-4 flex flex-wrap justify-center gap-2">
            {(['All', 'Beginner', 'Intermediate', 'Elite'] as const).map((lvl) => {
              const label = lvl === 'All' ? t('schedule.all') :
                            lvl === 'Beginner' ? t('schedule.beginner') :
                            lvl === 'Intermediate' ? t('schedule.intermediate') :
                            t('schedule.elite');
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-5 py-2 text-xs font-bold font-mono uppercase tracking-wider rounded-full transition-all border cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-[#FF4D00] text-black border-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.25)]'
                      : 'bg-black text-gray-400 border-white/5 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  {label} {lvl !== 'All' ? (lang === 'ar' ? 'مستوى' : 'Tier') : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Programs Selector Grid */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPrograms.map((prog) => {
                const isActive = activeWorkout?.id === prog.id;
                const title = programsTranslations[lang]?.[`${prog.id}.title` as any] || prog.title;
                const description = programsTranslations[lang]?.[`${prog.id}.description` as any] || prog.description;
                const levelLabel = prog.level === 'Elite' ? t('schedule.elite') : prog.level === 'Intermediate' ? t('schedule.intermediate') : t('schedule.beginner');
                const durationLabel = prog.duration.replace('Weeks', lang === 'ar' ? 'أسابيع' : 'Weeks').replace('Week', lang === 'ar' ? 'أسبوع' : 'Week');
                const musclesStr = programsTranslations[lang]?.[`${prog.id}.muscles` as any] || prog.muscles.join(', ');
                const musclesList = musclesStr.split(',').map(m => m.trim());
                
                return (
                  <button
                    key={prog.id}
                    onClick={() => {
                      setActiveWorkout(prog);
                    }}
                    className={`group relative rounded-2xl border p-5 transition-all flex flex-col justify-between h-72 text-left rtl:text-right overflow-hidden cursor-pointer ${
                      isActive
                        ? 'border-[#FF4D00] bg-black shadow-[0_0_20px_rgba(255,77,0,0.06)]'
                        : 'border-white/5 bg-black/40 hover:bg-black/80 hover:border-white/10'
                    }`}
                  >
                    {/* Background faint graphic image */}
                    <div className="absolute inset-0 opacity-[0.04] group-hover:scale-105 transition-transform duration-700 pointer-events-none">
                      <img src={getAssetPath(prog.image)} alt={title} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                    </div>

                    <div className="space-y-3 relative z-10 w-full">
                      {/* Top status info line */}
                      <div className="flex items-center justify-between rtl:flex-row-reverse">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          prog.level === 'Elite' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : prog.level === 'Intermediate'
                            ? 'bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/20'
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-800'
                        }`}>
                          {levelLabel}
                        </span>
                        
                        <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 font-bold rtl:flex-row-reverse">
                          <Timer className="w-3.5 h-3.5 text-zinc-600" />
                          {durationLabel}
                        </div>
                      </div>

                      {/* Program Title */}
                      <h3 className="text-xl font-black text-white group-hover:text-[#FF4D00] transition-colors uppercase tracking-tight">
                        {title}
                      </h3>

                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">
                        {description}
                      </p>
                    </div>

                    {/* Footer muscles tags */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between rtl:flex-row-reverse relative z-10 w-full">
                      <div className="flex flex-wrap gap-1 rtl:flex-row-reverse">
                        {musclesList.map((m, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-black text-gray-400 rounded text-[9px] font-mono tracking-wider uppercase font-semibold border border-white/5">
                            {m}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#FF4D00] font-black rtl:flex-row-reverse">
                        <Flame className="w-3.5 h-3.5 animate-pulse" />
                        {prog.calories} {lang === 'ar' ? 'سعرة' : 'CAL'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Substrate information helper card */}
            {activeWorkout && (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-4 flex items-start gap-3.5 text-left rtl:text-right">
                <div className="p-2.5 rounded-xl bg-black border border-white/5 mt-0.5 text-amber-500 flex-shrink-0">
                  <Gauge className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                    {lang === 'ar' ? 'بروتوكول تقسيم طاقة الأيض البدني' : 'Energy Metabolism Division Protocol'}
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {lang === 'ar' 
                      ? 'من خلال تعديل مجموعات التدريب وتهيئة معدل ضربات القلب اللحظي (مؤشر الشدة)، يمكنك محاكاة حرق السعرات الحرارية. المعدلات المرتفعة (85%+) تعتمد على الكربوهيدرات السريعة، بينما تعتمد المعدلات المنخفضة (50-65%) على حرق الدهون.'
                      : 'By modifying training sets and configuring live heart rate velocity (Intensity Vector), you can simulate substrate burn. High heart rates (85%+) run primarily on fast-twitch glycolytic carbohydrates, whereas low-aerobic conditioning (50-65%) burns a larger proportion of fatty lipids.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Training Tracker & Dynamic Substrate Calculator */}
          <div className="lg:col-span-5">
            {activeWorkout ? (
              <div className="bg-black border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 text-left rtl:text-right relative overflow-hidden shadow-2xl flex flex-col justify-between h-full">
                {/* Active Program glowing indicator */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF4D00] to-amber-500" />

                {/* Dashboard top segment */}
                <div className="space-y-5">
                  {/* Title & Live Status bar */}
                  <div className="flex items-start justify-between rtl:flex-row-reverse">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        <span className={`h-2 w-2 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest font-extrabold">
                          {isTimerRunning 
                            ? (lang === 'ar' ? 'لوحة تتبع الحصة المباشرة (جاري التسجيل)' : 'LIVE TRACKER CONSOLE (RECORDING)') 
                            : (lang === 'ar' ? 'لوحة التحكم في وضع الاستعداد' : 'CONSOLE STANDBY')}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                        {programsTranslations[lang]?.[`${activeWorkout.id}.title` as any] || activeWorkout.title}
                      </h3>
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={resetSession}
                      className="p-2 rounded-xl bg-[#111] hover:bg-[#222] border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                      title={lang === 'ar' ? 'إعادة تعيين المحاكي' : 'Reset simulator'}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Live Simulation Stop Watch */}
                  <div className="bg-zinc-950/70 border border-white/5 rounded-2xl p-4 flex items-center justify-between rtl:flex-row-reverse">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block">
                        {lang === 'ar' ? 'الوقت المنقضي' : 'ELAPSED TIME'}
                      </span>
                      <span className={`text-2xl font-mono font-black tracking-widest ${isTimerRunning ? 'text-[#FF4D00]' : 'text-gray-400'}`}>
                        {formatTime(elapsedSeconds)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          isTimerRunning 
                            ? 'bg-[#111] hover:bg-[#222] text-amber-500 border border-amber-500/20' 
                            : 'bg-[#FF4D00] text-black hover:scale-[1.02] shadow-[0_0_15px_rgba(255,77,0,0.2)]'
                        }`}
                      >
                        {isTimerRunning ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> {lang === 'ar' ? 'إيقاف مؤقت' : 'Pause'}
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> {lang === 'ar' ? 'بدء المؤقت' : 'Start Timer'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Core Energy Output Gauges */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-950/40 border border-white/5 rounded-2xl">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">
                        {lang === 'ar' ? 'معدل الاكتمال' : 'COMPLETION RATE'}
                      </span>
                      <span className="text-2xl font-black text-[#FF4D00] font-mono">
                        {completionRate}%
                      </span>
                      <span className="text-[9px] font-mono text-gray-600 block">
                        {completedSteps.length} {lang === 'ar' ? 'من' : 'of'} {currentSteps.length} {lang === 'ar' ? 'مكونات' : 'components'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-gray-500 uppercase block">
                        {lang === 'ar' ? 'حرق الطاقة المحاكى' : 'SIMULATED ENERGY BURN'}
                      </span>
                      <span className="text-2xl font-black text-white font-mono flex items-center gap-1">
                        <Flame className="w-5 h-5 text-[#FF4D00]" />
                        {liveTotalCalories} <span className="text-xs text-gray-500 font-medium font-sans">{lang === 'ar' ? 'سعرة' : 'KCAL'}</span>
                      </span>
                      <span className="text-[9px] font-mono text-gray-600 block">
                        {lang === 'ar' ? 'حمل ديناميكي مباشر' : 'Dynamic real-time load'}
                      </span>
                    </div>
                  </div>

                  {/* Live Intensity Heart Rate Slider */}
                  <div className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between rtl:flex-row-reverse">
                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider font-bold flex items-center gap-1.5 rtl:flex-row-reverse">
                        <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        {lang === 'ar' ? 'معدل ضربات القلب (مؤشر الشدة)' : 'Heart Rate (Intensity Vector)'}
                      </span>
                      <span className="text-xs font-mono font-black text-white">
                        {heartRatePercent}% <span className="text-gray-500 text-[10px]">{lang === 'ar' ? 'أقصى نبض' : 'HR MAX'}</span>
                      </span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="100"
                      value={heartRatePercent}
                      onChange={(e) => setHeartRatePercent(parseInt(e.target.value))}
                      className="w-full accent-rose-500 bg-[#111] h-1 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-gray-500">
                      <span>{lang === 'ar' ? '50% هوائي نشط (دهون)' : '50% Active Aerobic (Lipids)'}</span>
                      <span>{lang === 'ar' ? '100% غلايكوليتي متميز (كربوهيدرات)' : '100% Elite Glycolytic (Carbs)'}</span>
                    </div>
                  </div>

                  {/* Substrate Metabolism Division readout (Eating carbs & fat output) */}
                  <div className="bg-[#FF4D00]/5 border border-white/5 p-4 rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between rtl:flex-row-reverse">
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-extrabold block">
                        {lang === 'ar' ? 'تحليل تركيب الوقود المستهلك' : 'FUEL COMPOSITION BREAKDOWN'}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded uppercase">
                        {lang === 'ar' ? 'تحول ديناميكي حراري' : 'Thermodynamic Shift'}
                      </span>
                    </div>

                    {/* Horizontal split visual progress bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-[#FF4D00] h-full transition-all duration-300"
                          style={{ width: `${carbBurnPercent}%` }}
                        />
                        <div 
                          className="bg-amber-500 h-full transition-all duration-300"
                          style={{ width: `${fatBurnPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono font-bold rtl:flex-row-reverse">
                        <span className="text-[#FF4D00] flex items-center gap-1 rtl:flex-row-reverse">
                          ● {lang === 'ar' ? `كربوهيدرات (غلايكوجين) ${carbBurnPercent}%` : `${carbBurnPercent}% Carbs (Glycogen)`}
                        </span>
                        <span className="text-amber-500 flex items-center gap-1 rtl:flex-row-reverse">
                          {lang === 'ar' ? `دهون (ليبيدات) ${fatBurnPercent}%` : `Fats (Lipids) ${fatBurnPercent}%`} ●
                        </span>
                      </div>
                    </div>

                    {/* Calculated energy substrate needs output */}
                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="bg-black/40 border border-white/5 p-2 rounded-xl flex flex-col justify-between text-left rtl:text-right">
                        <span className="text-[8px] font-mono text-gray-500 uppercase block">
                          {lang === 'ar' ? 'حرق الكربوهيدرات' : 'Carbohydrate Burn'}
                        </span>
                        <span className="text-sm font-bold text-[#FF4D00] font-mono mt-0.5">{carbGramsBurned}g <span className="text-gray-500 text-[10px]">({carbCalBurned} {lang === 'ar' ? 'سعرة' : 'kcal'})</span></span>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-2 rounded-xl flex flex-col justify-between text-left rtl:text-right">
                        <span className="text-[8px] font-mono text-gray-500 uppercase block">
                          {lang === 'ar' ? 'حرق الدهون والليبيدات' : 'Lipid / Fat Burn'}
                        </span>
                        <span className="text-sm font-bold text-amber-500 font-mono mt-0.5">{fatGramsBurned}g <span className="text-gray-500 text-[10px]">({fatCalBurned} {lang === 'ar' ? 'سعرة' : 'kcal'})</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Program Components List (Steps - Paginated/Slider Version for Compact UI) */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between rtl:flex-row-reverse">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                        {lang === 'ar' ? 'مواصفات الروتين التدريبي' : 'EXERCISE ROUTINE SPECIFICATION'}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-white/5">
                        {lang === 'ar' 
                          ? `التمرين ${activeStepIndex + 1} من ${currentSteps.length}` 
                          : `Step ${activeStepIndex + 1} of ${currentSteps.length}`}
                      </span>
                    </div>

                    {/* Step segments progress bar */}
                    <div className="flex gap-1.5 h-1 w-full my-2">
                      {currentSteps.map((step, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setActiveStepIndex(idx)}
                          className={`h-full flex-1 rounded-full cursor-pointer transition-all ${
                            idx === activeStepIndex
                              ? 'bg-[#FF4D00]'
                              : step.completed
                              ? 'bg-emerald-500'
                              : 'bg-zinc-800 hover:bg-zinc-700'
                          }`}
                          title={step.name}
                        />
                      ))}
                    </div>

                    {currentSteps[activeStepIndex] && (() => {
                      const step = currentSteps[activeStepIndex];
                      return (
                        <div className="space-y-3">
                          <div
                            className={`p-4 rounded-xl border transition-all ${
                              step.completed
                                ? 'border-emerald-500/20 bg-emerald-950/10 text-gray-300'
                                : 'border-white/10 bg-zinc-950/80 hover:border-white/20'
                            } flex items-center justify-between gap-3 rtl:flex-row-reverse`}
                          >
                            {/* Left: Complete status and title */}
                            <div 
                              onClick={() => toggleStepCompleted(activeStepIndex)}
                              className="flex items-start gap-3 cursor-pointer flex-1 min-w-0 text-left rtl:text-right"
                            >
                              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${
                                step.completed ? 'text-emerald-500' : 'text-zinc-700'
                              }`} />
                              <div className="space-y-0.5">
                                <p className={`text-xs md:text-sm font-sans font-bold leading-snug ${step.completed ? 'line-through text-zinc-500' : 'text-gray-200'}`}>
                                  {step.name}
                                </p>
                                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5">
                                  <span>{step.durationMin} {lang === 'ar' ? 'دقائق' : 'mins duration'}</span>
                                  <span>•</span>
                                  <span>{lang === 'ar' ? 'المجموعات:' : 'Sets:'} {step.currentSets} {lang === 'ar' ? '(معدل)' : '(Modified)'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Interactive Sets Incrementation */}
                            <div className="flex items-center bg-black border border-white/5 rounded-lg overflow-hidden flex-shrink-0">
                              <button
                                onClick={() => adjustSets(activeStepIndex, -1)}
                                disabled={step.completed}
                                className="p-1.5 hover:bg-zinc-900 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                title="Decrease Sets"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-mono font-bold text-white min-w-5 text-center">
                                {step.currentSets}
                              </span>
                              <button
                                onClick={() => adjustSets(activeStepIndex, 1)}
                                disabled={step.completed}
                                className="p-1.5 hover:bg-zinc-900 text-gray-400 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                title="Increase Sets"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Navigation Buttons */}
                          <div className="flex items-center justify-between gap-3 pt-1">
                            <button
                              disabled={activeStepIndex === 0}
                              onClick={() => setActiveStepIndex(prev => prev - 1)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                            >
                              ← {lang === 'ar' ? 'السابق' : 'Prev'}
                            </button>

                            <button
                              disabled={activeStepIndex === currentSteps.length - 1}
                              onClick={() => setActiveStepIndex(prev => prev + 1)}
                              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-950 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer"
                            >
                              {lang === 'ar' ? 'التالي' : 'Next'} →
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Post-Workout Nutrition Recommendations (Triggered on complete check) */}
                  {completionRate === 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#FF4D00]/10 border border-[#FF4D00]/30 rounded-2xl p-4 space-y-3.5 relative overflow-hidden text-left rtl:text-right"
                    >
                      {/* Cinematic glowing accent background glow */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF4D00]/10 blur-xl pointer-events-none rounded-full" />
                      
                      <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-white uppercase tracking-widest font-extrabold block">
                          {lang === 'ar' ? 'عملية الأيض والاستشفاء بعد التمرين' : 'POST-WORKOUT RECOVERY METABOLISM'}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        {lang === 'ar' ? (
                          <>
                            عمل رائع في إكمال البروتوكول التدريبي! تم استهلاك مخازن الغلايكوجين والدهون الخلوية بمقدار <span className="text-[#FF4D00] font-bold">{liveTotalCalories} سعرة حرارية</span>. لتسريع عملية الاستشفاء وإعادة بناء الأنسجة، تناول المغذيات المستهدفة التالية:
                          </>
                        ) : (
                          <>
                            Excellent work completing the training protocol! Target glycogen stores and cellular lipids have been depleted by <span className="text-[#FF4D00] font-bold">{liveTotalCalories} kcal</span>. To accelerate recovery, optimize repair, and replenish energy substrates, consume the following targeted nutrients:
                          </>
                        )}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Carb Replenishment */}
                        <div className="bg-black/60 border border-white/5 p-3 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono text-[#FF4D00] uppercase font-bold tracking-wider block">
                            {lang === 'ar' ? 'استعادة الغلايكوجين' : 'GLYCOGEN RESTORATION'}
                          </span>
                          <div className="text-sm font-black text-white font-mono">
                            +{carbGramsBurned}g <span className="text-gray-400 font-sans text-xs font-normal">{lang === 'ar' ? 'كربوهيدرات صافية' : 'Pure Carbs'}</span>
                          </div>
                          <div className="space-y-1 text-[10px] text-gray-400 font-sans leading-tight">
                            <div className="flex justify-between border-b border-white/5 pb-1 rtl:flex-row-reverse">
                              <span>{lang === 'ar' ? 'أرز ياسمين:' : 'Jasmine Rice:'}</span>
                              <span className="text-white font-mono">{Math.round(carbGramsBurned / 0.28)}g {lang === 'ar' ? '(مطبوخ)' : '(cooked)'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1 rtl:flex-row-reverse">
                              <span>{lang === 'ar' ? 'بطاطا حلوة:' : 'Sweet Potato:'}</span>
                              <span className="text-white font-mono">{Math.round(carbGramsBurned / 0.20)}g {lang === 'ar' ? '(مخبوزة)' : '(baked)'}</span>
                            </div>
                            <div className="flex justify-between rtl:flex-row-reverse">
                              <span>{lang === 'ar' ? 'شوفان:' : 'Rolled Oats:'}</span>
                              <span className="text-white font-mono">{Math.round(carbGramsBurned / 0.66)}g {lang === 'ar' ? '(جاف)' : '(dry)'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Lipid Replenishment */}
                        <div className="bg-black/60 border border-white/5 p-3 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono text-amber-500 uppercase font-bold tracking-wider block">
                            {lang === 'ar' ? 'الاستشفاء الهرموني والليبيدات' : 'LIPID & HORMONAL RECOVERY'}
                          </span>
                          <div className="text-sm font-black text-white font-mono">
                            +{fatGramsBurned}g <span className="text-gray-400 font-sans text-xs font-normal">{lang === 'ar' ? 'دهون صحية' : 'Healthy Fats'}</span>
                          </div>
                          <div className="space-y-1 text-[10px] text-gray-400 font-sans leading-tight">
                            <div className="flex justify-between border-b border-white/5 pb-1 rtl:flex-row-reverse">
                              <span>{lang === 'ar' ? 'أفوكادو:' : 'Avocado:'}</span>
                              <span className="text-white font-mono">{Math.round(fatGramsBurned / 0.15)}g</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-1 rtl:flex-row-reverse">
                              <span>{lang === 'ar' ? 'لوز خام:' : 'Raw Almonds:'}</span>
                              <span className="text-white font-mono">{Math.round(fatGramsBurned / 0.50)}g (~{Math.round(fatGramsBurned / 0.50 / 1.2)} {lang === 'ar' ? 'حبة' : 'nuts'})</span>
                            </div>
                            <div className="flex justify-between rtl:flex-row-reverse">
                              <span>{lang === 'ar' ? 'زيت زيتون:' : 'Olive Oil:'}</span>
                              <span className="text-white font-mono">{Math.round(fatGramsBurned)}g {lang === 'ar' ? '(ملعقة طعام = 14جم)' : '(1 tbsp = 14g)'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Protein Recommendation */}
                      <div className="bg-zinc-950/60 border border-white/5 p-3 rounded-xl flex items-center justify-between text-xs rtl:flex-row-reverse">
                        <div className="space-y-0.5 text-left rtl:text-right">
                          <span className="text-[9px] font-mono text-gray-400 uppercase font-bold tracking-wider block">{lang === 'ar' ? 'الفجوة النيتروجينية للبناء العضلي' : 'ANABOLIC NITROGEN GAP'}</span>
                          <span className="text-white font-bold text-[11px]">{lang === 'ar' ? 'الجرعة: 30 جم - 35 جم واي بروتين معزول أو صدر دجاج' : 'Consumable: 30g - 35g Whey Isolate or Chicken Breast'}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/30 uppercase font-bold">
                          {lang === 'ar' ? 'البروتين جاهز' : 'PROTEIN READY'}
                        </span>
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Card footer segment */}
                <div className="pt-4 border-t border-white/5 mt-5 flex items-center justify-between text-left rtl:text-right rtl:flex-row-reverse">
                  <div className="flex items-center gap-2 rtl:flex-row-reverse">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-extrabold">{lang === 'ar' ? 'المحرك الديناميكي الحراري نشط' : 'THERMODYNAMIC ENGINE ACTIVE'}</span>
                  </div>
                  <span className="text-[9px] font-mono text-gray-600">v4.0</span>
                </div>

              </div>
            ) : (
              <div className="bg-black border border-white/5 rounded-3xl p-12 text-center text-zinc-500 space-y-3">
                <ShieldAlert className="w-8 h-8 text-zinc-700 mx-auto" />
                <p className="text-xs font-mono uppercase tracking-widest font-bold">{lang === 'ar' ? 'اختر واجهة التمرين' : 'Select Workout Interface'}</p>
                <p className="text-zinc-600 text-[11px]">{lang === 'ar' ? 'انقر على أي برنامج تدريبي لبدء حساب تحليلات التقدم.' : 'Click on any training program to compile progress analytics.'}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
