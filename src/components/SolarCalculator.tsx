
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sun, PoundSterling, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';

interface SolarCalculatorProps {
  onUpdate: (data: SavingsData['solar']) => void;
  energyPrices?: EnergyPricesConfig;
}

const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onUpdate, energyPrices }) => {
  const [homeSize, setHomeSize] = useState<string>('');
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [sunlightHours, setSunlightHours] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [results, setResults] = useState<SavingsData['solar']>({
    monthlyEnergyCost: 0,
    systemCost: 0,
    monthlySavings: 0,
    paybackPeriod: 0,
    twentyYearSavings: 0
  });

  const calculateSavings = () => {
    const homeSizeNum = parseFloat(homeSize) || 0;
    const monthlyBillNum = parseFloat(monthlyBill) || 0;
    const sunlightHoursNum = parseFloat(sunlightHours) || 0;

    // Location multiplier for solar efficiency in UK
    const locationMultipliers: { [key: string]: number } = {
      'excellent': 1.1, // Southern England
      'good': 1.0, // Central England
      'moderate': 0.9, // Northern England
      'poor': 0.7 // Scotland/Northern areas
    };

    const locationMultiplier = locationMultipliers[location] || 1.0;

    // Estimate system size needed (kW) based on home size and monthly bill
    const estimatedSystemSize = (homeSizeNum * 0.03) + (monthlyBillNum * 0.04);
    
    // System cost calculation (£1,500-2,000 per kW in UK)
    const systemCost = estimatedSystemSize * 1750; // £1,750 per kW average
    
    // Monthly energy production (kWh)
    const monthlyProduction = estimatedSystemSize * sunlightHoursNum * 30 * locationMultiplier;
    
    // Use custom electricity rate or default
    const electricityRate = energyPrices?.electricity || 0.30;
    const monthlyEnergyValue = monthlyProduction * electricityRate;
    
    // Monthly savings (typically 60-80% of bill can be offset in UK)
    const offsetPercentage = Math.min(0.75, monthlyEnergyValue / monthlyBillNum);
    const monthlySavings = monthlyBillNum * offsetPercentage;
    
    // Payback period in years
    const paybackPeriod = systemCost / (monthlySavings * 12);
    
    // 20-year savings (accounting for slight degradation)
    const twentyYearSavings = (monthlySavings * 12 * 20 * 0.95) - systemCost;

    const newResults = {
      monthlyEnergyCost: monthlyBillNum,
      systemCost,
      monthlySavings,
      paybackPeriod,
      twentyYearSavings
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  // Check if any data has been entered
  const hasData = homeSize || monthlyBill || sunlightHours || location;

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-yellow-500" />
            Solar Panel Calculator
          </CardTitle>
          <CardDescription>
            Enter your home details to calculate potential solar savings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="homeSize">Home Size (m²)</Label>
            <Input
              id="homeSize"
              type="number"
              min="0"
              value={homeSize}
              onChange={(e) => setHomeSize(Math.max(0, parseFloat(e.target.value) || 0).toString())}
              placeholder="185"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyBill">Monthly Electric Bill (£)</Label>
            <Input
              id="monthlyBill"
              type="number"
              min="0"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Math.max(0, parseFloat(e.target.value) || 0).toString())}
              placeholder="120"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sunlight">Daily Sunlight Hours</Label>
            <Input
              id="sunlight"
              type="number"
              step="0.1"
              min="0"
              value={sunlightHours}
              onChange={(e) => setSunlightHours(Math.max(0, parseFloat(e.target.value) || 0).toString())}
              placeholder="3.5"
            />
          </div>

          <div className="space-y-2">
            <Label>Location Solar Rating</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent (Southern England)</SelectItem>
                <SelectItem value="good">Good (Central England)</SelectItem>
                <SelectItem value="moderate">Moderate (Northern England)</SelectItem>
                <SelectItem value="poor">Poor (Scotland/Wales)</SelectItem>
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
            Your Solar Savings Potential
          </CardTitle>
          <CardDescription>
            Based on your inputs, here's your potential savings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasData ? (
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Please fill in the solar panel details to see your potential environmental impact.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    £{results.monthlySavings.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    £{results.systemCost.toFixed(0)}
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
                    £{results.twentyYearSavings.toFixed(0)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Total savings after system pays for itself
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Environmental Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Your solar system would offset approximately{' '}
                  <span className="font-semibold text-green-600">
                    {(results.monthlySavings * 12 * 20 / 120).toFixed(1)} tonnes
                  </span>{' '}
                  of CO₂ over 20 years.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculator;
