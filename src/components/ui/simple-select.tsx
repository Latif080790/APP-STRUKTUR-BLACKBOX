import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  value?: string;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({ 
  options, 
  placeholder = "Select an option",
  onChange,
  className = '',
  value,
  disabled,
  name,
  id,
  ...props 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select 
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      onChange={handleChange}
      value={value}
      disabled={disabled}
      name={name}
      id={id}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};