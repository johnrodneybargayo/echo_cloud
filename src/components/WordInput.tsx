import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSubmissionCooldown } from '../hooks/useSubmissionCooldown';
import { useWords } from '../hooks/useWords';
import './WordInput.css';

interface Question {
  id: string;
  text: string;
  type: 'wordCloud' | 'scaleMeter';
}

const WordInput: React.FC = () => {
  const location = useLocation();
  const { questionId } = useParams<{ questionId: string }>();
  const questions: Question[] = location.state?.questions || [];
  const { submitWord } = useWords(questionId || ''); // Pass questionId here
  const { canSubmit, timeLeft } = useSubmissionCooldown('lastSubmissionTime');
  const [inputText, setInputText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentQuestionIndex = location.state?.currentQuestionIndex || 0;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && inputText.trim()) {
      await submitWord(inputText);
      setIsSubmitted(true);
      setInputText('');

      setTimeout(() => {
        setIsSubmitted(false);
        navigate(`/display/${questionId}`, {
          state: {
            questions,
            currentQuestionIndex,
          },
        });
      }, 1500);
    }
  };

  return (
    <div className="word-input-page">
      <h1 className="word-input-heading">{questions[currentQuestionIndex]?.text}</h1>

      {!isSubmitted ? (
        <>
          <div className="word-input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your response here"
              rows={4}
              required
              disabled={!canSubmit}
            />
          </div>

          <div className="word-input-button-container">
            <button
              onClick={handleSubmit}
              className="word-input-submit-btn"
              disabled={!canSubmit || !inputText.trim()}
            >
              Submit
            </button>
          </div>

          {!canSubmit && timeLeft && (
            <p className="word-input-cooldown-msg">
              Please wait {(timeLeft / 60000).toFixed(1)} minutes before submitting again.
            </p>
          )}
        </>
      ) : (
        <div className="word-input-confirmation-container">
          <p>Word submitted successfully!</p>
        </div>
      )}
    </div>
  );
};

export default WordInput;
