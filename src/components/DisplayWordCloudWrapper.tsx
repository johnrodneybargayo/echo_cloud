import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';
import { Question } from '../types/question';

const DisplayWordCloudWrapper: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const location = useLocation();
  const { words, loading } = useWords(questionId || ''); // Pass questionId here
  const questions: Question[] = location.state?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    questions.findIndex(q => q.id === questionId) || 0
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

export default DisplayWordCloudWrapper;
