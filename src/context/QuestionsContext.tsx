import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Question {
  id: string; // Change 'id' to string to match Firebase requirements
  text: string;
  type: 'wordCloud' | 'scaleMeter';
}

interface QuestionsContextType {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  clearQuestions: () => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

interface QuestionsProviderProps {
  children: ReactNode; // Ensure the children prop is typed correctly
}

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);

  const clearQuestions = () => {
    setQuestions([]); // Clear all questions from the context
  };

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions, clearQuestions }}>
      {children} {/* Render children here */}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};
