import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmissionCooldown } from '../hooks/useSubmissionCooldown';
import { useWords } from '../hooks/useWords';
import './WordInput.css'; // Import scoped CSS

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

      // Redirect to the DisplayWordCloud page
      navigate('/display');
    }
  };

  return (
    <div className="word-input-page"> {/* Scoped class for the whole page */}
      <div className="word-input-logo-placeholder">
        <div className="word-input-logo"></div>
      </div>

      {/* Add the new heading below the logo */}
      <h1 className="word-input-heading">What is the source of your joy?</h1>

      {!isSubmitted ? (
        <>
          <div className="word-input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text here"
              rows={4}
              required
              disabled={!canSubmit} // Disable input if cooldown is active
            />
          </div>

          <div className="word-input-button-container">
            <button onClick={handleSubmit} className="word-input-submit-btn" disabled={!canSubmit}>
              Submit
            </button>
          </div>

          {!canSubmit && timeLeft && (
            <p className="word-input-cooldown-msg">Please wait {(timeLeft / 60000).toFixed(1)} minutes before submitting again.</p>
          )}
        </>
      ) : (
        <div className="word-input-confirmation-container">
          <div className="word-input-confirmation-message">
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordInput;
