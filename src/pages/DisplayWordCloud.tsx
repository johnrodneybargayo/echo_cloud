import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import WordCloudComponent from '../components/WordCloud';
import { useWords } from '../hooks/useWords';
import { useQuestions } from '../context/QuestionsContext';
import Loader from '../components/loader/Loader';
import { Question } from '../types/question';


const DisplayWordCloud: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { words, loading } = useWords(questionId || '');
  const { questions } = useQuestions();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    const index = questions.findIndex((q) => q.id === questionId);
    return index !== -1 ? index : 0;
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <WordCloudComponent
      words={words}
      questions={questions as Question[]}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
    />
  );
};

export default DisplayWordCloud;
