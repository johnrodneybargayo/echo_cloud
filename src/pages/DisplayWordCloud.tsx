import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';
import { useQuestions } from '../context/QuestionsContext';

const DisplayWordCloud: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>(); // Get questionId from URL parameters
  const { words, loading } = useWords(questionId || ''); // Pass questionId here
  const { questions } = useQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    questions.findIndex((q) => q.id === questionId) || 0
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <WordCloudComponent
      words={words}
      questions={questions}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
    />
  );
};

export default DisplayWordCloud;
