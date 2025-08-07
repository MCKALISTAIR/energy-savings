import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, AlertCircle, X, HelpCircle, Calculator, Download, Database, Globe } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EVInputFormProps {
  milesPerYear: string;
  setMilesPerYear: (value: string) => void;
  currentMPG: string;
  setCurrentMPG: (value: string) => void;
  petrolPrice: string;
  setPetrolPrice: (value: string) => void;
  electricityRate: string;
  setElectricityRate: (value: string) => void;
  electricityUnit: 'pounds' | 'pence';
  setElectricityUnit: (value: 'pounds' | 'pence') => void;
  evType: string;
  setEVType: (value: string) => void;
  exactVehicleCost: string;
  setExactVehicleCost: (value: string) => void;
  useExactCost: boolean;
  setUseExactCost: (value: boolean) => void;
  publicChargingFrequency: string;
  setPublicChargingFrequency: (value: string) => void;
  batteryCapacity: string;
  setBatteryCapacity: (value: string) => void;
  hasCurrentVehicle: boolean;
  setHasCurrentVehicle: (value: boolean) => void;
  useRealTimeVehiclePricing: boolean;
  setUseRealTimeVehiclePricing: (value: boolean) => void;
  dataSource?: 'marketcheck' | 'cached' | 'static';
  lastUpdated?: string;
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
  electricityUnit,
  setElectricityUnit,
  evType,
  setEVType,
  exactVehicleCost,
  setExactVehicleCost,
  useExactCost,
  setUseExactCost,
  publicChargingFrequency,
  setPublicChargingFrequency,
  batteryCapacity,
  setBatteryCapacity,
  hasCurrentVehicle,
  setHasCurrentVehicle,
  useRealTimeVehiclePricing,
  setUseRealTimeVehiclePricing,
  dataSource,
  lastUpdated,
  onCalculate,
  onClear
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [vehicleYear, setVehicleYear] = useState<string>('');
  const [mpgEstimated, setMpgEstimated] = useState<boolean>(false);
  const [loadingFuelPrice, setLoadingFuelPrice] = useState<boolean>(false);
  const [showMainForm, setShowMainForm] = useState<boolean>(false);
  const { toast } = useToast();

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

  const estimateMPGFromYear = () => {
    if (!vehicleYear.trim()) return;
    
    const year = parseInt(vehicleYear);
    if (year < 1990 || year > 2024) return;
    
    let estimatedMPG: number;
    
    if (year < 2000) {
      estimatedMPG = 27.5; // Average for pre-2000 vehicles
    } else if (year < 2010) {
      estimatedMPG = 32.5; // 2000-2009 improved efficiency
    } else if (year < 2015) {
      estimatedMPG = 37.5; // 2010-2014 stricter emissions standards
    } else if (year < 2020) {
      estimatedMPG = 42.5; // 2015-2019 modern efficient engines
    } else {
      estimatedMPG = 47.5; // 2020+ latest efficiency standards
    }
    
    setCurrentMPG(estimatedMPG.toString());
    setMpgEstimated(true);
    
    // Clear any existing errors for MPG field
    if (errors.currentMPG) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.currentMPG;
        return newErrors;
      });
    }
  };

  const toggleElectricityUnit = () => {
    if (electricityRate.trim() !== '') {
      if (electricityUnit === 'pence') {
        // Convert from pence to pounds
        const penceValue = parseFloat(electricityRate);
        const poundsValue = (penceValue / 100).toFixed(3);
        setElectricityRate(poundsValue);
      } else {
        // Convert from pounds to pence
        const poundsValue = parseFloat(electricityRate);
        const penceValue = (poundsValue * 100).toFixed(1);
        setElectricityRate(penceValue);
      }
    }
    setElectricityUnit(electricityUnit === 'pence' ? 'pounds' : 'pence');
  };

  const handleClear = () => {
    setErrors({});
    setVehicleYear('');
    setMpgEstimated(false);
    setHasCurrentVehicle(true);
    setShowMainForm(false);
    onClear();
  };

  const handleVehicleChoice = (hasVehicle: boolean) => {
    setHasCurrentVehicle(hasVehicle);
    setShowMainForm(true);
  };

  // Check if form is complete
  const isFormComplete = milesPerYear.trim() !== '' && 
                        (!hasCurrentVehicle || currentMPG.trim() !== '') && 
                        petrolPrice.trim() !== '' && 
                        electricityRate.trim() !== '' && 
                        (useExactCost ? exactVehicleCost.trim() !== '' : evType !== '') &&
                        publicChargingFrequency.trim() !== '' &&
                        batteryCapacity.trim() !== '' &&
                        Object.keys(errors).length === 0;

  // Generate tooltip message for missing fields
  const getMissingFieldsMessage = () => {
    const missingFields = [];
    if (milesPerYear.trim() === '') missingFields.push('Annual Miles');
    if (hasCurrentVehicle && currentMPG.trim() === '') missingFields.push('Current MPG');
    if (petrolPrice.trim() === '') missingFields.push('Petrol Price');
    if (electricityRate.trim() === '') missingFields.push('Electricity Rate');
    if (useExactCost && exactVehicleCost.trim() === '') missingFields.push('Exact Vehicle Cost');
    if (!useExactCost && evType === '') missingFields.push('Vehicle Cost Range');
    if (publicChargingFrequency.trim() === '') missingFields.push('Public Charging Frequency');
    if (batteryCapacity.trim() === '') missingFields.push('Battery Capacity');
    
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

  const fetchCurrentFuelPrice = async () => {
    console.log('fetchCurrentFuelPrice called');
    setLoadingFuelPrice(true);
    
    try {
      console.log('Invoking edge function...');
      const { data, error } = await supabase.functions.invoke('fetch-fuel-prices');
      
      console.log('Edge function response:', { data, error });
      
      if (error) {
        console.error('Edge function error:', error);
        toast({
          title: "Failed to fetch fuel prices",
          description: `Error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('Received data:', data);

      if (data?.price) {
        console.log('Setting petrol price to:', data.price.toFixed(3));
        setPetrolPrice(data.price.toFixed(3));
        toast({
          title: "Price updated!",
          description: `Current UK average: £${data.price.toFixed(3)}/litre`,
        });
      } else if (data?.fallbackPrice) {
        console.log('Using fallback price:', data.fallbackPrice.toFixed(3));
        setPetrolPrice(data.fallbackPrice.toFixed(3));
        toast({
          title: "Using fallback price",
          description: `£${data.fallbackPrice.toFixed(3)}/litre - Data source temporarily unavailable`,
          variant: "default",
        });
      } else {
        console.error('No price data in response:', data);
        // Set a manual fallback price
        setPetrolPrice('1.45');
        toast({
          title: "Using manual fallback",
          description: "£1.45/litre - Unable to fetch current prices",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Failed to fetch fuel prices:', error);
      // Set a manual fallback price
      setPetrolPrice('1.45');
      toast({
        title: "Using manual fallback",
        description: "£1.45/litre - Unable to fetch current prices",
        variant: "destructive",
      });
    } finally {
      console.log('Setting loading to false');
      setLoadingFuelPrice(false);
    }
  };


  const getEVDescription = () => {
    const descriptions: { [key: string]: string } = {
      '10000': 'Entry-level electric vehicles',
      '20000': 'Budget-friendly electric vehicles',
      '30000': 'Popular mid-tier electric vehicles',
      '40000': 'Well-equipped electric vehicles',
      '50000': 'Premium electric vehicles',
      '60000': 'High-end electric vehicles',
      '70000': 'Luxury electric vehicles',
      '80000': 'Premium luxury electric vehicles',
      '90000': 'Ultra-luxury electric vehicles',
      '100000': 'Top-tier electric vehicles'
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
          {hasCurrentVehicle 
            ? 'Compare EV costs with your current vehicle' 
            : 'Compare EV costs with equivalent new petrol vehicle'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!showMainForm ? (
          // Initial vehicle ownership question
          <div className="text-center space-y-6 py-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Let's get started</h3>
              <p className="text-muted-foreground">
                Do you currently own a vehicle that you'd like to compare with an electric vehicle?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Button 
                onClick={() => handleVehicleChoice(true)}
                className="flex-1"
                size="lg"
              >
                <Car className="w-4 h-4 mr-2" />
                Yes, I own a vehicle
              </Button>
              <Button 
                onClick={() => handleVehicleChoice(false)}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                No, I don't own a vehicle
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We'll customize the calculator based on your choice to provide the most accurate savings estimate.
            </p>
          </div>
        ) : (
          // Main form after vehicle choice is made
          <>
            {/* Small vehicle choice indicator that can be changed */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Car className="w-4 h-4" />
                <span>
                  {hasCurrentVehicle 
                    ? 'Comparing with your current vehicle' 
                    : 'Comparing with equivalent new petrol vehicle'
                  }
                </span>
              </div>
              <Button
                onClick={() => setShowMainForm(false)}
                variant="ghost"
                size="sm"
                className="text-xs h-auto p-1"
              >
                Change
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="miles">
                {hasCurrentVehicle ? 'Annual Miles Driven' : 'Estimated Annual Mileage'}
              </Label>
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

            {hasCurrentVehicle && (
              <div className="space-y-2">
                <Label htmlFor="vehicleYear">Vehicle Year (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="vehicleYear"
                  type="number"
                  min="1990"
                  max="2024"
                  value={vehicleYear}
                  onChange={(e) => handleNumericInput(e, 'vehicleYear', setVehicleYear)}
                  onInput={(e) => handleInputValidation(e, 'vehicleYear', setVehicleYear)}
                  onBlur={(e) => handleBlur(e, 'vehicleYear', setVehicleYear)}
                  placeholder="2018"
                  className={`flex-1 ${errors.vehicleYear ? 'border-red-500' : ''}`}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={estimateMPGFromYear}
                        disabled={!vehicleYear.trim() || parseInt(vehicleYear) < 1990 || parseInt(vehicleYear) > 2024}
                        className="whitespace-nowrap"
                      >
                        <Calculator className="w-4 h-4 mr-1" />
                        Estimate MPG
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Estimate MPG based on vehicle year using UK efficiency averages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {errors.vehicleYear && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.vehicleYear}
                </div>
              )}
                <p className="text-xs text-muted-foreground">
                  Use this to estimate MPG if you don't know your exact fuel efficiency
                </p>
              </div>
            )}

            {hasCurrentVehicle && (
              <div className="space-y-2">
                <Label htmlFor="mpg">Current Vehicle MPG</Label>
              <div className="relative">
                <Input
                  id="mpg"
                  type="number"
                  min="0"
                  value={currentMPG}
                  onChange={(e) => {
                    handleNumericInput(e, 'currentMPG', setCurrentMPG);
                    setMpgEstimated(false); // Clear estimated flag when manually edited
                  }}
                  onInput={(e) => handleInputValidation(e, 'currentMPG', setCurrentMPG)}
                  onBlur={(e) => handleBlur(e, 'currentMPG', setCurrentMPG)}
                  placeholder="40"
                  className={errors.currentMPG ? 'border-red-500' : ''}
                />
                {mpgEstimated && currentMPG && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Estimated
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This MPG value was estimated from your {vehicleYear} vehicle year</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
              {errors.currentMPG && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.currentMPG}
                </div>
              )}
                <p className="text-xs text-muted-foreground">
                  Miles per gallon of your current petrol/diesel vehicle
                </p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="petrolPrice">Petrol Price (£/litre)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={fetchCurrentFuelPrice}
                        disabled={loadingFuelPrice}
                        className="text-xs h-7"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {loadingFuelPrice ? 'Loading...' : 'Get Current UK Price'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Fetch latest UK Government weekly fuel prices</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="electricityRate">
                  Electricity Rate ({electricityUnit === 'pence' ? 'p/kWh' : '£/kWh'})
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleElectricityUnit}
                  className="text-xs h-7"
                >
                  Switch to {electricityUnit === 'pence' ? '£' : 'p'}
                </Button>
              </div>
              <Input
                id="electricityRate"
                type="number"
                step={electricityUnit === 'pence' ? '0.1' : '0.001'}
                min="0"
                value={electricityRate}
                onChange={(e) => handleNumericInput(e, 'electricityRate', setElectricityRate)}
                onInput={(e) => handleInputValidation(e, 'electricityRate', setElectricityRate)}
                onBlur={(e) => handleBlur(e, 'electricityRate', setElectricityRate)}
                placeholder={electricityUnit === 'pence' ? '30' : '0.30'}
                className={errors.electricityRate ? 'border-red-500' : ''}
              />
              {errors.electricityRate && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.electricityRate}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Your home electricity rate - typical UK rate is around {electricityUnit === 'pence' ? '30p' : '£0.30'} per kWh. If you have a time of use tariff, use the price at the time you'll likely be charging.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicChargingFrequency">Public Charging per Month</Label>
              <Input
                id="publicChargingFrequency"
                type="number"
                min="0"
                value={publicChargingFrequency}
                onChange={(e) => handleNumericInput(e, 'publicChargingFrequency', setPublicChargingFrequency)}
                onInput={(e) => handleInputValidation(e, 'publicChargingFrequency', setPublicChargingFrequency)}
                onBlur={(e) => handleBlur(e, 'publicChargingFrequency', setPublicChargingFrequency)}
                placeholder="4"
                className={errors.publicChargingFrequency ? 'border-red-500' : ''}
              />
              {errors.publicChargingFrequency && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.publicChargingFrequency}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                How often you use public rapid charging stations per month
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="batteryCapacity">EV Battery Capacity (kWh)</Label>
              <Input
                id="batteryCapacity"
                type="number"
                min="0"
                value={batteryCapacity}
                onChange={(e) => handleNumericInput(e, 'batteryCapacity', setBatteryCapacity)}
                onInput={(e) => handleInputValidation(e, 'batteryCapacity', setBatteryCapacity)}
                onBlur={(e) => handleBlur(e, 'batteryCapacity', setBatteryCapacity)}
                placeholder="75"
                className={errors.batteryCapacity ? 'border-red-500' : ''}
              />
              {errors.batteryCapacity && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {errors.batteryCapacity}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Total battery capacity of your electric vehicle
              </p>
            </div>

            <div className="space-y-4">
              <Label>Vehicle Cost</Label>
              
              <RadioGroup 
                value={useExactCost ? "exact" : "estimate"} 
                onValueChange={(value) => setUseExactCost(value === "exact")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="exact" id="exact-cost" />
                  <Label htmlFor="exact-cost" className="cursor-pointer">I know the exact vehicle cost</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="estimate" id="rough-estimate" />
                  <Label htmlFor="rough-estimate" className="cursor-pointer">Use a rough estimate</Label>
                </div>
              </RadioGroup>

              {useExactCost ? (
                <div className="space-y-2">
                  <Label htmlFor="exactVehicleCost">Exact Vehicle Cost (£)</Label>
                  <Input
                    id="exactVehicleCost"
                    type="number"
                    min="0"
                    value={exactVehicleCost}
                    onChange={(e) => handleNumericInput(e, 'exactVehicleCost', setExactVehicleCost)}
                    onInput={(e) => handleInputValidation(e, 'exactVehicleCost', setExactVehicleCost)}
                    onBlur={(e) => handleBlur(e, 'exactVehicleCost', setExactVehicleCost)}
                    placeholder="35000"
                    className={errors.exactVehicleCost ? 'border-red-500' : ''}
                  />
                  {errors.exactVehicleCost && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      {errors.exactVehicleCost}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Enter the exact purchase price of the electric vehicle you're considering
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Rough Vehicle Cost</Label>
                  <Select value={evType} onValueChange={setEVType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10000">~£10,000</SelectItem>
                      <SelectItem value="20000">~£20,000</SelectItem>
                      <SelectItem value="30000">~£30,000</SelectItem>
                      <SelectItem value="40000">~£40,000</SelectItem>
                      <SelectItem value="50000">~£50,000</SelectItem>
                      <SelectItem value="60000">~£60,000</SelectItem>
                      <SelectItem value="70000">~£70,000</SelectItem>
                      <SelectItem value="80000">~£80,000</SelectItem>
                      <SelectItem value="90000">~£90,000</SelectItem>
                      <SelectItem value="100000">~£100,000</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{getEVDescription()}</p>
                </div>
              )}
            </div>

            {/* Pricing Mode Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Vehicle pricing</span>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-full bg-muted p-1">
                    <button
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                        !useRealTimeVehiclePricing 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setUseRealTimeVehiclePricing(false)}
                    >
                      Static
                    </button>
                    <button
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                        useRealTimeVehiclePricing 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => setUseRealTimeVehiclePricing(true)}
                    >
                      Market
                    </button>
                  </div>
                  {dataSource && (
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      dataSource === 'marketcheck' 
                        ? 'bg-green-100 text-green-800' 
                        : dataSource === 'cached' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {dataSource === 'marketcheck' ? 'Live' : dataSource === 'cached' ? 'Cached' : 'Static'}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {useRealTimeVehiclePricing 
                  ? dataSource === 'static' 
                    ? 'MarketCheck API unavailable - using fallback pricing' 
                    : 'Uses live pricing from MarketCheck API for more accurate estimates'
                  : 'Uses estimated pricing based on market averages'
                }
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
                        Calculate Savings
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
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="hover-scale hover:bg-muted active:bg-muted"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>How EV Savings are Calculated</DialogTitle>
                    <DialogDescription asChild>
                      <div className="space-y-3 pt-2">
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-medium">•</span>
                            <span><strong>Petrol costs:</strong> (Annual miles ÷ MPG) × Price per gallon</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-medium">•</span>
                            <span><strong>EV charging costs:</strong> (Annual miles ÷ EV efficiency) × Electricity rate</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-medium">•</span>
                            <span><strong>Public charging premium:</strong> Added based on frequency of use</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-medium">•</span>
                            <span><strong>Environmental impact:</strong> Calculated from CO₂ reduction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-medium">•</span>
                            <span><strong>MPG estimation:</strong> If you don't know your MPG, use the vehicle year to get an estimate</span>
                          </li>
                        </ul>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EVInputForm;