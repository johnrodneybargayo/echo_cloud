import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push } from 'firebase/database'; // Firebase database functions
import { useSubmissionCooldown } from '../hooks/useSubmissionCooldown';
import './HappinessInput.css';

const HappinessInput: React.FC = () => {
  const { canSubmit, timeLeft, recordSubmissionTime } = useSubmissionCooldown('lastSubmissionTime');
  const [happinessLevel, setHappinessLevel] = useState<string>(''); // Keeping it as string for validation
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const db = getDatabase(); // Initialize Firebase Realtime Database

  // Handle form submission and store happiness level in Firebase
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericLevel = Number(happinessLevel);

    // Ensure the value is a valid number between 1 and 10
    if (happinessLevel.trim() && numericLevel >= 1 && numericLevel <= 10) {
      // Submit the happiness level to Firebase
      const happinessRef = ref(db, 'happinessLevels');
      push(happinessRef, {
        level: numericLevel, // Ensure level is stored properly in Firebase
        timestamp: Date.now(),
      });

      setIsSubmitted(true);
      recordSubmissionTime(); // Start the cooldown timer

      // Redirect to the happiness-bar-chart page after submission
      navigate('/happiness-bar-chart');
    } else {
      alert('Please enter a valid number between 1 and 10.');
    }
  };

  return (
    <div className="happiness-container">
      <div className="logo-placeholder-happiness">
        <div className="logo-happiness"></div>
      </div>

      {isSubmitted ? (
        <div className="confirmation-container-happiness">
          <p className="confirmation-message-happiness">Thank you for your response!</p>
        </div>
      ) : (
        <>
          <div className="happiness-question">
            <h1>On a scale of 1-10, how happy are you?</h1>
          </div>

          <div className="input-container-happiness">
            <input
              type="number"
              min="1"
              max="10"
              value={happinessLevel}
              onChange={(e) => setHappinessLevel(e.target.value)}
              placeholder="Enter a number between 1 and 10"
              required
              disabled={!canSubmit} // Disable input if submission is restricted
            />
          </div>

          <div className="button-container-happiness">
            <button onClick={handleSubmit} className="submit-btn-happiness" disabled={!canSubmit}>
              Submit
            </button>
          </div>

          {!canSubmit && timeLeft && (
            <p>Please wait {(timeLeft / 60000).toFixed(1)} minutes before submitting again.</p>
          )}
        </>
      )}
    </div>
  );
};

export default HappinessInput;
