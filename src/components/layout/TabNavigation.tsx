
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { DashboardConfig } from '@/components/dashboard/types';
import { Zap, Battery, Car, BarChart3, Settings, Thermometer } from 'lucide-react';

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
  return (
    <div className="flex items-center justify-between mb-6">
      <TabsList className="grid grid-cols-6 flex-1 mr-4">
        <TabsTrigger value="systems" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Systems
        </TabsTrigger>
        <TabsTrigger value="solar" className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Solar
        </TabsTrigger>
        <TabsTrigger value="battery" className="flex items-center gap-2">
          <Battery className="w-4 h-4" />
          Battery
        </TabsTrigger>
        <TabsTrigger value="ev" className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          Electric Vehicle
        </TabsTrigger>
        <TabsTrigger value="heatpump" className="flex items-center gap-2">
          <Thermometer className="w-4 h-4" />
          Heat Pump
        </TabsTrigger>
        <TabsTrigger value="dashboard" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Dashboard
        </TabsTrigger>
      </TabsList>
      
      {/* Dashboard Customize Button with conditional animation - icon only */}
      <div className="w-10 flex justify-end">
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <DashboardSettings config={dashboardConfig} onConfigChange={onConfigChange} iconOnly />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
