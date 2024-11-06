import React from 'react';
import './Loader.css'; // Import the loader styles

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <span className="loader"></span>
    </div>
  );
};

export default Loader;
