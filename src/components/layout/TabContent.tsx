
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import SolarCalculator from '@/components/SolarCalculator';
import BatteryCalculator from '@/components/BatteryCalculator';
import EVCalculator from '@/components/EVCalculator';
import HeatPumpCalculator from '@/components/HeatPumpCalculator';
import SavingsDashboard from '@/components/SavingsDashboard';
import DatabaseHouseSelector from '@/components/DatabaseHouseSelector';
import DatabaseSystemManager from '@/components/DatabaseSystemManager';
import HouseSelector from '@/components/HouseSelector';
import SystemManager from '@/components/SystemManager';
import SmartMeterIntegration from '@/components/SmartMeterIntegration';
import { SavingsData } from '@/pages/Index';
import { DashboardConfig } from '@/components/dashboard/types';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

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
        <div id="systems-panel" role="tabpanel" aria-labelledby="systems-tab">
        <div className="space-y-6">
          {user ? (
            <>
              <DatabaseHouseSelector />
              <DatabaseSystemManager />
            </>
          ) : (
            <>
              <HouseSelector />
              <SystemManager />
            </>
          )}
        </div>
        </div>
      </TabsContent>

      <TabsContent value="solar" className="animate-fade-in">
        <div id="solar-panel" role="tabpanel" aria-labelledby="solar-tab">
        <SolarCalculator 
          onUpdate={updateSolarData} 
          energyPrices={dashboardConfig.enableCustomPricing ? dashboardConfig.customEnergyPrices : undefined} 
        />
        </div>
      </TabsContent>

      <TabsContent value="battery" className="animate-fade-in">
        <div id="battery-panel" role="tabpanel" aria-labelledby="battery-tab">
        <BatteryCalculator 
          onUpdate={updateBatteryData} 
          energyPrices={dashboardConfig.enableCustomPricing ? dashboardConfig.customEnergyPrices : undefined} 
        />
        </div>
      </TabsContent>

      <TabsContent value="ev" className="animate-fade-in">
        <div id="ev-panel" role="tabpanel" aria-labelledby="ev-tab">
        <EVCalculator 
          onUpdate={updateEVData} 
          energyPrices={dashboardConfig.enableCustomPricing ? dashboardConfig.customEnergyPrices : undefined} 
          dashboardConfig={dashboardConfig}
        />
        </div>
      </TabsContent>

      <TabsContent value="heatpump" className="animate-fade-in">
        <div id="heatpump-panel" role="tabpanel" aria-labelledby="heatpump-tab">
        <HeatPumpCalculator 
          onUpdate={updateHeatPumpData} 
          energyPrices={dashboardConfig.enableCustomPricing ? dashboardConfig.customEnergyPrices : undefined} 
        />
        </div>
      </TabsContent>

      <TabsContent value="smartmeter" className="animate-fade-in">
        <div id="smartmeter-panel" role="tabpanel" aria-labelledby="smartmeter-tab">
        <SmartMeterIntegration />
        </div>
      </TabsContent>

      <TabsContent value="dashboard" className="animate-fade-in">
        <div id="dashboard-panel" role="tabpanel" aria-labelledby="dashboard-tab">
        <SavingsDashboard 
          data={savingsData} 
          config={dashboardConfig}
          onConfigChange={onConfigChange}
        />
        </div>
      </TabsContent>
    </>
  );
};

export default TabContent;
