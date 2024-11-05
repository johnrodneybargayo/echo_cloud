// src/types/question.ts
export interface Question {
    id: string; // Change from 'number' to 'string'
    text: string;
    type: 'wordCloud' | 'scaleMeter';
  }
  