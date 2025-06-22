
import React from 'react';
import { useTabAnimations } from '@/hooks/useTabAnimations';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  return (
    <div className={`flex items-center justify-center mb-6 ${isMobile ? 'px-4' : 'px-10'}`}>
      {/* Left spacer - only on desktop */}
      {!isMobile && (
        <div className="w-10 flex justify-start">
          {/* Empty space for symmetry */}
        </div>
      )}
      
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
        {/* System Configuration Tabs - Responsive Layout */}
        <SystemConfigTabs 
          animatingIcons={animatingIcons}
          onTabClick={handleTabClick}
          isMobile={isMobile}
        />

        {/* Visual Divider */}
        <div className={`h-px bg-border ${isMobile ? 'w-24' : 'w-32'}`}></div>

        {/* Dashboard Tab - Separate and Special */}
        <DashboardTab 
          animatingIcons={animatingIcons}
          onTabClick={handleTabClick}
          isMobile={isMobile}
        />
      </div>
      
      {/* Right button area - responsive positioning */}
      <div className={`${isMobile ? 'absolute top-2 right-4' : 'w-10 flex justify-end'}`}>
        {showButton && (
          <div className={isAnimating ? "animate-fade-in" : "animate-fade-out"}>
            <TabSettingsButton 
              showButton={showButton}
              isAnimating={isAnimating}
              dashboardConfig={dashboardConfig}
              onConfigChange={onConfigChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
