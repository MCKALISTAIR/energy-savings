
import React from 'react';
import { useTabAnimations } from '@/hooks/useTabAnimations';
import SystemConfigTabs from './SystemConfigTabs';
import DashboardTab from './DashboardTab';
import TabSettingsButton from './TabSettingsButton';
import { DashboardConfig } from '@/components/dashboard/types';

interface TabNavigationProps {
  activeTab: string;
  dashboardConfig: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  dashboardConfig,
  onConfigChange
}) => {
  const { showButton, isAnimating, animatingIcons, handleTabClick } = useTabAnimations(activeTab);

  return (
    <div className="flex items-center justify-center mb-6 px-10">
      {/* Left spacer - matches the width of the right button area */}
      <div className="w-10 flex justify-start">
        {/* Empty space for symmetry */}
      </div>
      
      <div className="flex flex-col items-center gap-4">
        {/* System Configuration Tabs - Two Row Layout */}
        <SystemConfigTabs 
          animatingIcons={animatingIcons}
          onTabClick={handleTabClick}
        />

        {/* Visual Divider */}
        <div className="h-px w-32 bg-border"></div>

        {/* Dashboard Tab - Separate and Special */}
        <DashboardTab 
          animatingIcons={animatingIcons}
          onTabClick={handleTabClick}
        />
      </div>
      
      {/* Right button area - always takes up space */}
      <TabSettingsButton 
        showButton={showButton}
        isAnimating={isAnimating}
        dashboardConfig={dashboardConfig}
        onConfigChange={onConfigChange}
      />
    </div>
  );
};

export default TabNavigation;
