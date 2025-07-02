
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Thermometer, PoundSterling, Calendar, TrendingUp } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import { formatCurrency } from '@/utils/currency';
import { EnergyPricesConfig } from '@/components/dashboard/types';

interface HeatPumpCalculatorProps {
  onUpdate: (data: SavingsData['heatPump']) => void;
  energyPrices?: EnergyPricesConfig;
}

const HeatPumpCalculator: React.FC<HeatPumpCalculatorProps> = ({ onUpdate, energyPrices }) => {
  const [homeSize, setHomeSize] = useState<string>('185'); // m² instead of sq ft
  const [currentHeatingType, setCurrentHeatingType] = useState<string>('gas');
  const [monthlyHeatingBill, setMonthlyHeatingBill] = useState<string>('80');
  const [heatPumpType, setHeatPumpType] = useState<string>('air_source');
  const [results, setResults] = useState<SavingsData['heatPump']>({
    systemCost: 0,
    monthlySavings: 0,
    paybackPeriod: 0,
    twentyYearSavings: 0
  });

  const calculateSavings = () => {
    const homeSizeNum = parseFloat(homeSize) || 0;
    const monthlyBillNum = parseFloat(monthlyHeatingBill) || 0;

    // System cost based on type and home size (UK prices)
    const systemCosts: { [key: string]: number } = {
      'air_source': 8000 + (homeSizeNum * 35), // £8k base + £35/m²
      'ground_source': 12000 + (homeSizeNum * 45), // £12k base + £45/m²
      'hybrid': 6000 + (homeSizeNum * 25) // £6k base + £25/m²
    };

    const systemCost = systemCosts[heatPumpType] || systemCosts['air_source'];

    // Efficiency multipliers for different heat pump types
    const efficiencyMultipliers: { [key: string]: number } = {
      'air_source': 3.2, // COP of 3.2
      'ground_source': 4.0, // COP of 4.0
      'hybrid': 2.8 // COP of 2.8
    };

    const efficiency = efficiencyMultipliers[heatPumpType] || 3.2;

    // Current heating costs per unit (use custom prices if available)
    const heatingCosts: { [key: string]: number } = {
      'gas': energyPrices?.gas || 0.06,
      'oil': energyPrices?.oil || 0.09,
      'electric': energyPrices?.electricity || 0.30,
      'lpg': energyPrices?.lpg || 0.08
    };

    const currentCostPerKwh = heatingCosts[currentHeatingType] || 0.06;
    
    // Heat pump electricity cost (use custom price if available)
    const electricityRate = energyPrices?.electricity || 0.30;
    const heatPumpCostPerKwh = electricityRate / efficiency;
    
    // Calculate monthly savings
    const currentMonthlyKwh = monthlyBillNum / currentCostPerKwh;
    const heatPumpMonthlyCost = currentMonthlyKwh * heatPumpCostPerKwh;
    const monthlySavings = Math.max(0, monthlyBillNum - heatPumpMonthlyCost);
    
    // Payback period in years
    const paybackPeriod = systemCost / (monthlySavings * 12);
    
    // 20-year savings (accounting for maintenance)
    const twentyYearSavings = (monthlySavings * 12 * 20) - systemCost - (systemCost * 0.1); // 10% maintenance over 20 years

    const newResults = {
      systemCost,
      monthlySavings,
      paybackPeriod,
      twentyYearSavings
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  useEffect(() => {
    calculateSavings();
  }, [homeSize, currentHeatingType, monthlyHeatingBill, heatPumpType, energyPrices]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-blue-500" />
            Heat Pump Calculator
          </CardTitle>
          <CardDescription>
            Enter your heating details to calculate potential heat pump savings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="homeSize">Home Size (m²)</Label>
            <Input
              id="homeSize"
              type="number"
              value={homeSize}
              onChange={(e) => setHomeSize(e.target.value)}
              placeholder="185"
            />
          </div>

          <div className="space-y-2">
            <Label>Current Heating Type</Label>
            <Select value={currentHeatingType} onValueChange={setCurrentHeatingType}>
              <SelectTrigger>
                <SelectValue placeholder="Select heating type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Gas Boiler</SelectItem>
                <SelectItem value="oil">Oil Boiler</SelectItem>
                <SelectItem value="electric">Electric Heating</SelectItem>
                <SelectItem value="lpg">LPG Boiler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyBill">Monthly Heating Bill (£)</Label>
            <Input
              id="monthlyBill"
              type="number"
              value={monthlyHeatingBill}
              onChange={(e) => setMonthlyHeatingBill(e.target.value)}
              placeholder="80"
            />
          </div>

          <div className="space-y-2">
            <Label>Heat Pump Type</Label>
            <Select value={heatPumpType} onValueChange={setHeatPumpType}>
              <SelectTrigger>
                <SelectValue placeholder="Select heat pump type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="air_source">Air Source Heat Pump</SelectItem>
                <SelectItem value="ground_source">Ground Source Heat Pump</SelectItem>
                <SelectItem value="hybrid">Hybrid Heat Pump</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculateSavings} className="w-full">
            Recalculate Savings
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PoundSterling className="w-5 h-5 text-green-500" />
            Your Heat Pump Savings Potential
          </CardTitle>
          <CardDescription>
            Based on your inputs, here's your potential savings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(Math.round(results.monthlySavings))}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(Math.round(results.systemCost))}
              </div>
              <div className="text-sm text-muted-foreground">System Cost</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Payback Period
              </span>
              <span className="font-semibold">{results.paybackPeriod.toFixed(1)} years</span>
            </div>
            <Progress value={Math.min(100, (10 / results.paybackPeriod) * 100)} className="h-2" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                20-Year Net Savings
              </span>
              <span className="font-semibold text-green-600">
                {formatCurrency(Math.round(results.twentyYearSavings))}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Total savings after system pays for itself
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Environmental Impact</h4>
            <p className="text-sm text-muted-foreground">
              Your heat pump would reduce CO₂ emissions by approximately{' '}
              <span className="font-semibold text-green-600">
                {(results.monthlySavings * 12 * 20 / 200).toFixed(1)} tonnes
              </span>{' '}
              over 20 years compared to gas heating.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatPumpCalculator;
