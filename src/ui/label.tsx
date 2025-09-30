/**
 * Komponen Label untuk UI
 * Label components untuk forms
 */

import React, { LabelHTMLAttributes, forwardRef } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', ...props }, ref) => (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 ${className}`}
      {...props}
    />
  )
);

Label.displayName = 'Label';

export { Label };