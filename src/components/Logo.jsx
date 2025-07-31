import React from 'react';

export default function Logo({ size = 'md', className = '', showTagline = false }) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`text-center ${className}`}>
      <h1 className={`${sizes[size]} font-extralight text-white tracking-wider`}>
        HealFast
      </h1>
      {showTagline && (
        <p className="text-white/40 text-xs tracking-widest uppercase mt-1">
          Luxury Fasting
        </p>
      )}
    </div>
  );
}