
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SolarCalculator from '@/components/SolarCalculator';
import BatteryCalculator from '@/components/BatteryCalculator';
import EVCalculator from '@/components/EVCalculator';
import HeatPumpCalculator from '@/components/HeatPumpCalculator';
import SavingsDashboard from '@/components/SavingsDashboard';
import DatabaseHouseSelector from '@/components/DatabaseHouseSelector';
import DatabaseSystemManager from '@/components/DatabaseSystemManager';
import { SavingsData } from '@/pages/Index';
import { DashboardConfig } from '@/components/dashboard/types';

interface TabContentProps {
  activeTab: string;
  savingsData: SavingsData;
  dashboardConfig: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
  updateSolarData: (data: SavingsData['solar']) => void;
  updateBatteryData: (data: SavingsData['battery']) => void;
  updateEVData: (data: SavingsData['ev']) => void;
  updateHeatPumpData: (data: SavingsData['heatPump']) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  savingsData,
  dashboardConfig,
  onConfigChange,
  updateSolarData,
  updateBatteryData,
  updateEVData,
  updateHeatPumpData
}) => {
  return (
    <>
      {/* Dashboard Subtitle - only shown when dashboard tab is active */}
      {activeTab === 'dashboard' && (
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            Overview of your renewable energy investments
          </p>
        </div>
      )}

      <TabsContent value="systems" className="animate-fade-in">
        <div className="space-y-6">
          <DatabaseHouseSelector />
          <DatabaseSystemManager />
        </div>
      </TabsContent>

      <TabsContent value="solar" className="animate-fade-in">
        <SolarCalculator onUpdate={updateSolarData} />
      </TabsContent>

      <TabsContent value="battery" className="animate-fade-in">
        <BatteryCalculator onUpdate={updateBatteryData} />
      </TabsContent>

      <TabsContent value="ev" className="animate-fade-in">
        <EVCalculator onUpdate={updateEVData} />
      </TabsContent>

      <TabsContent value="heatpump" className="animate-fade-in">
        <HeatPumpCalculator onUpdate={updateHeatPumpData} />
      </TabsContent>

      <TabsContent value="dashboard" className="animate-fade-in">
        <SavingsDashboard 
          data={savingsData} 
          config={dashboardConfig}
          onConfigChange={onConfigChange}
        />
      </TabsContent>
    </>
  );
};

export default TabContent;
