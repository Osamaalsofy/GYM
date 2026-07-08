export interface Trainer {
  id: string;
  name: string;
  role: string;
  image: string;
  specialty: string;
  bio: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  colorClass: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Elite';
  calories: number;
  image: string;
  description: string;
  muscles: string[];
}
