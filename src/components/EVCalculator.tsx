
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Car, Fuel, Wrench, Leaf } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface EVCalculatorProps {
  onUpdate: (data: SavingsData['ev']) => void;
}

const EVCalculator: React.FC<EVCalculatorProps> = ({ onUpdate }) => {
  const [milesPerYear, setMilesPerYear] = useState<string>('12000');
  const [currentMPG, setCurrentMPG] = useState<string>('25');
  const [gasPrice, setGasPrice] = useState<string>('3.50');
  const [electricityRate, setElectricityRate] = useState<string>('0.12');
  const [evType, setEVType] = useState<string>('mid-range');
  const [results, setResults] = useState<SavingsData['ev']>({
    vehicleCost: 0,
    fuelSavings: 0,
    maintenanceSavings: 0,
    totalMonthlySavings: 0,
    paybackPeriod: 0,
    tenYearSavings: 0
  });

  const calculateSavings = () => {
    const milesPerYearNum = parseFloat(milesPerYear) || 0;
    const currentMPGNum = parseFloat(currentMPG) || 0;
    const gasPriceNum = parseFloat(gasPrice) || 0;
    const electricityRateNum = parseFloat(electricityRate) || 0;

    // EV specifications based on type
    const evSpecs: { [key: string]: { efficiency: number; cost: number; range: number } } = {
      'economy': { efficiency: 4.0, cost: 30000, range: 250 }, // miles per kWh
      'mid-range': { efficiency: 3.5, cost: 45000, range: 300 },
      'luxury': { efficiency: 3.0, cost: 70000, range: 400 },
      'truck': { efficiency: 2.5, cost: 60000, range: 300 }
    };

    const selectedEV = evSpecs[evType] || evSpecs['mid-range'];

    // Current annual fuel costs
    const annualGallons = milesPerYearNum / currentMPGNum;
    const annualGasCost = annualGallons * gasPriceNum;

    // EV annual electricity costs
    const annualKWh = milesPerYearNum / selectedEV.efficiency;
    const annualElectricityCost = annualKWh * electricityRateNum;

    // Annual fuel savings
    const annualFuelSavings = annualGasCost - annualElectricityCost;

    // Annual maintenance savings (EVs require ~40% less maintenance)
    const annualMaintenanceSavings = 1200; // Typical savings on oil changes, brake pads, etc.

    // Total annual savings
    const totalAnnualSavings = annualFuelSavings + annualMaintenanceSavings;

    // Vehicle cost premium over comparable gas car
    const gasPriceEquivalent = 35000; // Average comparable gas vehicle
    const vehicleCostPremium = selectedEV.cost - gasPriceEquivalent;

    // Payback period (considering federal tax credit)
    const federalTaxCredit = 7500;
    const netCostPremium = Math.max(0, vehicleCostPremium - federalTaxCredit);
    const paybackPeriod = netCostPremium / totalAnnualSavings;

    // 10-year savings
    const tenYearSavings = (totalAnnualSavings * 10) - netCostPremium;

    const newResults = {
      vehicleCost: selectedEV.cost,
      fuelSavings: annualFuelSavings,
      maintenanceSavings: annualMaintenanceSavings,
      totalMonthlySavings: totalAnnualSavings / 12,
      paybackPeriod,
      tenYearSavings
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  useEffect(() => {
    calculateSavings();
  }, [milesPerYear, currentMPG, gasPrice, electricityRate, evType]);

  const getEVDescription = () => {
    const descriptions: { [key: string]: string } = {
      'economy': 'Nissan Leaf, Chevy Bolt',
      'mid-range': 'Tesla Model 3, Hyundai Ioniq 5',
      'luxury': 'Tesla Model S, BMW iX',
      'truck': 'Ford Lightning, Rivian R1T'
    };
    return descriptions[evType] || '';
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-green-500" />
            Electric Vehicle Calculator
          </CardTitle>
          <CardDescription>
            Compare EV costs with your current vehicle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="miles">Annual Miles Driven</Label>
            <Input
              id="miles"
              type="number"
              value={milesPerYear}
              onChange={(e) => setMilesPerYear(e.target.value)}
              placeholder="12000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mpg">Current Vehicle MPG</Label>
            <Input
              id="mpg"
              type="number"
              value={currentMPG}
              onChange={(e) => setCurrentMPG(e.target.value)}
              placeholder="25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gasPrice">Gas Price ($/gallon)</Label>
            <Input
              id="gasPrice"
              type="number"
              step="0.01"
              value={gasPrice}
              onChange={(e) => setGasPrice(e.target.value)}
              placeholder="3.50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricityRate">Electricity Rate ($/kWh)</Label>
            <Input
              id="electricityRate"
              type="number"
              step="0.01"
              value={electricityRate}
              onChange={(e) => setElectricityRate(e.target.value)}
              placeholder="0.12"
            />
          </div>

          <div className="space-y-2">
            <Label>Electric Vehicle Type</Label>
            <Select value={evType} onValueChange={setEVType}>
              <SelectTrigger>
                <SelectValue placeholder="Select EV type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy EV (~$30k)</SelectItem>
                <SelectItem value="mid-range">Mid-Range EV (~$45k)</SelectItem>
                <SelectItem value="luxury">Luxury EV (~$70k)</SelectItem>
                <SelectItem value="truck">Electric Truck (~$60k)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{getEVDescription()}</p>
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
            <Fuel className="w-5 h-5 text-green-500" />
            Your EV Savings Potential
          </CardTitle>
          <CardDescription>
            Financial benefits of switching to electric
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                ${results.totalMonthlySavings.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${results.vehicleCost.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Vehicle Cost</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="flex items-center gap-2">
                <Fuel className="w-4 h-4" />
                Annual Fuel Savings
              </span>
              <span className="font-semibold text-green-600">
                ${results.fuelSavings.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Annual Maintenance Savings
              </span>
              <span className="font-semibold text-green-600">
                ${results.maintenanceSavings.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Payback Period</span>
              <span className="font-semibold">{results.paybackPeriod.toFixed(1)} years</span>
            </div>
            <Progress value={Math.min(100, (7 / results.paybackPeriod) * 100)} className="h-2" />
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              10-Year Net Savings
            </h4>
            <div className="text-2xl font-bold text-green-600">
              ${results.tenYearSavings.toFixed(0)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Including $7,500 federal tax credit
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Environmental Impact</h4>
            <p className="text-sm text-muted-foreground">
              You'll prevent approximately{' '}
              <span className="font-semibold text-green-600">
                {((parseFloat(milesPerYear) / parseFloat(currentMPG)) * 19.6 / 1000).toFixed(1)} tons
              </span>{' '}
              of CO₂ emissions annually.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EVCalculator;
