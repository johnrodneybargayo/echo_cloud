import React from 'react';
import logo from '../assets/lcc_logo.png'; // Correct path to the logo in the assets folder

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
      <img 
        src={logo} 
        alt="Logo" 
        style={{ width: '150px', marginBottom: '20px' }} // Adjust the size and margin as needed
      />
      <h1 style={{ fontSize: '3rem', color: '#fff', textAlign: 'center' }}>
        Thank you for participating!
      </h1>
    </div>
  );
};

export default ThankYouPage;
