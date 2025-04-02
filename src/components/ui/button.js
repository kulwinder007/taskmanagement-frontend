import React from 'react';

export const Button = ({ onClick, children, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
};