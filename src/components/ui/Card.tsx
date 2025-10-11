import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'soft' | 'medium' | 'large';
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'soft',
  onClick
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-large'
  };
  
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
