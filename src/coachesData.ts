import { Trainer } from './types';

/**
 * =========================================================================
 * ELITE COACHES DATABASE CONFIGURATION
 * =========================================================================
 * You can easily customize any trainer here. To edit or replace:
 * 1. Name: Change the 'name' field string.
 * 2. Role: Change the 'role' field string.
 * 3. Image: Place your image in the `public/images/coach/` directory
 *    and update the 'image' path (e.g., "images/coach/my_new_coach.jpg").
 * 4. Specialty: Change the 'specialty' field string.
 * 5. Bio: Change the 'bio' field string.
 * 6. Stats: Update the label/value array to show custom trainer performance metrics.
 * 7. Proficiency Details: Set target audience, specialized disciplines, 
 *    coaching metrics (0-100), core philosophies, and hours of availability.
 */

export interface CoachProficiency {
  targetAudience: string;
  focusDiscipline: string;
  focusParameters: { label: string; value: number }[];
  philosophies: string[];
  schedule: string;
}

export interface CoachConfig extends Trainer {
  proficiency: CoachProficiency;
}

export const coachesData: CoachConfig[] = [
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
    ],
    proficiency: {
      targetAudience: "Men's Heavy Combat Sparring & Striking",
      focusDiscipline: "Boxing & Heavy-Impact Power Delivery",
      focusParameters: [
        { label: "Striking Velocity", value: 96 },
        { label: "Footwork & Pivot Rate", value: 88 },
        { label: "Cardiorespiratory Recovery", value: 92 },
        { label: "Defensive Head Velocity", value: 90 }
      ],
      philosophies: [
        "Precision beats power, timing beats speed.",
        "Footwork is the foundation of every kinetic strike.",
        "Heavy defensive guards combined with explosive counters."
      ],
      schedule: "Mon / Wed / Fri: 08:00 - 12:00"
    }
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
    ],
    proficiency: {
      targetAudience: "Women's Speed Kickboxing & Cardio Circuits",
      focusDiscipline: "Muay Thai & Aerobic Endurance conditioning",
      focusParameters: [
        { label: "Hip Extension Rotation", value: 95 },
        { label: "Striking Speed (Cadence)", value: 98 },
        { label: "Endurance & Heart Rate Stability", value: 94 },
        { label: "Counter-Response Index", value: 89 }
      ],
      philosophies: [
        "Flow like water, strike like lightning.",
        "Incorporate absolute core rotation on every roundhouse kick.",
        "HIIT kickboxing circuits designed to optimize hormonal performance."
      ],
      schedule: "Tue / Thu / Sat: 09:00 - 13:00"
    }
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
    ],
    proficiency: {
      targetAudience: "All Lifters / Body Recomposition & Hypertrophy",
      focusDiscipline: "Strength, Powerlifting & Biomechanics",
      focusParameters: [
        { label: "Barbell Kinetic Track", value: 93 },
        { label: "Hypertrophy Mechanical Load", value: 97 },
        { label: "Posture Stabilization", value: 90 },
        { label: "Injury Mitigation", value: 95 }
      ],
      philosophies: [
        "Leave your ego at the door, focus on the barbell alignment.",
        "Mechanical tension is the primary driver of muscular hypertrophy.",
        "Consistency in kinetic form prevents central nervous fatigue."
      ],
      schedule: "Mon through Sat: 06:00 - 18:00"
    }
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
    ],
    proficiency: {
      targetAudience: "Bodyweight Athletes & Calisthenics",
      focusDiscipline: "Gymnastics, Flexibilty & Core Stabilization",
      focusParameters: [
        { label: "Overhead Shoulder Range", value: 98 },
        { label: "Core Bracing Brackets", value: 96 },
        { label: "Static Hold Equilibrium", value: 94 },
        { label: "Dynamic Aerial Transition", value: 92 }
      ],
      philosophies: [
        "True strength is the master of your own center of mass.",
        "Mobility is strength in extended range.",
        "Every posture begins with the hollow body alignment."
      ],
      schedule: "Tue / Thu / Fri: 14:00 - 19:00"
    }
  }
];
