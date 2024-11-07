// src/components/ui/Button.tsx

import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => (
  <button onClick={onClick} className={`py-2 px-4 rounded ${className}`}>
    {children}
  </button>
);

export default Button;

// Add this line to make it a module
export {};
