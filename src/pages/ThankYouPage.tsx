import React from 'react';

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
      <h1 style={{ fontSize: '3rem', color: '#fff', textAlign: 'center' }}>
        Thank you for participating!
      </h1>
    </div>
  );
};

export default ThankYouPage;
