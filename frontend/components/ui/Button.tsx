import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm hover:shadow-md dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:border-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md dark:bg-red-500 dark:hover:bg-red-600',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {children}
    </button>
  );
}