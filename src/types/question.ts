export interface Question {
  linkedHappinessScale: boolean;
  id: string;
  text: string;
  type: 'wordCloud' | 'happinessInput' | 'happinessBarChart'; // Fixed: consistent types
  linkedTo?: string;
  createdAt: number;
}
