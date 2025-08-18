import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Fuel, Zap, TrendingUp, RefreshCw, ArrowRight } from 'lucide-react';
import { useFuelPrices } from '@/hooks/useFuelPrices';
import { useToast } from '@/hooks/use-toast';

interface FuelPriceBreakevenProps {
  onElectricityRateUpdate?: (rate: string) => void;
  electricityUnit?: 'pounds' | 'pence';
}

const FuelPriceBreakeven: React.FC<FuelPriceBreakevenProps> = ({
  onElectricityRateUpdate,
  electricityUnit = 'pence'
}) => {
  const { fuelPrices, loading, error, refetch } = useFuelPrices();
  const { toast } = useToast();
  const [customMPG, setCustomMPG] = useState<string>('42');

  const breakEvenCalculation = useMemo(() => {
    if (!fuelPrices) return null;

    const mpg = parseFloat(customMPG) || 42;
    const petrolPricePerLitre = fuelPrices.petrol;
    
    // Convert MPG to miles per litre (1 gallon = 4.546 litres)
    const milesPerLitre = mpg / 4.546;
    
    // Cost per mile for petrol vehicle
    const petrolCostPerMile = petrolPricePerLitre / milesPerLitre;
    
    // Average EV efficiency: 3.5 miles per kWh
    const evMilesPerKWh = 3.5;
    const evKWhPerMile = 1 / evMilesPerKWh;
    
    // Maximum electricity price for EV to be cheaper (per kWh)
    const maxElectricityPricePerKWh = petrolCostPerMile / evKWhPerMile;
    
    return {
      petrolCostPerMile: petrolCostPerMile,
      maxElectricityPricePerKWh: maxElectricityPricePerKWh,
      maxElectricityPricePence: maxElectricityPricePerKWh * 100,
      mpgUsed: mpg
    };
  }, [fuelPrices, customMPG]);

  const handleUseBreakevenRate = () => {
    if (!breakEvenCalculation) return;

    const rate = electricityUnit === 'pence' 
      ? breakEvenCalculation.maxElectricityPricePence.toFixed(1)
      : breakEvenCalculation.maxElectricityPricePerKWh.toFixed(3);

    onElectricityRateUpdate?.(rate);
    
    toast({
      title: "Rate updated!",
      description: `Set to break-even rate: ${rate} ${electricityUnit === 'pence' ? 'p' : '£'}/kWh`,
    });
  };

  const formatCurrency = (amount: number, decimals: number = 2) => {
    return `£${amount.toFixed(decimals)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading Fuel Prices...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error || !fuelPrices) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="w-5 h-5 text-amber-500" />
            UK Fuel Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Unable to load current fuel prices. Using fallback estimates.
            </AlertDescription>
          </Alert>
          <Button onClick={refetch} variant="outline" className="mt-3" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          UK Fuel Prices & EV Break-Even Calculator
        </CardTitle>
        <CardDescription>
          Current UK averages and the max electricity price for EVs to be cheaper
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Fuel Prices */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Fuel className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">Petrol</span>
            </div>
            <div className="text-2xl font-bold text-amber-900">
              {formatCurrency(fuelPrices.petrol, 3)}/L
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Fuel className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Diesel</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(fuelPrices.diesel, 3)}/L
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <span>Source: {fuelPrices.source}</span>
          {fuelPrices.date && <span> • Updated: {fuelPrices.date}</span>}
          {fuelPrices.message && <span> • {fuelPrices.message}</span>}
        </div>

        <Separator />

        {/* Break-Even Calculator */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">EV Break-Even Calculator</h3>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="custom-mpg">Your vehicle's MPG (or use 42 for UK average)</Label>
              <Input
                id="custom-mpg"
                type="number"
                value={customMPG}
                onChange={(e) => setCustomMPG(e.target.value)}
                placeholder="42"
                min="1"
                max="100"
                className="w-full"
              />
            </div>

            {breakEvenCalculation && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 space-y-3">
                <div className="text-sm text-green-800">
                  <div className="flex items-center justify-between">
                    <span>Petrol cost per mile:</span>
                    <span className="font-medium">
                      {formatCurrency(breakEvenCalculation.petrolCostPerMile, 3)}
                    </span>
                  </div>
                </div>

                <Separator className="bg-green-200" />

                <div className="space-y-2">
                  <div className="text-sm font-medium text-green-900">
                    For an EV to be cheaper, find charging that costs no more than:
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-900">
                      {electricityUnit === 'pence' 
                        ? `${breakEvenCalculation.maxElectricityPricePence.toFixed(1)}p/kWh`
                        : `${formatCurrency(breakEvenCalculation.maxElectricityPricePerKWh, 3)}/kWh`
                      }
                    </div>
                    <div className="text-xs text-green-700 mt-1">
                      Based on {breakEvenCalculation.mpgUsed} MPG and 3.5 miles/kWh EV efficiency
                    </div>
                  </div>
                </div>

                {onElectricityRateUpdate && (
                  <Button 
                    onClick={handleUseBreakevenRate}
                    className="w-full"
                    size="sm"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Use This Rate in Calculator
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Button onClick={refetch} variant="outline" size="sm" className="w-full">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Prices
        </Button>
      </CardContent>
    </Card>
  );
};

export default FuelPriceBreakeven;