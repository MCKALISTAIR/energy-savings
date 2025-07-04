import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer } from 'lucide-react';

interface HeatPumpInputFormProps {
  homeSize: string;
  setHomeSize: (value: string) => void;
  currentHeatingType: string;
  setCurrentHeatingType: (value: string) => void;
  monthlyHeatingBill: string;
  setMonthlyHeatingBill: (value: string) => void;
  heatPumpType: string;
  setHeatPumpType: (value: string) => void;
  onCalculate: () => void;
}

const HeatPumpInputForm: React.FC<HeatPumpInputFormProps> = ({
  homeSize,
  setHomeSize,
  currentHeatingType,
  setCurrentHeatingType,
  monthlyHeatingBill,
  setMonthlyHeatingBill,
  heatPumpType,
  setHeatPumpType,
  onCalculate
}) => {
  return (
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

        <Button onClick={onCalculate} className="w-full">
          Recalculate Savings
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeatPumpInputForm;