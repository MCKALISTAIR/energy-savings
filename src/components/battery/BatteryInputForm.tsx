import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Battery, AlertCircle, X } from 'lucide-react';

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
  onClear: () => void;
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
  onCalculate,
  onClear
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleClear = () => {
    setErrors({});
    onClear();
  };

  // Check if form is complete
  const isFormComplete = monthlyBill.trim() !== '' && 
                        peakUsage.trim() !== '' && 
                        outageFrequency !== '' && 
                        batterySize !== '' &&
                        Object.keys(errors).length === 0;

  // Generate tooltip message for missing fields
  const getMissingFieldsMessage = () => {
    const missingFields = [];
    if (monthlyBill.trim() === '') missingFields.push('Monthly Bill');
    if (peakUsage.trim() === '') missingFields.push('Peak Usage');
    if (outageFrequency === '') missingFields.push('Outage Frequency');
    if (batterySize === '') missingFields.push('Battery Size');
    
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
            min="0"
            value={monthlyBill}
            onChange={(e) => handleNumericInput(e, 'monthlyBill', setMonthlyBill)}
            onInput={(e) => handleInputValidation(e, 'monthlyBill', setMonthlyBill)}
            onBlur={(e) => handleBlur(e, 'monthlyBill', setMonthlyBill)}
            placeholder="120"
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
          <Label htmlFor="peakUsage">Peak Hour Daily Usage (kWh)</Label>
          <Input
            id="peakUsage"
            type="number"
            min="0"
            value={peakUsage}
            onChange={(e) => handleNumericInput(e, 'peakUsage', setPeakUsage)}
            onInput={(e) => handleInputValidation(e, 'peakUsage', setPeakUsage)}
            onBlur={(e) => handleBlur(e, 'peakUsage', setPeakUsage)}
            placeholder="25"
            className={errors.peakUsage ? 'border-red-500' : ''}
          />
          {errors.peakUsage && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.peakUsage}
            </div>
          )}
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

export default BatteryInputForm;