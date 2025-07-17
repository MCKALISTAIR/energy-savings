import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Thermometer, AlertCircle, X } from 'lucide-react';

interface HeatPumpInputFormProps {
  homeSize: string;
  setHomeSize: (value: string) => void;
  currentHeatingType: string;
  setCurrentHeatingType: (value: string) => void;
  monthlyHeatingBill: string;
  setMonthlyHeatingBill: (value: string) => void;
  heatPumpType: string;
  setHeatPumpType: (value: string) => void;
  quotePrice: string;
  setQuotePrice: (value: string) => void;
  onCalculate: () => void;
  onClear: () => void;
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
  quotePrice,
  setQuotePrice,
  onCalculate,
  onClear
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    setValue: (value: string) => void
  ) => {
    const value = e.target.value;
    validateAndSetValue(value, fieldKey, setValue);
  };

  const handleInputValidation = (
    e: React.FormEvent<HTMLInputElement>,
    fieldKey: string,
    setValue: (value: string) => void
  ) => {
    const value = e.currentTarget.value;
    validateAndSetValue(value, fieldKey, setValue);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    fieldKey: string,
    setValue: (value: string) => void
  ) => {
    const value = e.target.value;
    validateAndSetValue(value, fieldKey, setValue);
  };

  const validateAndSetValue = (
    value: string,
    fieldKey: string,
    setValue: (value: string) => void
  ) => {
    // Clear any existing error for this field first
    if (errors[fieldKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }

    // Check for negative values
    if (value.startsWith('-') || parseFloat(value) < 0) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: 'Negative values are not allowed'
      }));
      setValue('0');
      return;
    }

    // Check for non-numeric input (except decimal point)
    if (value !== '' && !/^[0-9.]*$/.test(value)) {
      setErrors(prev => ({
        ...prev,
        [fieldKey]: 'Only numbers are allowed'
      }));
      // Remove invalid characters and keep only numbers and decimal points
      const cleanValue = value.replace(/[^0-9.]/g, '');
      setValue(cleanValue);
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
        // Keep only the first decimal point
        const cleanValue = parts[0] + '.' + parts.slice(1).join('');
        setValue(cleanValue);
        return;
      }
    }

    // If value is valid, ensure it's not negative
    const numericValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0).toString();
    setValue(numericValue);
  };

  const handleClear = () => {
    setErrors({});
    onClear();
  };

  // Check if form is complete
  const isFormComplete = homeSize.trim() !== '' && 
                        currentHeatingType !== '' && 
                        monthlyHeatingBill.trim() !== '' && 
                        heatPumpType !== '' &&
                        Object.keys(errors).length === 0;

  // Generate tooltip message for missing fields
  const getMissingFieldsMessage = () => {
    const missingFields = [];
    if (homeSize.trim() === '') missingFields.push('Home Size');
    if (currentHeatingType === '') missingFields.push('Current Heating Type');
    if (monthlyHeatingBill.trim() === '') missingFields.push('Monthly Heating Bill');
    if (heatPumpType === '') missingFields.push('Heat Pump Type');
    
    if (missingFields.length === 0 && Object.keys(errors).length > 0) {
      return 'Please fix the validation errors above';
    }
    
    if (missingFields.length === 1) {
      return `Please fill out: ${missingFields[0]}`;
    } else if (missingFields.length > 1) {
      return `Please fill out: ${missingFields.slice(0, -1).join(', ')} and ${missingFields[missingFields.length - 1]}`;
    }
    
    return '';
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
            onInput={(e) => handleInputValidation(e, 'homeSize', setHomeSize)}
            onBlur={(e) => handleBlur(e, 'homeSize', setHomeSize)}
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
            onInput={(e) => handleInputValidation(e, 'monthlyBill', setMonthlyHeatingBill)}
            onBlur={(e) => handleBlur(e, 'monthlyBill', setMonthlyHeatingBill)}
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

        <div className="space-y-2">
          <Label htmlFor="quotePrice">Quote Price (£) - Optional</Label>
          <Input
            id="quotePrice"
            type="number"
            min="0"
            value={quotePrice}
            onChange={(e) => handleNumericInput(e, 'quotePrice', setQuotePrice)}
            onInput={(e) => handleInputValidation(e, 'quotePrice', setQuotePrice)}
            onBlur={(e) => handleBlur(e, 'quotePrice', setQuotePrice)}
            placeholder="12500"
            className={errors.quotePrice ? 'border-red-500' : ''}
          />
          {errors.quotePrice && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.quotePrice}
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Leave empty to use estimated costs based on home size and heat pump type
          </p>
        </div>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="flex-1">
                <div>
                  <Button 
                    onClick={onCalculate} 
                    className="w-full" 
                    disabled={!isFormComplete}
                  >
                    Recalculate Savings
                  </Button>
                </div>
              </TooltipTrigger>
              {!isFormComplete && (
                <TooltipContent>
                  <p>{getMissingFieldsMessage()}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <Button 
            onClick={handleClear} 
            variant="outline" 
            size="icon"
            className="hover-scale"
            title="Clear all fields"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatPumpInputForm;