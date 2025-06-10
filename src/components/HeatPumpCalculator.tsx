
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Calculator, TrendingUp, Zap } from 'lucide-react';

interface HeatPumpData {
  systemCost: number;
  monthlySavings: number;
  paybackPeriod: number;
  twentyYearSavings: number;
}

interface HeatPumpCalculatorProps {
  onUpdate: (data: HeatPumpData) => void;
}

const HeatPumpCalculator: React.FC<HeatPumpCalculatorProps> = ({ onUpdate }) => {
  const [currentHeatingType, setCurrentHeatingType] = useState('gas');
  const [currentHeatingCost, setCurrentHeatingCost] = useState(150);
  const [homeSize, setHomeSize] = useState(2000);
  const [systemType, setSystemType] = useState('air-source');
  const [heatPumpCOP, setHeatPumpCOP] = useState(3.5);
  const [electricityRate, setElectricityRate] = useState(0.15);
  const [installationCost, setInstallationCost] = useState(15000);

  const [results, setResults] = useState<HeatPumpData>({
    systemCost: 0,
    monthlySavings: 0,
    paybackPeriod: 0,
    twentyYearSavings: 0
  });

  const calculateSavings = () => {
    // Calculate annual heating energy needs (BTU)
    const annualHeatingBTU = homeSize * 40; // Rough estimate: 40 BTU per sq ft

    // Convert BTU to kWh for heat pump
    const annualHeatingkWh = annualHeatingBTU * 0.000293071; // BTU to kWh conversion

    // Heat pump electricity consumption (accounting for COP)
    const heatPumpAnnualkWh = annualHeatingkWh / heatPumpCOP;
    
    // Annual cost with heat pump
    const heatPumpAnnualCost = heatPumpAnnualkWh * electricityRate;
    
    // Current annual heating cost
    const currentAnnualCost = currentHeatingCost * 12;
    
    // Annual savings
    const annualSavings = currentAnnualCost - heatPumpAnnualCost;
    const monthlySavings = Math.max(0, annualSavings / 12);
    
    // Payback period
    const paybackPeriod = monthlySavings > 0 ? installationCost / annualSavings : 0;
    
    // 20-year savings (accounting for 3% annual energy cost inflation)
    let twentyYearSavings = 0;
    for (let year = 1; year <= 20; year++) {
      const inflationFactor = Math.pow(1.03, year);
      twentyYearSavings += annualSavings * inflationFactor;
    }
    twentyYearSavings -= installationCost; // Subtract initial investment

    const newResults = {
      systemCost: installationCost,
      monthlySavings: Math.round(monthlySavings),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      twentyYearSavings: Math.round(twentyYearSavings)
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  useEffect(() => {
    calculateSavings();
  }, [currentHeatingType, currentHeatingCost, homeSize, systemType, heatPumpCOP, electricityRate, installationCost]);

  const getSystemTypeDescription = (type: string) => {
    switch (type) {
      case 'air-source':
        return 'Most common, works in most climates';
      case 'ground-source':
        return 'Higher efficiency, higher upfront cost';
      case 'water-source':
        return 'Best efficiency where water source available';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            Heat Pump Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Heating System */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Heating System</h3>
              
              <div>
                <Label htmlFor="currentHeatingType">Current Heating Type</Label>
                <Select value={currentHeatingType} onValueChange={setCurrentHeatingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gas">Natural Gas</SelectItem>
                    <SelectItem value="oil">Heating Oil</SelectItem>
                    <SelectItem value="electric">Electric Resistance</SelectItem>
                    <SelectItem value="propane">Propane</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currentHeatingCost">Monthly Heating Cost ($)</Label>
                <Input
                  id="currentHeatingCost"
                  type="number"
                  value={currentHeatingCost}
                  onChange={(e) => setCurrentHeatingCost(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="homeSize">Home Size (sq ft)</Label>
                <Input
                  id="homeSize"
                  type="number"
                  value={homeSize}
                  onChange={(e) => setHomeSize(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Heat Pump System */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Heat Pump System</h3>
              
              <div>
                <Label htmlFor="systemType">Heat Pump Type</Label>
                <Select value={systemType} onValueChange={setSystemType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air-source">Air Source Heat Pump</SelectItem>
                    <SelectItem value="ground-source">Ground Source (Geothermal)</SelectItem>
                    <SelectItem value="water-source">Water Source</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  {getSystemTypeDescription(systemType)}
                </p>
              </div>

              <div>
                <Label htmlFor="heatPumpCOP">Coefficient of Performance (COP)</Label>
                <Input
                  id="heatPumpCOP"
                  type="number"
                  step="0.1"
                  value={heatPumpCOP}
                  onChange={(e) => setHeatPumpCOP(Number(e.target.value))}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Higher COP = more efficient (typical range: 2.5-4.5)
                </p>
              </div>

              <div>
                <Label htmlFor="electricityRate">Electricity Rate ($ per kWh)</Label>
                <Input
                  id="electricityRate"
                  type="number"
                  step="0.01"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="installationCost">Installation Cost ($)</Label>
                <Input
                  id="installationCost"
                  type="number"
                  value={installationCost}
                  onChange={(e) => setInstallationCost(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <Button onClick={calculateSavings} className="w-full">
            <Calculator className="w-4 h-4 mr-2" />
            Recalculate Savings
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Cost</p>
                <p className="text-2xl font-bold">${results.systemCost.toLocaleString()}</p>
              </div>
              <Thermometer className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Savings</p>
                <p className="text-2xl font-bold text-green-600">${results.monthlySavings}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold">{results.paybackPeriod} years</p>
              </div>
              <Calculator className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">20-Year Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${results.twentyYearSavings.toLocaleString()}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Heat Pump Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Environmental Benefits</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Reduces carbon footprint by 40-70%</li>
                <li>• No direct fossil fuel combustion</li>
                <li>• Becomes cleaner as grid electricity improves</li>
                <li>• Can provide both heating and cooling</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Financial Incentives</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Federal tax credit up to $2,000</li>
                <li>• State and local rebates available</li>
                <li>• Utility company incentives</li>
                <li>• Lower maintenance costs than traditional systems</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeatPumpCalculator;
