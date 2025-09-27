import React from 'react';
import { cn } from '@/lib/utils';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  decorative?: boolean;
}

const Separator = React.forwardRef<
  HTMLDivElement,
  SeparatorProps
>(({ 
  orientation = 'horizontal', 
  className,
  decorative = true,
  ...props 
}, ref) => (
  <div
    ref={ref}
    role={decorative ? 'none' : 'separator'}
    aria-orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    {...props}
  />
));

Separator.displayName = 'Separator';

export { Separator };