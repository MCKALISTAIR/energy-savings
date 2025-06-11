
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SolarCalculator from '@/components/SolarCalculator';
import BatteryCalculator from '@/components/BatteryCalculator';
import EVCalculator from '@/components/EVCalculator';
import HeatPumpCalculator from '@/components/HeatPumpCalculator';
import SavingsDashboard from '@/components/SavingsDashboard';
import DatabaseHouseSelector from '@/components/DatabaseHouseSelector';
import DatabaseSystemManager from '@/components/DatabaseSystemManager';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardConfig } from '@/components/dashboard/types';
import { getDefaultConfig } from '@/components/dashboard/defaultConfig';
import { Zap, Battery, Car, BarChart3, Settings, LogOut, User, Thermometer } from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';

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
  const { user, signOut } = useAuth();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with user info moved to top-right */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Renewable Energy Savings Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how much you can save with solar panels, battery storage, electric vehicles, and heat pumps. 
              Make informed decisions about your sustainable energy future.
            </p>
          </div>
          
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ProfileModal>
                <User className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              </ProfileModal>
              {user?.email}
            </div>
            <LogOut 
              className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" 
              onClick={signOut}
            />
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="systems" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            
            {/* Dashboard Customize Button with fade-in animation */}
            {activeTab === 'dashboard' && (
              <div className="animate-fade-in">
                <DashboardSettings config={dashboardConfig} onConfigChange={setDashboardConfig} />
              </div>
            )}
          </div>

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
              onConfigChange={setDashboardConfig}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
