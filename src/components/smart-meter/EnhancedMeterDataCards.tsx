import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Zap, Clock, TrendingUp, Flame, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOctopusEnergy } from '@/hooks/useOctopusEnergy';

interface MeterData {
  currentUsage: number;
  dailyUsage: number;
  dailyCost: number;
  tariffRate: number;
}

interface EnhancedMeterDataCardsProps {
  electricityData: MeterData;
  gasData?: MeterData;
  onRefresh?: () => void;
  loading?: boolean;
}

const EnhancedMeterDataCards: React.FC<EnhancedMeterDataCardsProps> = ({ 
  electricityData, 
  gasData, 
  onRefresh, 
  loading 
}) => {
  const { calculateDailyCost, getCurrentTariffRates } = useOctopusEnergy();
  const [electricityCost, setElectricityCost] = useState(electricityData.dailyCost);
  const [gasCost, setGasCost] = useState(gasData?.dailyCost || 0);

  useEffect(() => {
    const updateCosts = async () => {
      const elecCost = await calculateDailyCost('electricity');
      const gasCostCalc = gasData ? await calculateDailyCost('gas') : 0;
      
      if (elecCost) setElectricityCost(elecCost);
      if (gasCostCalc) setGasCost(gasCostCalc);
    };

    updateCosts();
  }, [electricityData, gasData]);

  const FuelDataCards = ({ data, fuelType }: { data: MeterData; fuelType: 'electricity' | 'gas' }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Current Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.currentUsage.toFixed(2)} {fuelType === 'electricity' ? 'kW' : 'm³/h'}
          </div>
          <p className="text-xs text-muted-foreground">Right now</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {fuelType === 'electricity' ? (
              <Zap className="w-4 h-4 text-yellow-500" />
            ) : (
              <Flame className="w-4 h-4 text-orange-500" />
            )}
            Daily Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.dailyUsage.toFixed(1)} {fuelType === 'electricity' ? 'kWh' : 'm³'}
          </div>
          <p className="text-xs text-muted-foreground">Today so far</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Daily Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            £{(fuelType === 'electricity' ? electricityCost : gasCost).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Today so far</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            Tariff Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(data.tariffRate * 100).toFixed(1)}p</div>
          <p className="text-xs text-muted-foreground">
            Per {fuelType === 'electricity' ? 'kWh' : 'm³'}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Live Energy Data</h3>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        )}
      </div>

      {gasData ? (
        <Tabs defaultValue="electricity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="electricity" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Electricity
            </TabsTrigger>
            <TabsTrigger value="gas" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Gas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="electricity" className="mt-4">
            <FuelDataCards data={electricityData} fuelType="electricity" />
          </TabsContent>
          
          <TabsContent value="gas" className="mt-4">
            <FuelDataCards data={gasData} fuelType="gas" />
          </TabsContent>
        </Tabs>
      ) : (
        <FuelDataCards data={electricityData} fuelType="electricity" />
      )}
    </div>
  );
};

export default EnhancedMeterDataCards;