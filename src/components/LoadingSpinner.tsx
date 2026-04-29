
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-20 h-20 border-[6px]',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} border-solid border-sky-500 border-t-transparent shadow-[0_0_15px_rgba(14,165,233,0.3)]`}
        ></div>
        <div className={`absolute inset-0 animate-ping opacity-20 rounded-full bg-sky-500 ${sizeClasses[size].split(' ')[0]} ${sizeClasses[size].split(' ')[1]}`}></div>
      </div>
      {message && <p className="mt-4 text-sky-400 text-[10px] font-technical uppercase tracking-[0.2em] animate-pulse">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;