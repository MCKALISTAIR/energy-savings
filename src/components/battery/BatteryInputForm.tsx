import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Battery } from 'lucide-react';

interface BatteryInputFormProps {
  monthlyBill: string;
  setMonthlyBill: (value: string) => void;
  peakUsage: string;
  setPeakUsage: (value: string) => void;
  outageFrequency: string;
  setOutageFrequency: (value: string) => void;
  batterySize: string;
  setBatterySize: (value: string) => void;
  onCalculate: () => void;
}

const BatteryInputForm: React.FC<BatteryInputFormProps> = ({
  monthlyBill,
  setMonthlyBill,
  peakUsage,
  setPeakUsage,
  outageFrequency,
  setOutageFrequency,
  batterySize,
  setBatterySize,
  onCalculate
}) => {
  return (
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
          <Label htmlFor="monthlyBill">Monthly Electric Bill (£)</Label>
          <Input
            id="monthlyBill"
            type="number"
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(e.target.value)}
            placeholder="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="peakUsage">Peak Hour Daily Usage (kWh)</Label>
          <Input
            id="peakUsage"
            type="number"
            value={peakUsage}
            onChange={(e) => setPeakUsage(e.target.value)}
            placeholder="25"
          />
          <p className="text-xs text-muted-foreground">
            Typical peak hours: 4-7 PM weekdays
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

        <Button onClick={onCalculate} className="w-full">
          Recalculate Savings
        </Button>
      </CardContent>
    </Card>
  );
};

export default BatteryInputForm;