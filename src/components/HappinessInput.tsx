import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push } from 'firebase/database';
import './HappinessInput.css'; // Scoped CSS for styles

interface HappinessInputProps {
  questionId: string; // Accept questionId from props
}

const HappinessInput: React.FC<HappinessInputProps> = ({ questionId }) => {
  const [score, setScore] = useState<number>(5); // Default score to 5
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For submit button state
  const navigate = useNavigate();
  const db = getDatabase();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true); // Disable submit button during processing

    // Reference to the happinessLevels database with questionId included
    const happinessRef = ref(db, `happinessLevels/${questionId}`);
    try {
      await push(happinessRef, {
        level: score,
        timestamp: Date.now(),
      });

      setIsSubmitted(true);
      setIsSubmitting(false); // Re-enable the submit button
      // After submission, navigate to the happiness-bar-chart page with questionId
      navigate(`/happiness-bar-chart/${questionId}`, { state: { questionId } });
    } catch (error) {
      console.error('Error submitting happiness level:', error);
      alert('There was an error submitting your happiness level. Please try again.');
      setIsSubmitting(false); // Re-enable the submit button on error
    }
  };

  const resetSlider = () => {
    setScore(5); // Reset to the middle value (5)
  };

  return (
    <div className="happiness-container">
      <div className="logo-placeholder-happiness">
        <div className="logo-happiness"></div>
      </div>
      {isSubmitted ? (
        <div className="confirmation-container">
          <p className="confirmation-message">Thank you for your response!</p>
        </div>
      ) : (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h1 className="block text-2xl font-bold text-black header-label">
                On a scale of 1-10, how happy are you?
              </h1>
              <div className="slider-container">
                <div className="flex justify-between slider-labels">
                  <span className="text-left">No</span>
                  <span className="text-right">Yes, definitely</span>
                </div>
                <input
                  id="happiness-slider"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={score}
                  onChange={(e) => setScore(parseInt(e.target.value))}
                  className="slider"
                  style={{
                    background: `linear-gradient(to right, #ff6f61 ${((score - 1) / 9) * 100}%, #ddd ${((score - 1) / 9) * 100}%)`,
                  }}
                />
                <div className="slider-numbers flex justify-between mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <span key={num}>{num}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 justify-center">
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className="w-12 h-12 text-center border rounded number-box"
              />
              <button type="button" onClick={resetSlider} className="text-xl reset-btn">
                ↻
              </button>
              <button
                type="submit"
                className="submit-btn w-full rounded-full text-white py-3 px-6 hover:opacity-90"
                disabled={isSubmitting} // Disable button during submission
              >
                {isSubmitting ? 'Submitting...' : 'SUBMIT'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HappinessInput;
