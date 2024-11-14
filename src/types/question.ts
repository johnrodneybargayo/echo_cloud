// src/types/question.ts

export interface Question {
  id: string; // Unique identifier for the question
  text: string; // The text of the question
  type: 'wordCloud' | 'happinessInput'; // Question type
  linkedHappinessScale?: string; // Optional field for linked HappinessScale question ID
}
