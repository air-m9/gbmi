export enum UnitSystem {
  METRIC = 'metric',
  IMPERIAL = 'imperial',
}

export enum BMICategory {
  UNDERWEIGHT = 'Underweight',
  NORMAL = 'Normal Weight',
  OVERWEIGHT = 'Overweight',
  OBESE = 'Obese',
}

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  color: string;
}

export interface HealthAdvice {
  tips: string[];
  summary: string;
}

export interface UserInput {
  heightCm: string;
  weightKg: string;
  heightFt: string;
  heightIn: string;
  weightLbs: string;
}
