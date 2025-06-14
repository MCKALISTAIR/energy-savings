
import React from 'react';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { DashboardConfig } from '@/components/dashboard/types';

interface TabSettingsButtonProps {
  showButton: boolean;
  isAnimating: boolean;
  dashboardConfig: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const TabSettingsButton: React.FC<TabSettingsButtonProps> = ({
  showButton,
  isAnimating,
  dashboardConfig,
  onConfigChange
}) => {
  return (
    <div className="w-10 flex justify-end">
      {showButton && (
        <div className={isAnimating ? "animate-fade-in" : "animate-fade-out"}>
          <DashboardSettings config={dashboardConfig} onConfigChange={onConfigChange} iconOnly />
        </div>
      )}
    </div>
  );
};

export default TabSettingsButton;
