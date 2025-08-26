import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Fuel, Zap, TrendingUp, RefreshCw, ChevronDown, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFuelPrices } from '@/hooks/useFuelPrices';

interface FuelPriceBreakevenProps {
  electricityUnit?: 'pounds' | 'pence';
}

const FuelPriceBreakeven: React.FC<FuelPriceBreakevenProps> = ({
  electricityUnit = 'pence'
}) => {
  const { fuelPrices, loading, error, refetch } = useFuelPrices();
  const [customMPG, setCustomMPG] = useState<string>('42');
  const [selectedFuel, setSelectedFuel] = useState<'petrol' | 'diesel'>('petrol');
  const [isExpanded, setIsExpanded] = useState(false);

  const breakEvenCalculation = useMemo(() => {
    if (!fuelPrices) return null;

    const mpg = parseFloat(customMPG) || 42;
    const fuelPricePerLitre = selectedFuel === 'petrol' ? fuelPrices.petrol : fuelPrices.diesel;
    
    // Convert MPG to miles per litre (1 gallon = 4.546 litres)
    const milesPerLitre = mpg / 4.546;
    
    // Cost per mile for fuel vehicle
    const fuelCostPerMile = fuelPricePerLitre / milesPerLitre;
    
    // Average EV efficiency: 3.5 miles per kWh
    const evMilesPerKWh = 3.5;
    const evKWhPerMile = 1 / evMilesPerKWh;
    
    // Maximum electricity price for EV to be cheaper (per kWh)
    const maxElectricityPricePerKWh = fuelCostPerMile / evKWhPerMile;
    
    return {
      fuelCostPerMile: fuelCostPerMile,
      maxElectricityPricePerKWh: maxElectricityPricePerKWh,
      maxElectricityPricePence: maxElectricityPricePerKWh * 100,
      mpgUsed: mpg,
      selectedFuelType: selectedFuel
    };
  }, [fuelPrices, customMPG, selectedFuel]);


  const formatCurrency = (amount: number, decimals: number = 2) => {
    return `£${amount.toFixed(decimals)}`;
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  UK Fuel Prices & EV Break-Even Calculator
                </CardTitle>
                <CardDescription>
                  Current UK averages and the max electricity price for EVs to be cheaper
                </CardDescription>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                <span>Loading fuel prices...</span>
              </div>
            )}

            {error || !fuelPrices ? (
              <Alert>
                <AlertDescription>
                  Unable to load current fuel prices. Using fallback estimates.
                </AlertDescription>
                <Button onClick={refetch} variant="outline" className="mt-3" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </Alert>
            ) : (
              <>
                {/* Current Fuel Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSelectedFuel('petrol')}
                    className={`text-center p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedFuel === 'petrol' 
                        ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-400' 
                        : 'bg-amber-50 border-amber-200 hover:bg-amber-75'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Fuel className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-900">Petrol</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-900">
                      {formatCurrency(fuelPrices.petrol, 3)}/L
                    </div>
                    {selectedFuel === 'petrol' && (
                      <div className="text-xs text-amber-700 mt-1 font-medium">Selected</div>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setSelectedFuel('diesel')}
                    className={`text-center p-4 rounded-lg border transition-all cursor-pointer ${
                      selectedFuel === 'diesel' 
                        ? 'bg-gray-100 border-gray-300 ring-2 ring-gray-400' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-75'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Fuel className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">Diesel</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(fuelPrices.diesel, 3)}/L
                    </div>
                    {selectedFuel === 'diesel' && (
                      <div className="text-xs text-gray-700 mt-1 font-medium">Selected</div>
                    )}
                  </button>
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm p-4">
                          <div className="space-y-2 text-sm">
                            <p className="font-medium">How charging costs are calculated:</p>
                            <ul className="space-y-1 list-disc list-inside">
                              <li><strong>Home charging:</strong> Electricity rate × EV efficiency (assumed 3.5 miles/kWh)</li>
                              <li><strong>Public charging:</strong> Higher rates applied based on your usage frequency</li>
                              <li><strong>Battery capacity:</strong> Affects charging patterns and costs per session</li>
                              <li><strong>Annual costs:</strong> (Miles ÷ Efficiency) × Blended charging rate</li>
                            </ul>
                            <p className="text-xs text-muted-foreground">
                              Calculations include both home and public charging based on your usage patterns.
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                            <span>{selectedFuel === 'petrol' ? 'Petrol' : 'Diesel'} cost per mile:</span>
                            <span className="font-medium">
                              {formatCurrency(breakEvenCalculation.fuelCostPerMile, 3)}
                            </span>
                          </div>
                        </div>

                        <Separator className="bg-green-200" />

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-green-900">
                            For an EV to be cheaper than {selectedFuel}, find charging that costs no more than:
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
                      </div>
                    )}
                  </div>
                </div>

                <Button onClick={refetch} variant="outline" size="sm" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Prices
                </Button>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default FuelPriceBreakeven;