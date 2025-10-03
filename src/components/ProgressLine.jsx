import React from 'react';

const ProgressLine = ({ 
  progress = 0,          // default to 0
  height = 12,           // slightly thicker
  color = '#4b9fff',
  background = '#e5e7eb', // gray-200
  className = ''
}) => {
  return (
    <div 
      className={`relative rounded overflow-hidden ${className}`} 
      style={{ width: '100%', height, background }}
    >
      <div
        style={{
          width: `${Math.min(Math.max(progress, 0), 100)}%`, // clamp 0–100
          height: '100%',
          background: color,
          transition: 'width 0.8s ease-out',
          boxShadow: `0 0 8px ${color}`
        }}
      />
    </div>
  );
};

export default ProgressLine;
