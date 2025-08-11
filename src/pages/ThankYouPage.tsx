import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, remove } from 'firebase/database';
import logo from '../assets/verbivibe_logo.png';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const db = getDatabase();

  const handleClearAndReturn = async () => {
    try {
      // Clear questions, words, and happiness levels in Firebase
      await Promise.all([
        remove(ref(db, 'questions')),
        remove(ref(db, 'words')),
        remove(ref(db, 'happinessLevels')),
      ]);
      console.log("Database cleared successfully.");

      // Navigate back to dashboard after clearing
      navigate('/dashboard');
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #F39C12, #FF8A80, #A29BFE)'
    }}>
      <div style={{
        position: 'relative',
        width: '550px',
        marginBottom: '10px',
      }}>
        {/* Shadow layer */}
        <img 
          src={logo} 
          alt="Logo shadow"
          style={{ 
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '100%',
            filter: 'blur(4px)',
            opacity: 0.6,
          }}
        />
        
        {/* Actual logo */}
        <img 
          src={logo} 
          alt="Logo" 
          style={{ 
            width: '100%',
            position: 'relative',
          }}
        />
      </div>
      <h1 style={{ fontSize: '3rem', color: '#fff', textAlign: 'center' }}>
        Thank you for participating!
      </h1>
      <button 
        onClick={handleClearAndReturn} 
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1.25rem',
          color: '#fff',
          backgroundColor: '#4A90E2',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'opacity 0.3s',
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Go Back to Dashboard
      </button>
    </div>
  );
};

export default ThankYouPage;
