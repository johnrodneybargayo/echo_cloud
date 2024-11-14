// src/types/WordCloudProps.ts
import { Question } from './question';

export interface WordCloudProps {
  words: { text: string; frequency: number }[];
  question: Question;
  onNext: () => void;
}
