import React from 'react';
import { getDatabase, ref, remove } from 'firebase/database';
import './AdminPage.css'; // Optional: CSS for styling the admin page

const AdminPage: React.FC = () => {
  
  // Function to clear words in Firebase
  const clearWordsInDatabase = () => {
    const db = getDatabase();
    const wordsRef = ref(db, 'words'); // Reference to the 'words' node in the database

    remove(wordsRef)
      .then(() => {
        alert('Words cleared from the database.');
      })
      .catch((error) => {
        alert('Failed to clear words: ' + error.message);
      });
  };

  // Function to clear happiness levels in Firebase
  const clearHappinessLevelsInDatabase = () => {
    const db = getDatabase();
    const happinessRef = ref(db, 'happinessLevels'); // Reference to the 'happinessLevels' node in the database

    remove(happinessRef)
      .then(() => {
        alert('Happiness levels cleared from the database.');
      })
      .catch((error) => {
        alert('Failed to clear happiness levels: ' + error.message);
      });
  };

  return (
    <div className="admin-container">
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
      </div>
    </div>
  );
};

export default AdminPage;
