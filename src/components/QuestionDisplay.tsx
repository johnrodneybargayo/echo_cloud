import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../context/QuestionsContext';
import WordCloudComponent from './WordCloud';
import ScaleMeter from './ScaleMeter';

const QuestionDisplay: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const { questions } = useQuestions();
  const navigate = useNavigate();
  const currentQuestion = questions.find((q) => q.id === questionId);

  useEffect(() => {
    if (!currentQuestion) {
      navigate('/thank-you');
    }
  }, [currentQuestion, navigate]);

  const handleNext = () => {
    const currentIndex = questions.findIndex((q) => q.id === questionId);
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      navigate(`/display/${nextQuestion.id}`);
    } else {
      navigate('/thank-you');
    }
  };

  if (!currentQuestion) return <p>Loading...</p>;

  return (
    <div className="question-display">
      <h2>{currentQuestion.text}</h2>
      {currentQuestion.type === 'wordCloud' ? (
        <WordCloudComponent words={[]} questions={questions} currentQuestionIndex={0} setCurrentQuestionIndex={() => {}} />
      ) : (
        <ScaleMeter />
      )}
      <button onClick={handleNext}>Next</button>
    </div>
  );
};

export default QuestionDisplay;
