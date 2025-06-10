
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Battery, Zap, Shield, TrendingUp } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface BatteryCalculatorProps {
  onUpdate: (data: SavingsData['battery']) => void;
}

const BatteryCalculator: React.FC<BatteryCalculatorProps> = ({ onUpdate }) => {
  const [monthlyBill, setMonthlyBill] = useState<string>('150');
  const [peakUsage, setPeakUsage] = useState<string>('30');
  const [outageFrequency, setOutageFrequency] = useState<string>('low');
  const [batterySize, setBatterySize] = useState<string>('13.5');
  const [results, setResults] = useState<SavingsData['battery']>({
    systemCost: 0,
    monthlySavings: 0,
    paybackPeriod: 0,
    twentyYearSavings: 0
  });

  const calculateSavings = () => {
    const monthlyBillNum = parseFloat(monthlyBill) || 0;
    const peakUsageNum = parseFloat(peakUsage) || 0;
    const batterySizeNum = parseFloat(batterySize) || 0;

    // Battery system cost (including installation)
    const costPerKWh = 1200; // Average cost per kWh of battery storage
    const systemCost = batterySizeNum * costPerKWh + 3000; // Base installation cost

    // Peak hour savings (assuming time-of-use rates)
    const peakRateDiff = 0.15; // Difference between peak and off-peak rates
    const dailyPeakSavings = Math.min(peakUsageNum, batterySizeNum) * peakRateDiff;
    const monthlyPeakSavings = dailyPeakSavings * 30;

    // Grid independence benefit (reduced demand charges)
    const demandChargeSavings = monthlyBillNum * 0.1; // Typical 10% of bill from demand charges

    // Total monthly savings
    const monthlySavings = monthlyPeakSavings + demandChargeSavings;

    // Payback period
    const paybackPeriod = systemCost / (monthlySavings * 12);

    // 20-year savings (batteries typically last 15-20 years)
    const twentyYearSavings = (monthlySavings * 12 * 18) - systemCost; // 18 year lifespan

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
  }, [monthlyBill, peakUsage, outageFrequency, batterySize]);

  const getOutageValue = () => {
    const values: { [key: string]: string } = {
      'low': '$500',
      'medium': '$1,500',
      'high': '$3,000'
    };
    return values[outageFrequency] || '$500';
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-blue-500" />
            Battery Storage Calculator
          </CardTitle>
          <CardDescription>
            Calculate savings from home battery storage system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Label htmlFor="peakUsage">Peak Hour Daily Usage (kWh)</Label>
            <Input
              id="peakUsage"
              type="number"
              value={peakUsage}
              onChange={(e) => setPeakUsage(e.target.value)}
              placeholder="30"
            />
            <p className="text-xs text-muted-foreground">
              Typical peak hours: 4-9 PM weekdays
            </p>
          </div>

          <div className="space-y-2">
            <Label>Power Outage Frequency</Label>
            <Select value={outageFrequency} onValueChange={setOutageFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select outage frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (1-2 per year)</SelectItem>
                <SelectItem value="medium">Medium (3-5 per year)</SelectItem>
                <SelectItem value="high">High (6+ per year)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batterySize">Battery Capacity (kWh)</Label>
            <Select value={batterySize} onValueChange={setBatterySize}>
              <SelectTrigger>
                <SelectValue placeholder="Select battery size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 kWh (Small home)</SelectItem>
                <SelectItem value="13.5">13.5 kWh (Tesla Powerwall)</SelectItem>
                <SelectItem value="20">20 kWh (Large home)</SelectItem>
                <SelectItem value="27">27 kWh (Very large home)</SelectItem>
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
            <Zap className="w-5 h-5 text-green-500" />
            Your Battery Savings
          </CardTitle>
          <CardDescription>
            Financial benefits and energy independence
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${results.monthlySavings.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                ${results.systemCost.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">System Cost</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Payback Period</span>
              <span className="font-semibold">{results.paybackPeriod.toFixed(1)} years</span>
            </div>
            <Progress value={Math.min(100, (15 / results.paybackPeriod) * 100)} className="h-2" />
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
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Backup Power Value
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Estimated annual value of avoiding outages: <span className="font-semibold">{getOutageValue()}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Based on avoided food spoilage, lost productivity, and comfort
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{batterySize} kWh</div>
              <div className="text-xs text-muted-foreground">Backup Capacity</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">
                {(parseFloat(batterySize) / 5).toFixed(0)}h
              </div>
              <div className="text-xs text-muted-foreground">Backup Runtime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatteryCalculator;
