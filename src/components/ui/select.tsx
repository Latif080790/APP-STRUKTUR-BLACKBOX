import React, { useState } from 'react';

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export interface SelectContentProps {
  children: React.ReactNode;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            value,
            onValueChange,
            isOpen,
            setIsOpen
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps & any> = ({ 
  className, 
  children, 
  value, 
  setIsOpen, 
  isOpen 
}) => {
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {children}
      <span className="ml-2">▼</span>
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps & any> = ({ placeholder, value }) => {
  return <span>{value || placeholder}</span>;
};

export const SelectContent: React.FC<SelectContentProps & any> = ({ 
  children, 
  isOpen, 
  onValueChange, 
  setIsOpen, 
  value 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, {
            onValueChange,
            setIsOpen,
            selectedValue: value
          });
        }
        return child;
      })}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps & any> = ({ 
  value, 
  children, 
  onValueChange, 
  setIsOpen, 
  selectedValue 
}) => {
  const isSelected = selectedValue === value;
  
  return (
    <div
      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50 text-blue-900' : ''}`}
      onClick={() => {
        onValueChange?.(value);
        setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
};