
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
  const [milesPerYear, setMilesPerYear] = useState<string>('10000'); // UK average lower
  const [currentMPG, setCurrentMPG] = useState<string>('40'); // UK cars more efficient
  const [petrolPrice, setPetrolPrice] = useState<string>('1.45'); // UK petrol price per litre
  const [electricityRate, setElectricityRate] = useState<string>('0.30'); // UK electricity rate
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
    const petrolPriceNum = parseFloat(petrolPrice) || 0;
    const electricityRateNum = parseFloat(electricityRate) || 0;

    // EV specifications based on type (UK market)
    const evSpecs: { [key: string]: { efficiency: number; cost: number; range: number } } = {
      'economy': { efficiency: 4.5, cost: 25000, range: 200 }, // miles per kWh
      'mid-range': { efficiency: 4.0, cost: 35000, range: 250 },
      'luxury': { efficiency: 3.5, cost: 55000, range: 300 },
      'truck': { efficiency: 3.0, cost: 50000, range: 250 }
    };

    const selectedEV = evSpecs[evType] || evSpecs['mid-range'];

    // Current annual fuel costs (convert MPG to miles per litre)
    const milesPerLitre = currentMPGNum / 4.546; // 1 gallon = 4.546 litres
    const annualLitres = milesPerYearNum / milesPerLitre;
    const annualPetrolCost = annualLitres * petrolPriceNum;

    // EV annual electricity costs
    const annualKWh = milesPerYearNum / selectedEV.efficiency;
    const annualElectricityCost = annualKWh * electricityRateNum;

    // Annual fuel savings
    const annualFuelSavings = annualPetrolCost - annualElectricityCost;

    // Annual maintenance savings (EVs require ~50% less maintenance in UK)
    const annualMaintenanceSavings = 800; // Typical UK savings

    // Total annual savings
    const totalAnnualSavings = annualFuelSavings + annualMaintenanceSavings;

    // Vehicle cost premium over comparable petrol car
    const petrolCarEquivalent = 28000; // Average comparable petrol vehicle in UK
    const vehicleCostPremium = selectedEV.cost - petrolCarEquivalent;

    // Payback period (considering UK EV grants where applicable)
    const evGrant = selectedEV.cost <= 35000 ? 2500 : 0; // UK EV grant for cars under £35k
    const netCostPremium = Math.max(0, vehicleCostPremium - evGrant);
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
  }, [milesPerYear, currentMPG, petrolPrice, electricityRate, evType]);

  const getEVDescription = () => {
    const descriptions: { [key: string]: string } = {
      'economy': 'Nissan Leaf, MG4',
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
              placeholder="10000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mpg">Current Vehicle MPG</Label>
            <Input
              id="mpg"
              type="number"
              value={currentMPG}
              onChange={(e) => setCurrentMPG(e.target.value)}
              placeholder="40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="petrolPrice">Petrol Price (£/litre)</Label>
            <Input
              id="petrolPrice"
              type="number"
              step="0.01"
              value={petrolPrice}
              onChange={(e) => setPetrolPrice(e.target.value)}
              placeholder="1.45"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="electricityRate">Electricity Rate (£/kWh)</Label>
            <Input
              id="electricityRate"
              type="number"
              step="0.01"
              value={electricityRate}
              onChange={(e) => setElectricityRate(e.target.value)}
              placeholder="0.30"
            />
          </div>

          <div className="space-y-2">
            <Label>Electric Vehicle Type</Label>
            <Select value={evType} onValueChange={setEVType}>
              <SelectTrigger>
                <SelectValue placeholder="Select EV type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy EV (~£25k)</SelectItem>
                <SelectItem value="mid-range">Mid-Range EV (~£35k)</SelectItem>
                <SelectItem value="luxury">Luxury EV (~£55k)</SelectItem>
                <SelectItem value="truck">Electric SUV (~£50k)</SelectItem>
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
                £{results.totalMonthlySavings.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                £{results.vehicleCost.toFixed(0)}
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
                £{results.fuelSavings.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Annual Maintenance Savings
              </span>
              <span className="font-semibold text-green-600">
                £{results.maintenanceSavings.toFixed(0)}
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
              £{results.tenYearSavings.toFixed(0)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Including applicable UK EV grants
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Environmental Impact</h4>
            <p className="text-sm text-muted-foreground">
              You'll prevent approximately{' '}
              <span className="font-semibold text-green-600">
                {((parseFloat(milesPerYear) / parseFloat(currentMPG)) * 2.3 * 4.546 / 1000).toFixed(1)} tonnes
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
