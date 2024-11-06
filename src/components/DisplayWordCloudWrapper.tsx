import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';
import { Question } from '../types/question';
import Loader from '../components/loader/Loader'; // Import the Loader component

const DisplayWordCloudWrapper: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const location = useLocation();
  const { words, loading } = useWords(questionId || ''); // Pass questionId here
  const questions: Question[] = location.state?.questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    questions.findIndex(q => q.id === questionId) || 0
  );

  // Remove loading state from this component
  return (
    <>
      {loading ? (
        <Loader /> // Display loader while loading
      ) : (
        <WordCloudComponent
          words={words}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />
      )}
    </>
  );
};

export default DisplayWordCloudWrapper;
