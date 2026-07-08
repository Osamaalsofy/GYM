import { Trainer, PricingPlan, WorkoutProgram } from './types';

export const trainers: Trainer[] = [
  {
    id: 't1',
    name: "Viktor 'The Anvil' Kovac",
    role: "Lead Combat Director",
    image: "images/coach/Coach.jpg",
    specialty: "Men's Boxing & Striking Protocols",
    bio: "Former cruiserweight champion with 15+ years of professional ring experience. Viktor specializes in heavy power delivery, dynamic head movement, and elite tactical sparring for men.",
    stats: [
      { label: "Matches Won", value: "34-2-0" },
      { label: "Punch Velocity", value: "42 km/h" }
    ]
  },
  {
    id: 't2',
    name: "Aria Thorne",
    role: "Vanguard Striking Specialist",
    image: "images/coach/Women.jpg",
    specialty: "Women's Kickboxing & Speed Conditioning",
    bio: "Certified Muay Thai kru and speed conditioning coach. Aria designs custom high-velocity kickboxing circuits tailored for female athletes to build explosive hip power and absolute cardiac output.",
    stats: [
      { label: "Fight Record", value: "18-1-0" },
      { label: "Calorie Burn Avg", value: "850/hr" }
    ]
  },
  {
    id: 't3',
    name: "Marcus Vance",
    role: "Lead Strength Architect",
    image: "images/coach/Cpm.jpg",
    specialty: "Personal Training & Body Recomposition",
    bio: "World-class strength and conditioning specialist. Marcus develops individualized muscle hypertrophy blueprints, posture alignment, and science-backed compound progression coaching for all lifters.",
    stats: [
      { label: "Clients Coached", value: "500+" },
      { label: "Max Deadlift", value: "310 KG" }
    ]
  },
  {
    id: 't4',
    name: "Elena Rostova",
    role: "Kinetic Mobility Coach",
    image: "images/coach/gymnastics.jpg",
    specialty: "Gymnastics, Handstands & Core Control",
    bio: "Former master-of-sport artistic gymnast. Elena coaches advanced calisthenics, core stabilization, and extreme overhead shoulder mobility to unlock absolute control of your bodyweight.",
    stats: [
      { label: "Flexibility Gain", value: "+35%" },
      { label: "Years Coaching", value: "11 YRS" }
    ]
  }
];

export const workoutPrograms: WorkoutProgram[] = [
  {
    id: 'p1',
    title: 'Apocalypse Strength',
    duration: '8 Weeks',
    level: 'Elite',
    calories: 780,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    description: 'A relentless power protocol focusing on the big three lifts, combined with explosive cluster sets.',
    muscles: ['Chest', 'Shoulders', 'Triceps', 'Legs']
  },
  {
    id: 'p2',
    title: 'Kinetic Flow 2.0',
    duration: '6 Weeks',
    level: 'Intermediate',
    calories: 620,
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800',
    description: 'High-velocity functional athletic patterns designed to shred fat while preserving explosive muscle fiber.',
    muscles: ['Core', 'Glutes', 'Hamstrings', 'Back']
  },
  {
    id: 'p3',
    title: 'Iron Foundation',
    duration: '10 Weeks',
    level: 'Beginner',
    calories: 540,
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&q=80&w=800',
    description: 'Perfecting mechanical execution of multi-joint compounds. Build an armor of dense, injury-free muscle.',
    muscles: ['Quads', 'Back', 'Biceps', 'Abs']
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'plan_base',
    name: 'Iron Access',
    price: '$49',
    period: 'mo',
    description: 'Uncompromising access to premium facilities and elite open lifting platform.',
    features: [
      '24/7 Access to raw lifting floors',
      'Advanced biometric lockers & showers',
      'Initial 1-on-1 kinetic assessment',
      'Complimentary protein shake daily',
      'Access to baseline recovery zone'
    ],
    isPopular: false,
    colorClass: 'border-zinc-800 bg-zinc-950/40 text-zinc-100'
  },
  {
    id: 'plan_elite',
    name: 'Aether Collective',
    price: '$99',
    period: 'mo',
    description: 'Our most sought-after tier. Direct coach feedback, premium classes, and recovery labs.',
    features: [
      'All Iron Access privileges included',
      'Unlimited specialized combat & mobility classes',
      'Weekly personalized nutrition planning',
      'Cryotherapy & infrared sauna access (4x/mo)',
      'Aether App custom workout engine tracker'
    ],
    isPopular: true,
    colorClass: 'border-orange-500/50 bg-gradient-to-b from-orange-950/20 to-zinc-950/90 text-zinc-100 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
  },
  {
    id: 'plan_alpha',
    name: 'Obsidian Tier',
    price: '$249',
    period: 'mo',
    description: 'The ultimate fitness mentorship. Complete athletic optimization and private training.',
    features: [
      'All Collective and Iron privileges',
      '2 private 1-on-1 coached sessions per week',
      'Daily hyper-personalized biometric reviews',
      'Unlimited cryotherapy, sauna, & compression labs',
      'Obsidian-only lounge & private workspace'
    ],
    isPopular: false,
    colorClass: 'border-zinc-800 bg-zinc-950/40 text-zinc-100'
  }
];
