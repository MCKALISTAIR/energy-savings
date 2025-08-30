import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps {
  children: ReactNode;
  className?: string;
}

const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children, className }) => {
  return (
    <span 
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0",
        className
      )}
    >
      {children}
    </span>
  );
};

export default VisuallyHidden;