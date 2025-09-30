/**
 * Mobile-optimized UI components
 */

import React from 'react';
import { useMobileDetection } from './MobileWrapper';

/**
 * Mobile-optimized input component
 */
export interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touchFriendly?: boolean;
}

export const MobileInput: React.FC<MobileInputProps> = ({
  label,
  error,
  touchFriendly = true,
  className = '',
  ...props
}) => {
  const { isMobile } = useMobileDetection();
  
  const inputClasses = `
    form-input
    ${touchFriendly ? 'touch-friendly' : ''}
    ${error ? 'border-red-500' : ''}
    ${className}
  `.trim();

  return (
    <div className="form-group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        {...props}
        className={inputClasses}
        style={{
          fontSize: isMobile ? '16px' : '14px', // Prevent zoom on iOS
          ...props.style
        }}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

/**
 * Mobile-optimized button component
 */
export interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  touchFriendly?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  touchFriendly = true,
  className = '',
  disabled,
  ...props
}) => {
  const { isMobile } = useMobileDetection();
  
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  };
  
  const sizeClasses = {
    sm: isMobile ? 'px-3 py-2 text-sm min-h-[40px]' : 'px-3 py-2 text-sm',
    md: isMobile ? 'px-4 py-3 text-base min-h-[44px]' : 'px-4 py-2 text-sm',
    lg: isMobile ? 'px-6 py-4 text-lg min-h-[48px]' : 'px-6 py-3 text-base'
  };
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${touchFriendly ? 'touch-friendly' : ''}
    ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.trim();

  return (
    <button
      {...props}
      className={buttonClasses}
      disabled={loading || disabled}
      style={{
        touchAction: 'manipulation',
        ...props.style
      }}
    >
      {loading && (
        <span className="loading-spinner mr-2" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

/**
 * Mobile-optimized slider component
 */
export interface MobileSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
  className?: string;
}

export const MobileSlider: React.FC<MobileSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
  className = ''
}) => {
  const { isMobile } = useMobileDetection();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`slider-container ${className}`}>
      <label className="slider-label">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="flex-1 touch-friendly"
        style={{
          height: isMobile ? '44px' : '24px',
          touchAction: 'manipulation'
        }}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider-value"
      />
      {unit && <span className="text-sm text-gray-500">{unit}</span>}
    </div>
  );
};