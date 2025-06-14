
import { useState, useEffect } from 'react';

export const useTabAnimations = (activeTab: string) => {
  const [showButton, setShowButton] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingIcons, setAnimatingIcons] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activeTab === 'dashboard') {
      setShowButton(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
      // Delay hiding the button to allow fade-out animation
      const timer = setTimeout(() => {
        setShowButton(false);
      }, 300); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const handleTabClick = (tabValue: string) => {
    // Add the tab to the animating set
    setAnimatingIcons(prev => new Set(prev).add(tabValue));
    
    // Remove the animation after 2 seconds
    setTimeout(() => {
      setAnimatingIcons(prev => {
        const newSet = new Set(prev);
        newSet.delete(tabValue);
        return newSet;
      });
    }, 2000);
  };

  return {
    showButton,
    isAnimating,
    animatingIcons,
    handleTabClick
  };
};
