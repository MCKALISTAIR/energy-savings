
import React, { useState, useEffect } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { DashboardConfig } from '@/components/dashboard/types';
import { Zap, Battery, Car, Settings, Thermometer, LayoutDashboard } from 'lucide-react';

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

  const getIconClassName = (tabValue: string) => {
    if (!animatingIcons.has(tabValue)) return "w-5 h-5";
    
    const baseClass = "w-5 h-5";
    switch (tabValue) {
      case 'battery': return `${baseClass} icon-battery-charging`;
      case 'ev': return `${baseClass} icon-car-moving`;
      case 'solar': return `${baseClass} icon-solar-pulse`;
      case 'systems': return `${baseClass} icon-settings-spin`;
      case 'heatpump': return `${baseClass} icon-heatpump-wave`;
      case 'dashboard': return `${baseClass} icon-dashboard-bounce`;
      default: return baseClass;
    }
  };

  return (
    <div className="flex items-center justify-center mb-6 px-10">
      {/* Left spacer - matches the width of the right button area */}
      <div className="w-10 flex justify-start">
        {/* Empty space for symmetry */}
      </div>
      
      <div className="flex flex-col items-center gap-4">
        {/* System Configuration Tabs - Two Row Layout */}
        <div className="flex flex-col gap-2">
          {/* First Row - Systems, Solar, Battery */}
          <TabsList className="grid grid-cols-3 w-auto">
            <TabsTrigger 
              value="systems" 
              className="flex items-center gap-2 px-6 min-w-[140px]"
              onClick={() => handleTabClick('systems')}
            >
              <Settings className={getIconClassName('systems')} />
              Systems
            </TabsTrigger>
            <TabsTrigger 
              value="solar" 
              className="flex items-center gap-2 px-6 min-w-[130px]"
              onClick={() => handleTabClick('solar')}
            >
              <Zap className={getIconClassName('solar')} />
              Solar
            </TabsTrigger>
            <TabsTrigger 
              value="battery" 
              className="flex items-center gap-2 px-6 min-w-[140px]"
              onClick={() => handleTabClick('battery')}
            >
              <Battery className={getIconClassName('battery')} />
              Battery
            </TabsTrigger>
          </TabsList>

          {/* Second Row - Electric Vehicle, Heat Pump (centered) */}
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 w-auto">
              <TabsTrigger 
                value="ev" 
                className="flex items-center gap-2 px-6 min-w-[170px]"
                onClick={() => handleTabClick('ev')}
              >
                <Car className={getIconClassName('ev')} />
                Electric Vehicle
              </TabsTrigger>
              <TabsTrigger 
                value="heatpump" 
                className="flex items-center gap-2 px-6 min-w-[150px]"
                onClick={() => handleTabClick('heatpump')}
              >
                <Thermometer className={getIconClassName('heatpump')} />
                Heat Pump
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Visual Divider */}
        <div className="h-px w-32 bg-border"></div>

        {/* Dashboard Tab - Separate and Special */}
        <TabsList className="grid grid-cols-1">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 dashboard-tab relative overflow-hidden hover:scale-105 transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:font-semibold hover:shadow-md px-8 min-w-[160px]"
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard className={getIconClassName('dashboard')} />
            <span className="font-medium">Dashboard</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Right button area - always takes up space */}
      <div className="w-10 flex justify-end">
        {showButton && (
          <div className={isAnimating ? "animate-fade-in" : "animate-fade-out"}>
            <DashboardSettings config={dashboardConfig} onConfigChange={onConfigChange} iconOnly />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
