import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Thermometer, AlertCircle } from 'lucide-react';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    setValue: (value: string) => void
  ) => {
    const value = e.target.value;
    
    // Clear any existing error for this field
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }

    // Check for negative values
    if (value.startsWith('-')) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: 'Negative values are not allowed'
      }));
      return;
    }

    // Check for non-numeric input (except decimal point)
    if (value !== '' && !/^[0-9.]*$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: 'Only numbers are allowed'
      }));
      return;
    }

    // Check for multiple decimal points
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts.length > 2) {
        setErrors(prev => ({
          ...prev,
          [fieldKey]: 'Only one decimal point allowed'
        }));
        return;
      }
    }

    const numericValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0).toString();
    setValue(numericValue);
  };
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
            min="0"
            value={homeSize}
            onChange={(e) => handleNumericInput(e, 'homeSize', setHomeSize)}
            placeholder="185"
            className={errors.homeSize ? 'border-red-500' : ''}
          />
          {errors.homeSize && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.homeSize}
            </div>
          )}
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
            min="0"
            value={monthlyHeatingBill}
            onChange={(e) => handleNumericInput(e, 'monthlyBill', setMonthlyHeatingBill)}
            placeholder="80"
            className={errors.monthlyBill ? 'border-red-500' : ''}
          />
          {errors.monthlyBill && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.monthlyBill}
            </div>
          )}
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