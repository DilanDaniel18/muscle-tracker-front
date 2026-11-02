import type { FormEvent } from 'react';
import type { User, UserSex } from '../../types/user';

export type { User, UserSex };

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export const TOTAL_ONBOARDING_STEPS = 6;

export const BEGINNER_ACTIVITY_OPTION = 'No realizo ejercicios y quiero comenzar';

export interface ActivityOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'weightlifting',
    label: 'Levantamiento de pesas',
    description: 'Fuerza, hipertrofia, pesas libres y máquinas de gimnasio',
    icon: 'fitness_center',
  },
  {
    id: 'running',
    label: 'Running',
    description: 'Carrera al aire libre, atletismo, pista o caminadora',
    icon: 'directions_run',
  },
  {
    id: 'contact_sports',
    label: 'Deportes de contacto',
    description: 'Boxeo, MMA, artes marciales, kickboxing o lucha',
    icon: 'sports_mma',
  },
  {
    id: 'swimming',
    label: 'Natación',
    description: 'Entrenamiento acuático de resistencia y capacidad aeróbica',
    icon: 'pool',
  },
  {
    id: 'calisthenics',
    label: 'Calistenia',
    description: 'Dominadas, fondos y ejercicios con tu propio peso corporal',
    icon: 'sports_gymnastics',
  },
  {
    id: 'crossfit_functional',
    label: 'CrossFit / Funcional',
    description: 'Circuitos de alta intensidad, HIIT y acondicionamiento metabólico',
    icon: 'bolt',
  },
  {
    id: 'cycling',
    label: 'Ciclismo',
    description: 'Ciclismo de ruta, montaña o sesiones de spinning indoor',
    icon: 'directions_bike',
  },
  {
    id: 'yoga_pilates',
    label: 'Yoga / Pilates',
    description: 'Movilidad articular, flexibilidad, control postural y core',
    icon: 'self_improvement',
  },
  {
    id: 'team_sports',
    label: 'Deportes de equipo',
    description: 'Fútbol, básquetbol, voleibol o deportes colectivos',
    icon: 'sports_soccer',
  },
];

export interface FrequencyOption {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
  icon: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    id: '1_per_week',
    label: 'Una vez a la semana',
    subtitle: 'Ideal para dar el primer paso o mantenerte activo con poco tiempo',
    badge: '1 día / sem',
    icon: 'looks_one',
  },
  {
    id: '2_to_3_per_week',
    label: 'De dos a tres veces por semana',
    subtitle: 'Equilibrio saludable entre sesiones efectivas y recuperación óptima',
    badge: '2 - 3 días / sem',
    icon: 'event_repeat',
  },
  {
    id: '4_to_5_per_week',
    label: 'De 4 a 5 veces por semana',
    subtitle: 'Ritmo sólido para ganar fuerza, masa muscular y resistencia constante',
    badge: '4 - 5 días / sem',
    icon: 'local_fire_department',
  },
  {
    id: '6_to_7_per_week',
    label: 'De 6 a 7 veces por semana',
    subtitle: 'Entrenamiento intensivo para atletas y disciplina de alto rendimiento',
    badge: '6 - 7 días / sem',
    icon: 'workspace_premium',
  },
];

export interface OnboardingFormValues {
  birthDate: string;
  height: string;
  weight: string;
  sex: UserSex | '';
  activityTypes: string[];
  isBeginner: boolean;
  exerciseFrequency: string;
}

export interface OnboardingFormErrors {
  birthDate?: string;
  height?: string;
  weight?: string;
  sex?: string;
  activityTypes?: string;
  exerciseFrequency?: string;
  general?: string;
}

export interface OnboardingProfile {
  id: string;
  userId: string;
  birthDate: string;
  height: number;
  weight: number;
  sex: UserSex;
  activityTypes: string[];
  isBeginner: boolean;
  exerciseFrequency: string;
  onboardingCompleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveOnboardingPayload {
  userId: string;
  birthDate: string;
  height: number;
  weight: number;
  sex: UserSex;
  activityTypes: string[];
  isBeginner: boolean;
  exerciseFrequency: string;
}

export interface SaveOnboardingResult {
  profile: OnboardingProfile;
  user: User;
}

export interface OnboardingScreenProps {
  step: OnboardingStep;
  user: User | null;
  values: OnboardingFormValues;
  errors: OnboardingFormErrors;
  isSubmitting: boolean;
  onNextStep: () => void;
  onPrevStep: () => void;
  onGoToStep: (step: OnboardingStep) => void;
  onPhysicalFieldChange: (
    field: 'birthDate' | 'height' | 'weight' | 'sex',
    value: string
  ) => void;
  onPhysicalFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onToggleActivity: (activityLabel: string) => void;
  onSelectBeginner: () => void;
  onSelectFrequency: (frequencyLabel: string) => void;
  onFinalSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onDismissError: () => void;
}
