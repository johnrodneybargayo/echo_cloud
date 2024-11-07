// src/components/ui/Input.tsx

import React from 'react';

interface InputProps {
  placeholder?: string;
  className?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ placeholder, className, type = 'text', onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    className={`p-2 border rounded ${className}`}
  />
);

export default Input;

// Add this line to make it a module
export {};
