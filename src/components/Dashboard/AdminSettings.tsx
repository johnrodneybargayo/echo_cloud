// src/components/Dashboard/AdminSettings.tsx
import React, { useState } from 'react';
import { getDatabase, ref, remove } from 'firebase/database';
import DeleteLoader from '../loader/DeleteLoader'; // Ensure correct path to the DeleteLoader component
import './AdminSettings.css'; // Import your CSS for styling

const AdminSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const clearWordsInDatabase = async () => {
    const db = getDatabase();
    const wordsRef = ref(db, 'words'); // Reference to the 'words' node in the database
    setIsLoading(true); // Start loader
    setSuccessMessage(null); // Reset success message

    try {
      await remove(wordsRef);
      setTimeout(() => {
        setSuccessMessage('Words cleared from the database.');
        setIsLoading(false); // Stop loader after delay
      }, 2000); // 2 seconds for simulation
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to clear words: ' + errorMessage);
      setIsLoading(false); // Stop loader on error
    }
  };

  const clearHappinessLevelsInDatabase = async () => {
    const db = getDatabase();
    const happinessRef = ref(db, 'happinessLevels'); // Reference to the 'happinessLevels' node in the database
    setIsLoading(true); // Start loader
    setSuccessMessage(null); // Reset success message

    try {
      await remove(happinessRef);
      setTimeout(() => {
        setSuccessMessage('Happiness levels cleared from the database.');
        setIsLoading(false); // Stop loader after delay
      }, 2000); // 2 seconds for simulation
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to clear happiness levels: ' + errorMessage);
      setIsLoading(false); // Stop loader on error
    }
  };

  const clearQuestionsInDatabase = async () => {
    const db = getDatabase();
    const questionsRef = ref(db, 'questions'); // Reference to the 'questions' node in the database
    setIsLoading(true); // Start loader
    setSuccessMessage(null); // Reset success message

    try {
      await remove(questionsRef);
      setTimeout(() => {
        setSuccessMessage('Questions cleared from the database.');
        setIsLoading(false); // Stop loader after delay
      }, 2000); // 2 seconds for simulation
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to clear questions: ' + errorMessage);
      setIsLoading(false); // Stop loader on error
    }
  };

  return (
    <>
      {isLoading && <DeleteLoader />} {/* Show loader if loading */}
      <h1 className="admin-header">THIS IS THE ADMIN PAGE WHERE YOU CAN MANAGE THE FIREBASE DATA.</h1>
      <div className="admin-actions">
        <button className="admin-action-button" onClick={clearWordsInDatabase}>
          Clear Words from Firebase
        </button>
        <button className="admin-action-button" onClick={clearHappinessLevelsInDatabase}>
          Clear Happiness Levels from Firebase
        </button>
        <button className="admin-action-button" onClick={clearQuestionsInDatabase}>
          Clear Questions from Firebase
        </button>
      </div>
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
    </>
  );
};

export default AdminSettings;
