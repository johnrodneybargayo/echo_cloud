import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure of a Question
interface Question {
  id: string; // Unique identifier for the question
  text: string; // The text of the question
  type: 'wordCloud' | 'scaleMeter'; // Type of the question
}

// Define the structure of the QuestionsContext
interface QuestionsContextType {
  questions: Question[]; // Array of questions
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>; // Function to update questions
  clearQuestions: () => void; // Function to clear questions
}

// Create the QuestionsContext
const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

// Define props for the QuestionsProvider
interface QuestionsProviderProps {
  children: ReactNode; // Child components
}

// Create the QuestionsProvider component
export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]); // Initialize questions state

  // Function to clear all questions from the context
  const clearQuestions = () => {
    setQuestions([]);
  };

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions, clearQuestions }}>
      {children} {/* Render child components */}
    </QuestionsContext.Provider>
  );
};

// Custom hook to use the QuestionsContext
export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionsProvider'); // Error if used outside of provider
  }
  return context; // Return the context value
};
