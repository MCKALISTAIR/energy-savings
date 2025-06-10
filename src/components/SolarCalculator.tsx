
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Sun, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface SolarCalculatorProps {
  onUpdate: (data: SavingsData['solar']) => void;
}

const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onUpdate }) => {
  const [homeSize, setHomeSize] = useState<string>('2000');
  const [monthlyBill, setMonthlyBill] = useState<string>('150');
  const [sunlightHours, setSunlightHours] = useState<string>('5.5');
  const [location, setLocation] = useState<string>('moderate');
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

    // Location multiplier for solar efficiency
    const locationMultipliers: { [key: string]: number } = {
      'excellent': 1.2,
      'good': 1.0,
      'moderate': 0.8,
      'poor': 0.6
    };

    const locationMultiplier = locationMultipliers[location] || 1.0;

    // Estimate system size needed (kW) based on home size and monthly bill
    const estimatedSystemSize = (homeSizeNum * 0.006) + (monthlyBillNum * 0.05);
    
    // System cost calculation ($3 per watt average)
    const systemCost = estimatedSystemSize * 1000 * 3;
    
    // Monthly energy production (kWh)
    const monthlyProduction = estimatedSystemSize * sunlightHoursNum * 30 * locationMultiplier;
    
    // Assuming $0.12 per kWh average electricity rate
    const monthlyEnergyValue = monthlyProduction * 0.12;
    
    // Monthly savings (typically 70-90% of bill can be offset)
    const offsetPercentage = Math.min(0.85, monthlyEnergyValue / monthlyBillNum);
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

  useEffect(() => {
    calculateSavings();
  }, [homeSize, monthlyBill, sunlightHours, location]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
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
            <Label htmlFor="homeSize">Home Size (sq ft)</Label>
            <Input
              id="homeSize"
              type="number"
              value={homeSize}
              onChange={(e) => setHomeSize(e.target.value)}
              placeholder="2000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyBill">Monthly Electric Bill ($)</Label>
            <Input
              id="monthlyBill"
              type="number"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(e.target.value)}
              placeholder="150"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sunlight">Daily Sunlight Hours</Label>
            <Input
              id="sunlight"
              type="number"
              step="0.1"
              value={sunlightHours}
              onChange={(e) => setSunlightHours(e.target.value)}
              placeholder="5.5"
            />
          </div>

          <div className="space-y-2">
            <Label>Location Solar Rating</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent (Southwest US)</SelectItem>
                <SelectItem value="good">Good (Most of US)</SelectItem>
                <SelectItem value="moderate">Moderate (Northern States)</SelectItem>
                <SelectItem value="poor">Poor (Very cloudy regions)</SelectItem>
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
            <DollarSign className="w-5 h-5 text-green-500" />
            Your Solar Savings Potential
          </CardTitle>
          <CardDescription>
            Based on your inputs, here's your potential savings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${results.monthlySavings.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${results.systemCost.toFixed(0)}
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
                ${results.twentyYearSavings.toFixed(0)}
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
                {(results.monthlySavings * 12 * 20 / 120).toFixed(1)} tons
              </span>{' '}
              of CO₂ over 20 years.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculator;
