
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SolarCalculator from '@/components/SolarCalculator';
import BatteryCalculator from '@/components/BatteryCalculator';
import EVCalculator from '@/components/EVCalculator';
import SavingsDashboard from '@/components/SavingsDashboard';
import DatabaseHouseSelector from '@/components/DatabaseHouseSelector';
import DatabaseSystemManager from '@/components/DatabaseSystemManager';
import { useAuth } from '@/contexts/AuthContext';
import { Zap, Battery, Car, BarChart3, Settings, LogOut, User } from 'lucide-react';

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
}

const Index = () => {
  const { user, signOut } = useAuth();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with user info and sign out */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Renewable Energy Savings Calculator
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover how much you can save with solar panels, battery storage, and electric vehicles. 
              Make informed decisions about your sustainable energy future.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {user?.email}
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="systems" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
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
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="dashboard" className="animate-fade-in">
            <SavingsDashboard data={savingsData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
