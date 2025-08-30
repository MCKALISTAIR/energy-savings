import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/layout/Header';
import TabNavigation from '@/components/layout/TabNavigation';
import TabContent from '@/components/layout/TabContent';
import SubtleSavePrompt from '@/components/SubtleSavePrompt';
import { DashboardConfig } from '@/components/dashboard/types';
import { getDefaultConfig } from '@/components/dashboard/defaultConfig';
import { useAuth } from '@/contexts/AuthContext';

export interface SavingsData {
  solar: {
    monthlyEnergyCost: number;
    systemCost: number;
    monthlySavings: number;
    paybackPeriod: number;
    twentyYearSavings: number;
  };
  battery: {
    systemCost: number;
    monthlySavings: number;
    paybackPeriod: number;
    twentyYearSavings: number;
  };
  ev: {
    vehicleCost: number;
    fuelSavings: number;
    maintenanceSavings: number;
    totalMonthlySavings: number;
    paybackPeriod: number;
    tenYearSavings: number;
  };
  heatPump: {
    systemCost: number;
    monthlySavings: number;
    paybackPeriod: number;
    twentyYearSavings: number;
  };
}

const Index = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('systems');
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(getDefaultConfig());
  const [savingsData, setSavingsData] = useState<SavingsData>({
    solar: {
      monthlyEnergyCost: 0,
      systemCost: 0,
      monthlySavings: 0,
      paybackPeriod: 0,
      twentyYearSavings: 0
    },
    battery: {
      systemCost: 0,
      monthlySavings: 0,
      paybackPeriod: 0,
      twentyYearSavings: 0
    },
    ev: {
      vehicleCost: 0,
      fuelSavings: 0,
      maintenanceSavings: 0,
      totalMonthlySavings: 0,
      paybackPeriod: 0,
      tenYearSavings: 0
    },
    heatPump: {
      systemCost: 0,
      monthlySavings: 0,
      paybackPeriod: 0,
      twentyYearSavings: 0
    }
  });

  const updateSolarData = (data: SavingsData['solar']) => {
    setSavingsData(prev => ({ ...prev, solar: data }));
  };

  const updateBatteryData = (data: SavingsData['battery']) => {
    setSavingsData(prev => ({ ...prev, battery: data }));
  };

  const updateEVData = (data: SavingsData['ev']) => {
    setSavingsData(prev => ({ ...prev, ev: data }));
  };

  const updateHeatPumpData = (data: SavingsData['heatPump']) => {
    setSavingsData(prev => ({ ...prev, heatPump: data }));
  };

  // Check if user has calculated any savings data
  const hasCalculatedData = 
    savingsData.solar.monthlySavings > 0 || 
    savingsData.battery.monthlySavings > 0 || 
    savingsData.ev.totalMonthlySavings > 0 || 
    savingsData.heatPump.monthlySavings > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 ${isMobile ? 'p-2' : 'p-4'}`} role="main">
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Show subtle save prompt for unauthenticated users with calculated data */}
        {!user && (
          <SubtleSavePrompt 
            hasData={hasCalculatedData}
            dataDescription="your renewable energy calculations"
          />
        )}

        <Tabs defaultValue="systems" value={activeTab} onValueChange={setActiveTab} className="w-full" aria-label="Renewable energy system calculators">
          <TabNavigation 
            activeTab={activeTab}
            dashboardConfig={dashboardConfig}
            onConfigChange={setDashboardConfig}
          />

          <TabContent
            activeTab={activeTab}
            savingsData={savingsData}
            dashboardConfig={dashboardConfig}
            onConfigChange={setDashboardConfig}
            updateSolarData={updateSolarData}
            updateBatteryData={updateBatteryData}
            updateEVData={updateEVData}
            updateHeatPumpData={updateHeatPumpData}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
