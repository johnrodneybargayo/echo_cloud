// src/components/WordInput.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { useWords } from '../hooks/useWords';
import './WordInput.css';

const WordInput: React.FC = () => {
  const { submitWord } = useWords();
  const [inputText, setInputText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [canSubmit, setCanSubmit] = useState(true);
  const SUBMIT_DELAY = 10 * 60 * 1000; // 10 minutes in milliseconds

  const navigate = useNavigate(); // Initialize the navigation hook

  // Check if the user has submitted a word within the last 10 minutes
  useEffect(() => {
    const lastSubmissionTime = localStorage.getItem('lastSubmissionTime');
    if (lastSubmissionTime) {
      const now = Date.now();
      const timeElapsed = now - parseInt(lastSubmissionTime, 10);
  
      if (timeElapsed < SUBMIT_DELAY) {
        setCanSubmit(false);
        const timeLeft = SUBMIT_DELAY - timeElapsed;
        setMessage(`You have submitted a word. Please wait ${(timeLeft / 60000).toFixed(1)} minutes before submitting again.`);
      }
    }
  }, [SUBMIT_DELAY]);

  // Handle word submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      return; // Prevent submission if within the cooldown period
    }

    if (inputText.trim()) {
      await submitWord(inputText); // Submit the word
      setMessage('Word submitted successfully!');
      setIsSubmitted(true);
      setInputText('');

      // Store the current time in localStorage to track submission time
      localStorage.setItem('lastSubmissionTime', Date.now().toString());
      setCanSubmit(false); // Disable further submissions

      // Set a timeout to allow submission again after 10 minutes
      setTimeout(() => {
        setCanSubmit(true);
        setIsSubmitted(false);
        setMessage('');
      }, SUBMIT_DELAY);
    }
  };

  // Handle input clearing
  const handleClear = () => {
    setInputText('');
  };

  // Handle exit or redirect to home page
  const handleExit = () => {
    navigate('/'); // Redirect to home page
  };

  return (
    <div className="app-container">
      <div className="logo-placeholder">
        <div className="logo"></div>
      </div>

      {canSubmit && !isSubmitted ? (
        <>
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text here"
              rows={4}
              required
            />
          </div>

          <div className="button-container">
            <button onClick={handleSubmit} className="submit-btn" disabled={!canSubmit}>
              Submit
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear
            </button>
          </div>
        </>
      ) : (
        <div className="confirmation-container">
          <div className="confirmation-message">
            <p>{message}</p>
          </div>
          {/* Exit button */}
          <button onClick={handleExit} className="exit-btn">
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default WordInput;
