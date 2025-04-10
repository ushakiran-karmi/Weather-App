// src/components/Alert.tsx
import React from 'react';

interface AlertProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  let bgColor;
  switch (type) {
    case 'error':
      bgColor = 'bg-red-500';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      break;
    default:
      bgColor = 'bg-blue-500';
  }

  return (
    <div className={`text-white p-4 mb-4 rounded ${bgColor} flex justify-between items-center`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">X</button>
    </div>
  );
};

export default Alert;
