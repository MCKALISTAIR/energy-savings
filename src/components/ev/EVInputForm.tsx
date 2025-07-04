import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';

interface EVInputFormProps {
  milesPerYear: string;
  setMilesPerYear: (value: string) => void;
  currentMPG: string;
  setCurrentMPG: (value: string) => void;
  petrolPrice: string;
  setPetrolPrice: (value: string) => void;
  electricityRate: string;
  setElectricityRate: (value: string) => void;
  evType: string;
  setEVType: (value: string) => void;
  onCalculate: () => void;
}

const EVInputForm: React.FC<EVInputFormProps> = ({
  milesPerYear,
  setMilesPerYear,
  currentMPG,
  setCurrentMPG,
  petrolPrice,
  setPetrolPrice,
  electricityRate,
  setElectricityRate,
  evType,
  setEVType,
  onCalculate
}) => {
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

        <Button onClick={onCalculate} className="w-full">
          Recalculate Savings
        </Button>
      </CardContent>
    </Card>
  );
};

export default EVInputForm;