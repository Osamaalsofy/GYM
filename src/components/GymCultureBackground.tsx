import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, Flame, Heart, Sparkles, Trophy, Zap, 
  Activity, Award, RefreshCw, X, Play, ShieldAlert,
  ChevronRight, Compass, LineChart, Timer
} from 'lucide-react';

interface GymDustParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface FloatingIronPlate {
  id: number;
  x: number;
  y: number;
  weight: number; // 45, 25, 10
  scale: number;
  angle: number;
  rotSpeed: number;
  opacity: number;
}

type GymCultureTheme = 'pump' | 'power' | 'zen';

export default function GymCultureBackground() {
  const [theme, setTheme] = useState<GymCultureTheme>('pump');
  const [bpm, setBpm] = useState(132);
  const [repCount, setRepCount] = useState(0);
  const [totalLiftedWeight, setTotalLiftedWeight] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(() => {
    try {
      return Number(localStorage.getItem('gym_streak') || '8');
    } catch {
      return 8;
    }
  });
  const [isConsoleCollapsed, setIsConsoleCollapsed] = useState(true);
  const [recentPrUnlocked, setRecentPrUnlocked] = useState(false);
  const [prQuote, setPrQuote] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const dustParticles = useRef<GymDustParticle[]>([]);
  const plates = useRef<FloatingIronPlate[]>([]);

  // Local Storage for streak
  useEffect(() => {
    try {
      localStorage.setItem('gym_streak', dailyStreak.toString());
    } catch {}
  }, [dailyStreak]);

  // Simulate dynamic BPM pulse
  useEffect(() => {
    const bpmInterval = setInterval(() => {
      setBpm(prev => {
        const base = theme === 'pump' ? 135 : theme === 'power' ? 152 : 72;
        const variation = Math.floor((Math.random() - 0.5) * 8);
        return Math.max(50, Math.min(200, base + variation));
      });
    }, 2000);
    return () => clearInterval(bpmInterval);
  }, [theme]);

  // Handle Mouse Move for interactive chalk dust push
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize background elements
  useEffect(() => {
    // Generate floating structural Iron Plates (subtle silhouettes in background)
    plates.current = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      weight: [45, 35, 25, 10][i % 4],
      scale: 0.4 + Math.random() * 0.4,
      angle: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
      opacity: 0.02 + Math.random() * 0.03
    }));

    // Seed dust particles (chalk dust, sweat vapor, workout glow)
    dustParticles.current = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.5, // Float upwards
      size: 1 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.3,
      life: Math.random() * 200,
      maxLife: 200 + Math.random() * 100
    }));
  }, []);

  // Animation Loop: Render Chalk Particles, Plates, Grid & Waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = (timestamp - lastTimeRef.current) / 16;
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Theme Backdrop Vignette & Glow
      drawBackdrop(ctx, canvas.width, canvas.height);

      // 2. Draw Subtle Gym Motivational Watermark Words
      drawWatermarks(ctx, canvas.width, canvas.height);

      // 3. Draw Floating Steel Plates
      drawIronPlates(ctx, dt);

      // 4. Draw Chalk Dust Particles
      updateAndDrawDust(ctx, canvas.width, canvas.height, dt);

      // 5. Draw Dynamic Heart-Rate BPM Pulse Waveform (ECG) at the bottom
      drawECGWave(ctx, canvas.width, canvas.height, timestamp);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme, bpm]);

  // Draw backdrop vignette glow based on selected Gym Zone Theme
  const drawBackdrop = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    // Subtle parallax shift
    const px = (mousePos.current.x - w / 2) * 0.02;
    const py = (mousePos.current.y - h / 2) * 0.02;

    const grad = ctx.createRadialGradient(
      w / 2 + px, h / 2 + py, 100,
      w / 2 + px, h / 2 + py, Math.max(w, h) * 0.7
    );

    if (theme === 'pump') {
      // Pump Theme: Raw iron dark gray + rich blood orange highlights
      grad.addColorStop(0, 'rgba(255, 77, 0, 0.04)');
      grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.015)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
    } else if (theme === 'power') {
      // Power Theme: Industrial heavy steel + warning gold sparkles
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.05)');
      grad.addColorStop(0.6, 'rgba(120, 113, 108, 0.01)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
    } else {
      // Zen Focus Theme: Deep recovery mind-muscle blue-gray
      grad.addColorStop(0, 'rgba(14, 165, 233, 0.04)');
      grad.addColorStop(0.5, 'rgba(99, 102, 241, 0.01)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(w / 2 + px, h / 2 + py, Math.max(w, h), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Draw giant watermark words representing gym culture (GRIT, IRON, POWER)
  const drawWatermarks = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.font = '900 13vw "Space Grotesk", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const words = theme === 'pump' ? ['HYPERTROPHY', 'PUMP', 'REPS'] : theme === 'power' ? ['IRON', 'GRIT', 'HEAVY'] : ['MIND-MUSCLE', 'FOCUS', 'RECOVERY'];
    
    // Line 1
    ctx.fillStyle = 'rgba(255, 255, 255, 0.007)';
    ctx.fillText(words[0], w / 2, h * 0.25);

    // Line 2
    ctx.fillStyle = 'rgba(255, 255, 255, 0.005)';
    ctx.fillText(words[1], w / 2, h * 0.55);

    // Line 3
    ctx.fillStyle = 'rgba(255, 255, 255, 0.006)';
    ctx.fillText(words[2], w / 2, h * 0.85);

    ctx.restore();
  };

  // Draw floating weight plate outlines in the background
  const drawIronPlates = (ctx: CanvasRenderingContext2D, dt: number) => {
    ctx.save();
    
    plates.current.forEach(plate => {
      // Update rotation
      plate.angle += plate.rotSpeed * dt;

      const px = plate.x * 0.01 * ctx.canvas.width;
      const py = plate.y * 0.01 * ctx.canvas.height;
      const radius = 50 * plate.scale;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(plate.angle);

      // Draw standard gym weight plate circle outlines
      ctx.strokeStyle = `rgba(255, 255, 255, ${plate.opacity})`;
      ctx.lineWidth = 1.5;

      // Outer rim
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner structure groove
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Center sleeve ring
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${plate.opacity * 0.3})`;
      ctx.fill();
      ctx.stroke();

      // Text print e.g. "45 LBS" or "20 KGS"
      ctx.fillStyle = `rgba(255, 255, 255, ${plate.opacity * 1.5})`;
      ctx.font = '900 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${plate.weight}`, 0, -radius * 0.45);
      ctx.fillText(`LBS`, 0, radius * 0.45);

      ctx.restore();
    });

    ctx.restore();
  };

  // Update & Draw floating chalk dust / energy spark particles
  const updateAndDrawDust = (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number) => {
    ctx.save();

    // Color of particles based on theme
    const pColor = theme === 'pump' ? '255, 77, 0' : theme === 'power' ? '245, 158, 11' : '14, 165, 233';

    // Update and draw existing particles
    dustParticles.current.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life += dt;

      // Add a tiny bit of horizontal sine wave wiggle
      p.x += Math.sin(p.life * 0.03) * 0.1;

      // Mouse interactive push away
      const dx = p.x - mousePos.current.x;
      const dy = p.y - mousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const pushX = (dx / dist) * (120 - dist) * 0.05;
        const pushY = (dy / dist) * (120 - dist) * 0.05;
        p.x += pushX;
        p.y += pushY;
      }

      // Check boundaries
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) {
        p.y = h;
        p.life = 0;
      }

      const fade = 1 - (p.life / p.maxLife);
      ctx.fillStyle = `rgba(${pColor}, ${p.opacity * Math.max(0, fade)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  };

  // Draw dynamic bottom electrocardiogram heart rate pulse
  const drawECGWave = (ctx: CanvasRenderingContext2D, w: number, h: number, timestamp: number) => {
    ctx.save();
    const waveY = h - 60;
    
    // Wave styling
    const glowColor = theme === 'pump' ? '#FF4D00' : theme === 'power' ? '#F59E0B' : '#0EA5E9';
    ctx.strokeStyle = `${glowColor}30`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = glowColor;

    ctx.beginPath();

    const segments = 100;
    const segmentWidth = w / segments;
    const speed = (bpm / 60) * 0.003; // Speed linked to current simulated BPM
    const timeFactor = timestamp * speed;

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      
      // Calculate a repeating heartbeat spike pattern
      const wavePhase = (i - timeFactor * 40) % 50;
      let yOffset = 0;

      if (wavePhase > 12 && wavePhase < 22) {
        // Standard ECG wave pattern: P, Q, R, S, T complex
        const localT = (wavePhase - 12) / 10; // 0 to 1
        if (localT < 0.15) {
          yOffset = Math.sin(localT * Math.PI / 0.15) * -8; // P wave (subtle prepulse)
        } else if (localT < 0.3) {
          yOffset = 0; // PR segment
        } else if (localT < 0.38) {
          yOffset = 3; // Q spike (downwards)
        } else if (localT < 0.52) {
          yOffset = -55; // R spike (massive high contraction contraction)
        } else if (localT < 0.64) {
          yOffset = 18; // S spike (deep drop)
        } else if (localT < 0.85) {
          yOffset = Math.sin((localT - 0.64) * Math.PI / 0.21) * -12; // T wave (repolarization)
        }
      }

      const y = waveY + yOffset;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
    ctx.restore();
  };

  // Log simulated workout reps (increases streak, totals lifted, triggers PR)
  const handleLogRep = () => {
    setRepCount(prev => {
      const nextReps = prev + 1;
      const addedWeight = theme === 'power' ? 225 : theme === 'pump' ? 135 : 45;
      setTotalLiftedWeight(w => w + addedWeight);

      // Trigger unique PR celebrations on every 5 reps
      if (nextReps % 5 === 0) {
        const quotes = [
          "LIGHTWEIGHT BABY! 💪",
          "MIND-MUSCLE CONNECTION ESTABLISHED! ⚡",
          "PROGRESSIVE OVERLOAD SECURED! 🏆",
          "IRON TEMPLE CHAMPION! 🌟",
          "BREAKING PERSONAL RECORDS!"
        ];
        setPrQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setRecentPrUnlocked(true);
        setTimeout(() => setRecentPrUnlocked(false), 2500);
      }

      return nextReps;
    });
  };

  return (
    <>
      {/* Background Interactive canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover opacity-80" 
        />
      </div>

      {/* Screen PR flash celebration overlay */}
      <AnimatePresence>
        {recentPrUnlocked && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-none"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="text-center space-y-3"
            >
              <div className="inline-flex p-4 bg-[#FF4D00]/10 border border-[#FF4D00]/30 rounded-full text-[#FF4D00] animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                NEW WORKOUT PR!
              </h2>
              <p className="text-xl font-mono text-amber-500 font-extrabold uppercase animate-pulse">
                {prQuote}
              </p>
              <div className="text-zinc-500 font-mono text-xs">
                Total weight moved this session: {totalLiftedWeight} LBS
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMMERSIVE GYM CULTURE CONSOLE / PERFORMANCE HUD */}
      <div className="fixed bottom-6 right-6 z-40 font-mono">
        <AnimatePresence>
          {!isConsoleCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="w-80 bg-black/95 border border-white/10 rounded-2xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-md relative overflow-hidden"
            >
              {/* Neon border strip linked to state color theme */}
              <div 
                className="absolute top-0 left-0 right-0 h-[2.5px] transition-all duration-300"
                style={{
                  backgroundColor: theme === 'pump' ? '#FF4D00' : theme === 'power' ? '#F59E0B' : '#0EA5E9'
                }}
              />

              {/* Close Panel button */}
              <button 
                onClick={() => setIsConsoleCollapsed(true)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
                title="Minimize Gym Console"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Console Header */}
              <div className="space-y-1 text-left pb-3 border-b border-white/5">
                <div className="flex items-center gap-1.5 text-[#FF4D00]">
                  <Activity className="w-4 h-4 animate-pulse text-[#FF4D00]" />
                  <span className="text-[10px] font-black tracking-widest uppercase">GYM PERFORMANCE HUB</span>
                </div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase">
                  ACTIVE CULTURE CONSOLE
                </h4>
              </div>

              {/* Interactive Heart Rate & Culture telemetry stats */}
              <div className="py-4 grid grid-cols-2 gap-3">
                <div className="bg-zinc-950 border border-white/5 p-2.5 rounded-xl text-left">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">HEART RATE</span>
                  <span className="text-lg font-black text-white flex items-baseline gap-1 font-mono">
                    <span className="text-red-500 animate-pulse">❤️</span> {bpm} <span className="text-[10px] text-zinc-500 font-bold">BPM</span>
                  </span>
                </div>
                
                <div className="bg-zinc-950 border border-white/5 p-2.5 rounded-xl text-left">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">STREAK TRACKER</span>
                  <span className="text-lg font-black text-white flex items-baseline gap-1 font-mono">
                    🔥 {dailyStreak} <span className="text-[10px] text-zinc-500 font-bold">DAYS</span>
                  </span>
                </div>
              </div>

              {/* Rep Tracker & Progressive simulator */}
              <div className="bg-zinc-950 border border-white/5 p-3 rounded-xl space-y-2 text-left mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-black">LOG WORKOUT SET</span>
                  <span className="text-[9px] font-mono text-zinc-400 font-black">Total: {totalLiftedWeight} LBS</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-xl font-black text-white">{repCount} <span className="text-xs text-zinc-400 font-mono uppercase">REPS</span></div>
                    <div className="text-[9px] text-zinc-500">Every 5 Reps triggers a New PR!</div>
                  </div>
                  
                  <button
                    onClick={handleLogRep}
                    className="px-4 py-2 bg-[#FF4D00] hover:bg-orange-600 active:scale-95 text-black font-black text-[10px] font-mono rounded-lg transition-all flex items-center gap-1 uppercase"
                  >
                    <Dumbbell className="w-3.5 h-3.5" />
                    +1 REP
                  </button>
                </div>
              </div>

              {/* Gym Atmosphere Theme Selection */}
              <div className="pt-3 border-t border-white/5 space-y-2 text-left">
                <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-bold">GYM FOCUS MODE</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setTheme('pump')}
                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider border transition-all ${
                      theme === 'pump'
                        ? 'bg-[#FF4D00] text-black border-[#FF4D00]'
                        : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-white/5'
                    }`}
                  >
                    🔥 PUMP
                  </button>
                  <button
                    onClick={() => setTheme('power')}
                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider border transition-all ${
                      theme === 'power'
                        ? 'bg-amber-500 text-black border-amber-500'
                        : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-white/5'
                    }`}
                  >
                    ⚡ POWER
                  </button>
                  <button
                    onClick={() => setTheme('zen')}
                    className={`flex-1 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider border transition-all ${
                      theme === 'zen'
                        ? 'bg-[#0EA5E9] text-black border-[#0EA5E9]'
                        : 'bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border-white/5'
                    }`}
                  >
                    🧘 ZEN
                  </button>
                </div>
              </div>

              {/* Dynamic workout philosophy quote helper */}
              <p className="text-[8px] text-zinc-500 text-center mt-3 leading-tight">
                🏆 Gym Culture Console simulates real-time BPM telemetry, training volume trackers and PR streaks directly in your page background.
              </p>

            </motion.div>
          ) : (
            /* Mini launch trigger button when console is collapsed */
            <motion.button
              layoutId="console_expand_trigger"
              onClick={() => setIsConsoleCollapsed(false)}
              className="px-4 py-2.5 bg-black/95 hover:bg-black border border-white/10 text-[#FF4D00] hover:text-white rounded-xl shadow-2xl flex items-center gap-2 hover:-translate-y-0.5 transition-all backdrop-blur-md"
            >
              <Dumbbell className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span className="text-[10px] font-black uppercase tracking-widest">SHOW GYM CONSOLE</span>
              <span className="px-1.5 py-0.5 bg-[#FF4D00]/10 text-[#FF4D00] text-[8px] rounded font-extrabold">{repCount} REPS</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
