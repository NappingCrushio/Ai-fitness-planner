
import React from 'react';

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M18 12h-6" />
    <path d="M15 9h3" />
    <path d="M15 15h3" />
  </svg>
);
