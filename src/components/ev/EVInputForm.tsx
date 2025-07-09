import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Car, AlertCircle, X } from 'lucide-react';

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
  onClear: () => void;
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
  const isFormComplete = milesPerYear.trim() !== '' && 
                        currentMPG.trim() !== '' && 
                        petrolPrice.trim() !== '' && 
                        electricityRate.trim() !== '' && 
                        evType !== '' &&
                        Object.keys(errors).length === 0;

  // Generate tooltip message for missing fields
  const getMissingFieldsMessage = () => {
    const missingFields = [];
    if (milesPerYear.trim() === '') missingFields.push('Annual Miles');
    if (currentMPG.trim() === '') missingFields.push('Current MPG');
    if (petrolPrice.trim() === '') missingFields.push('Petrol Price');
    if (electricityRate.trim() === '') missingFields.push('Electricity Rate');
    if (evType === '') missingFields.push('EV Type');
    
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
            min="0"
            value={milesPerYear}
            onChange={(e) => handleNumericInput(e, 'milesPerYear', setMilesPerYear)}
            onInput={(e) => handleInputValidation(e, 'milesPerYear', setMilesPerYear)}
            onBlur={(e) => handleBlur(e, 'milesPerYear', setMilesPerYear)}
            placeholder="10000"
            className={errors.milesPerYear ? 'border-red-500' : ''}
          />
          {errors.milesPerYear && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.milesPerYear}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mpg">Current Vehicle MPG</Label>
          <Input
            id="mpg"
            type="number"
            min="0"
            value={currentMPG}
            onChange={(e) => handleNumericInput(e, 'currentMPG', setCurrentMPG)}
            onInput={(e) => handleInputValidation(e, 'currentMPG', setCurrentMPG)}
            onBlur={(e) => handleBlur(e, 'currentMPG', setCurrentMPG)}
            placeholder="40"
            className={errors.currentMPG ? 'border-red-500' : ''}
          />
          {errors.currentMPG && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.currentMPG}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="petrolPrice">Petrol Price (£/litre)</Label>
          <Input
            id="petrolPrice"
            type="number"
            step="0.01"
            min="0"
            value={petrolPrice}
            onChange={(e) => handleNumericInput(e, 'petrolPrice', setPetrolPrice)}
            onInput={(e) => handleInputValidation(e, 'petrolPrice', setPetrolPrice)}
            onBlur={(e) => handleBlur(e, 'petrolPrice', setPetrolPrice)}
            placeholder="1.45"
            className={errors.petrolPrice ? 'border-red-500' : ''}
          />
          {errors.petrolPrice && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.petrolPrice}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="electricityRate">Electricity Rate (£/kWh)</Label>
          <Input
            id="electricityRate"
            type="number"
            step="0.01"
            min="0"
            value={electricityRate}
            onChange={(e) => handleNumericInput(e, 'electricityRate', setElectricityRate)}
            onInput={(e) => handleInputValidation(e, 'electricityRate', setElectricityRate)}
            onBlur={(e) => handleBlur(e, 'electricityRate', setElectricityRate)}
            placeholder="0.30"
            className={errors.electricityRate ? 'border-red-500' : ''}
          />
          {errors.electricityRate && (
            <div className="flex items-center gap-1 text-sm text-red-500">
              <AlertCircle className="w-4 h-4" />
              {errors.electricityRate}
            </div>
          )}
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

export default EVInputForm;