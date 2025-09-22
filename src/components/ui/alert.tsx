import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'border-gray-200 bg-gray-50 text-gray-800',
    destructive: 'border-red-200 bg-red-50 text-red-800'
  };
  
  const classes = `relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`.trim();
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};