
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Zap, Battery, Car, Thermometer, Activity, LayoutDashboard } from 'lucide-react';
import { useTabAnimations } from '@/hooks/useTabAnimations';
import { useIsMobile } from '@/hooks/use-mobile';
import TabSettingsButton from './TabSettingsButton';
import { getTabIconClassName } from '@/utils/tabIconClasses';
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

  if (isMobile) {
    // Mobile: Touch-friendly scrollable navigation
    return (
      <div className={`flex items-center justify-center mb-6 px-4`}>
        <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
          {/* System Configuration Tabs - Mobile Carousel */}
          <div className="w-full mobile-tab-container">
            <div className="overflow-x-auto scrollbar-hide">
              <TabsList className="flex gap-2 px-4 py-4 min-w-max bg-transparent">
                <TabsTrigger 
                  value="systems" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('systems')}
                >
                  <Settings className={`w-5 h-5 ${getTabIconClassName('systems', animatingIcons)}`} />
                  <span>Systems</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="solar" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('solar')}
                >
                  <Zap className={`w-5 h-5 ${getTabIconClassName('solar', animatingIcons)}`} />
                  <span>Solar</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="battery" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('battery')}
                >
                  <Battery className={`w-5 h-5 ${getTabIconClassName('battery', animatingIcons)}`} />
                  <span>Battery</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ev" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('ev')}
                >
                  <Car className={`w-5 h-5 ${getTabIconClassName('ev', animatingIcons)}`} />
                  <span>EV</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="heatpump" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('heatpump')}
                >
                  <Thermometer className={`w-5 h-5 ${getTabIconClassName('heatpump', animatingIcons)}`} />
                  <span>Heat</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="smartmeter" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('smartmeter')}
                >
                  <Activity className={`w-5 h-5 ${getTabIconClassName('smartmeter', animatingIcons)}`} />
                  <span>Meter</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="dashboard" 
                  className="mobile-tab-trigger"
                  onClick={() => handleTabClick('dashboard')}
                >
                  <LayoutDashboard className={`w-5 h-5 ${getTabIconClassName('dashboard', animatingIcons)}`} />
                  <span>Dashboard</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="mobile-scroll-indicator"></div>
          </div>
        </div>
        
        {/* Right button area - mobile positioning */}
        <div className="absolute top-2 right-4">
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
  }

  // Desktop: Two row layout with single TabsList
  return (
    <div className={`flex items-center justify-center mb-6 ${isMobile ? 'px-4' : 'px-10'}`}>
      {/* Left spacer - only on desktop */}
      <div className="w-10 flex justify-start">
        {/* Empty space for symmetry */}
      </div>
      
      <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
        {/* System Configuration Tabs - First Row */}
        <TabsList className="grid grid-cols-3 w-auto">
          <TabsTrigger 
            value="systems" 
            className="flex items-center gap-2 px-6 min-w-[140px]"
            onClick={() => handleTabClick('systems')}
          >
            <Settings className={getTabIconClassName('systems', animatingIcons)} />
            Systems
          </TabsTrigger>
          <TabsTrigger 
            value="solar" 
            className="flex items-center gap-2 px-6 min-w-[130px]"
            onClick={() => handleTabClick('solar')}
          >
            <Zap className={getTabIconClassName('solar', animatingIcons)} />
            Solar
          </TabsTrigger>
          <TabsTrigger 
            value="battery" 
            className="flex items-center gap-2 px-6 min-w-[140px]"
            onClick={() => handleTabClick('battery')}
          >
            <Battery className={getTabIconClassName('battery', animatingIcons)} />
            Battery
          </TabsTrigger>
        </TabsList>

        {/* Second Row */}
        <div className="flex justify-center">
          <TabsList className="grid grid-cols-3 w-auto">
            <TabsTrigger 
              value="ev" 
              className="flex items-center gap-2 px-6 min-w-[170px]"
              onClick={() => handleTabClick('ev')}
            >
              <Car className={getTabIconClassName('ev', animatingIcons)} />
              Electric Vehicle
            </TabsTrigger>
            <TabsTrigger 
              value="heatpump" 
              className="flex items-center gap-2 px-6 min-w-[150px]"
              onClick={() => handleTabClick('heatpump')}
            >
              <Thermometer className={getTabIconClassName('heatpump', animatingIcons)} />
              Heating
            </TabsTrigger>
            <TabsTrigger 
              value="smartmeter" 
              className="flex items-center gap-2 px-6 min-w-[150px]"
              onClick={() => handleTabClick('smartmeter')}
            >
              <Activity className={getTabIconClassName('smartmeter', animatingIcons)} />
              Smart Meter
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Visual Divider */}
        <div className="h-px bg-border w-32"></div>

        {/* Dashboard Tab */}
        <TabsList className="grid grid-cols-1">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 dashboard-tab relative overflow-hidden hover:scale-105 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:font-semibold hover:shadow-md px-8 min-w-[160px]"
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard className={`w-5 h-5 ${getTabIconClassName('dashboard', animatingIcons)}`} />
            <span className="font-medium">Dashboard</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Right button area */}
      <div className="w-10 flex justify-end">
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
