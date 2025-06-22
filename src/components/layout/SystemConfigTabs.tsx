
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Zap, Battery, Car, Thermometer, Activity } from 'lucide-react';
import { getTabIconClassName } from '@/utils/tabIconClasses';

interface SystemConfigTabsProps {
  animatingIcons: Set<string>;
  onTabClick: (tabValue: string) => void;
  isMobile?: boolean;
}

const SystemConfigTabs: React.FC<SystemConfigTabsProps> = ({
  animatingIcons,
  onTabClick,
  isMobile = false
}) => {
  if (isMobile) {
    // Mobile: Single scrollable row
    return (
      <div className="w-full overflow-x-auto">
        <TabsList className="grid grid-cols-6 w-max min-w-full">
          <TabsTrigger 
            value="systems" 
            className="flex flex-col items-center gap-1 px-3 py-2 min-w-[80px] text-xs"
            onClick={() => onTabClick('systems')}
          >
            <Settings className={`w-4 h-4 ${getTabIconClassName('systems', animatingIcons)}`} />
            <span>Systems</span>
          </TabsTrigger>
          <TabsTrigger 
            value="solar" 
            className="flex flex-col items-center gap-1 px-3 py-2 min-w-[80px] text-xs"
            onClick={() => onTabClick('solar')}
          >
            <Zap className={`w-4 h-4 ${getTabIconClassName('solar', animatingIcons)}`} />
            <span>Solar</span>
          </TabsTrigger>
          <TabsTrigger 
            value="battery" 
            className="flex flex-col items-center gap-1 px-3 py-2 min-w-[80px] text-xs"
            onClick={() => onTabClick('battery')}
          >
            <Battery className={`w-4 h-4 ${getTabIconClassName('battery', animatingIcons)}`} />
            <span>Battery</span>
          </TabsTrigger>
          <TabsTrigger 
            value="ev" 
            className="flex flex-col items-center gap-1 px-2 py-2 min-w-[70px] text-xs"
            onClick={() => onTabClick('ev')}
          >
            <Car className={`w-4 h-4 ${getTabIconClassName('ev', animatingIcons)}`} />
            <span>EV</span>
          </TabsTrigger>
          <TabsTrigger 
            value="heatpump" 
            className="flex flex-col items-center gap-1 px-2 py-2 min-w-[70px] text-xs"
            onClick={() => onTabClick('heatpump')}
          >
            <Thermometer className={`w-4 h-4 ${getTabIconClassName('heatpump', animatingIcons)}`} />
            <span>Heat</span>
          </TabsTrigger>
          <TabsTrigger 
            value="smartmeter" 
            className="flex flex-col items-center gap-1 px-2 py-2 min-w-[70px] text-xs"
            onClick={() => onTabClick('smartmeter')}
          >
            <Activity className={`w-4 h-4 ${getTabIconClassName('smartmeter', animatingIcons)}`} />
            <span>Meter</span>
          </TabsTrigger>
        </TabsList>
      </div>
    );
  }

  // Desktop: Two row layout
  return (
    <div className="flex flex-col gap-2">
      {/* First Row - Systems, Solar, Battery */}
      <TabsList className="grid grid-cols-3 w-auto">
        <TabsTrigger 
          value="systems" 
          className="flex items-center gap-2 px-6 min-w-[140px]"
          onClick={() => onTabClick('systems')}
        >
          <Settings className={getTabIconClassName('systems', animatingIcons)} />
          Systems
        </TabsTrigger>
        <TabsTrigger 
          value="solar" 
          className="flex items-center gap-2 px-6 min-w-[130px]"
          onClick={() => onTabClick('solar')}
        >
          <Zap className={getTabIconClassName('solar', animatingIcons)} />
          Solar
        </TabsTrigger>
        <TabsTrigger 
          value="battery" 
          className="flex items-center gap-2 px-6 min-w-[140px]"
          onClick={() => onTabClick('battery')}
        >
          <Battery className={getTabIconClassName('battery', animatingIcons)} />
          Battery
        </TabsTrigger>
      </TabsList>

      {/* Second Row - Electric Vehicle, Heating, Smart Meter */}
      <div className="flex justify-center">
        <TabsList className="grid grid-cols-3 w-auto">
          <TabsTrigger 
            value="ev" 
            className="flex items-center gap-2 px-6 min-w-[170px]"
            onClick={() => onTabClick('ev')}
          >
            <Car className={getTabIconClassName('ev', animatingIcons)} />
            Electric Vehicle
          </TabsTrigger>
          <TabsTrigger 
            value="heatpump" 
            className="flex items-center gap-2 px-6 min-w-[150px]"
            onClick={() => onTabClick('heatpump')}
          >
            <Thermometer className={getTabIconClassName('heatpump', animatingIcons)} />
            Heating
          </TabsTrigger>
          <TabsTrigger 
            value="smartmeter" 
            className="flex items-center gap-2 px-6 min-w-[150px]"
            onClick={() => onTabClick('smartmeter')}
          >
            <Activity className={getTabIconClassName('smartmeter', animatingIcons)} />
            Smart Meter
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

export default SystemConfigTabs;
