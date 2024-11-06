import React, { useState } from 'react';
import { getDatabase, ref, remove } from 'firebase/database';
import './AdminPage.css'; // Optional: CSS for styling the admin page
import DeleteLoader from '../components/loader/DeleteLoader'; // Import the DeleteLoader component

const AdminPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false); // State for the loader
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success message

  const clearWordsInDatabase = async () => {
    const db = getDatabase();
    const wordsRef = ref(db, 'words'); // Reference to the 'words' node in the database
    setIsLoading(true); // Start loader
    setSuccessMessage(null); // Reset success message

    try {
      await remove(wordsRef);
      // Wait for 10 seconds before showing the success message
      setTimeout(() => {
        setSuccessMessage('Words cleared from the database.');
        setIsLoading(false); // Stop loader after delay
      }, 8000); // 8 seconds
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
      }, 10000); // 10 seconds
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
      }, 10000); // 10 seconds
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to clear questions: ' + errorMessage);
      setIsLoading(false); // Stop loader on error
    }
  };

  return (
    <div className="admin-container">
      {isLoading && <DeleteLoader />} {/* Show loader if loading */}

      <h1>Admin Page</h1>
      <p>This is the admin page where you can manage the Firebase data.</p>

      <div className="button-container">
        {/* Button to clear words */}
        <button className="clear-btn" onClick={clearWordsInDatabase}>
          Clear Words from Firebase
        </button>

        {/* Button to clear happiness levels */}
        <button className="clear-btn" onClick={clearHappinessLevelsInDatabase}>
          Clear Happiness Levels from Firebase
        </button>

        {/* Button to clear questions */}
        <button className="clear-btn" onClick={clearQuestionsInDatabase}>
          Clear Questions from Firebase
        </button>
      </div>

      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
    </div>
  );
};

export default AdminPage;
