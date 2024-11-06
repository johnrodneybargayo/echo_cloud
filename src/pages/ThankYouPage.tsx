import React from 'react';
import logo from '../assets/verbivibe_logo.png'; // Correct path to the logo in the assets folder

const ThankYouPage: React.FC = () => {
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
            top: '10px', // Adjust for shadow effect
            left: '10px', // Adjust for shadow effect
            width: '100%',
            filter: 'blur(4px)', // Add a slight blur for the shadow
            opacity: 0.6, // Adjust opacity for shadow depth
          }}
        />
        
        {/* Actual logo */}
        <img 
          src={logo} 
          alt="Logo" 
          style={{ 
            width: '100%',
            position: 'relative', // Main image layer
          }}
        />
      </div>
      <h1 style={{ fontSize: '3rem', color: '#fff', textAlign: 'center' }}>
        Thank you for participating!
      </h1>
    </div>
  );
};

export default ThankYouPage;
