import React from 'react';

const SkipLinks: React.FC = () => {
  return (
    <div className="sr-only">
      <a 
        href="#main-content" 
        className="absolute left-1/2 top-4 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:not-sr-only focus:z-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation" 
        className="absolute left-1/2 top-16 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium focus:not-sr-only focus:z-50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to navigation
      </a>
    </div>
  );
};

export default SkipLinks;