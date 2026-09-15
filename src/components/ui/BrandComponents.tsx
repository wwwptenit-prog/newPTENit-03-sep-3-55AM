import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cta' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  // Official Brand System sizing
  // Primary & CTA: px-6 py-3 rounded-xl
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
    md: 'px-6 py-3 text-base rounded-xl gap-2',
    lg: 'px-8 py-3.5 text-lg rounded-xl gap-2.5',
  }[size];

  // Official Brand System variants:
  // Primary: Green (#006A4E), White text, hover darker (#006A4E)
  // CTA: Red (#E31E24), White text, hover darker (#E31E24)
  // Secondary: White bg, Green border, Green text
  const variantStyles = {
    primary: 'bg-[#006A4E] text-white hover:bg-[#006A4E] shadow-sm',
    cta: 'bg-[#E31E24] text-white hover:bg-[#E31E24] shadow-sm',
    secondary: 'bg-white text-[#006A4E] border-2 border-[#006A4E] hover:bg-emerald-50/50 shadow-xs',
    outline: 'bg-transparent text-slate-700 border border-gray-300 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-red-50 text-[#E31E24] hover:bg-red-100 border border-red-200',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  ...props
}) => {
  // Official Brand System: bg-white rounded-2xl shadow-sm border border-gray-200 p-6
  const interactiveStyles = interactive
    ? 'hover:shadow-md hover:border-emerald-200 transition-all duration-300 cursor-pointer'
    : '';

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  // Official Brand System: rounded-lg border-gray-300 focus ring with Primary Green
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-1.5 font-bengali">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-slate-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent transition-all ${
          error ? 'border-red-400 focus:ring-[#E31E24]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#E31E24]">{error}</p>}
    </div>
  );
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'red' | 'blue' | 'gray';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'green',
  children,
  className = '',
  ...props
}) => {
  // Official Brand System: rounded-full
  const variantStyles = {
    green: 'bg-emerald-50 text-[#006A4E] border border-emerald-200',
    red: 'bg-red-50 text-[#E31E24] border border-red-200',
    blue: 'bg-blue-50 text-[#1E3A8A] border border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
