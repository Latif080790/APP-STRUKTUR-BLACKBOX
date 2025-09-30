/**
 * Komponen Tabs untuk UI
 * Komponen tabs yang fleksibel dan dapat digunakan kembali
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  onValueChange,
  defaultValue = '',
  children,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const value = controlledValue ?? internalValue;
  const handleValueChange = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`tabs ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger harus digunakan dalam Tabs');
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
        ${isSelected 
          ? 'bg-white text-blue-600 shadow-sm' 
          : 'text-gray-600 hover:text-gray-800'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent harus digunakan dalam Tabs');
  }

  const { value: selectedValue } = context;

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div className={`mt-6 ${className}`}>
      {children}
    </div>
  );
};