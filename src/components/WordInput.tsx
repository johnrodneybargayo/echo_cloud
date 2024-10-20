// src/components/WordInput.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmissionCooldown } from '../hooks/useSubmissionCooldown';
import { useWords } from '../hooks/useWords';
import './WordInput.css';

const WordInput: React.FC = () => {
  const { submitWord } = useWords();
  const { canSubmit, timeLeft } = useSubmissionCooldown('lastSubmissionTime'); // Use cooldown logic
  const [inputText, setInputText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Handle word submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (canSubmit && inputText.trim()) {
      await submitWord(inputText);
      setMessage('Word submitted successfully!');
      setIsSubmitted(true);
      setInputText('');

      // Redirect to the happiness level page
      navigate('/happiness-scale');
    }
  };

  return (
    <div className="app-container">
      <div className="logo-placeholder">
        <div className="logo"></div>
      </div>

      {!isSubmitted ? (
        <>
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text here"
              rows={4}
              required
              disabled={!canSubmit} // Disable input if cooldown is active
            />
          </div>

          <div className="button-container">
            <button onClick={handleSubmit} className="submit-btn" disabled={!canSubmit}>
              Submit
            </button>
          </div>

          {!canSubmit && timeLeft && (
            <p>Please wait {(timeLeft / 60000).toFixed(1)} minutes before submitting again.</p>
          )}
        </>
      ) : (
        <div className="confirmation-container">
          <div className="confirmation-message">
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordInput;
