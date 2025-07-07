import { useState, useEffect } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';

interface UseHeatPumpCalculatorProps {
  homeSize: string;
  currentHeatingType: string;
  monthlyHeatingBill: string;
  heatPumpType: string;
  energyPrices?: EnergyPricesConfig;
  onUpdate: (data: SavingsData['heatPump']) => void;
}

export const useHeatPumpCalculator = ({
  homeSize,
  currentHeatingType,
  monthlyHeatingBill,
  heatPumpType,
  energyPrices,
  onUpdate
}: UseHeatPumpCalculatorProps) => {
  const [results, setResults] = useState<SavingsData['heatPump']>({
    systemCost: 0,
    monthlySavings: 0,
    paybackPeriod: 0,
    twentyYearSavings: 0
  });

  const calculateSavings = () => {
    const homeSizeNum = parseFloat(homeSize) || 0;
    const monthlyBillNum = parseFloat(monthlyHeatingBill) || 0;

    // System cost based on type and home size (UK prices)
    const systemCosts: { [key: string]: number } = {
      'air_source': 8000 + (homeSizeNum * 35), // £8k base + £35/m²
      'ground_source': 12000 + (homeSizeNum * 45), // £12k base + £45/m²
      'hybrid': 6000 + (homeSizeNum * 25) // £6k base + £25/m²
    };

    const systemCost = systemCosts[heatPumpType] || systemCosts['air_source'];

    // Efficiency multipliers for different heat pump types
    const efficiencyMultipliers: { [key: string]: number } = {
      'air_source': 3.2, // COP of 3.2
      'ground_source': 4.0, // COP of 4.0
      'hybrid': 2.8 // COP of 2.8
    };

    const efficiency = efficiencyMultipliers[heatPumpType] || 3.2;

    // Current heating costs per unit (use custom prices if available)
    const heatingCosts: { [key: string]: number } = {
      'gas': energyPrices?.gas || 0.06,
      'oil': energyPrices?.oil || 0.09,
      'electric': energyPrices?.electricity || 0.30,
      'lpg': energyPrices?.lpg || 0.08
    };

    const currentCostPerKwh = heatingCosts[currentHeatingType] || 0.06;
    
    // Heat pump electricity cost (use custom price if available)
    const electricityRate = energyPrices?.electricity || 0.30;
    const heatPumpCostPerKwh = electricityRate / efficiency;
    
    // Calculate monthly savings
    const currentMonthlyKwh = monthlyBillNum / currentCostPerKwh;
    const heatPumpMonthlyCost = currentMonthlyKwh * heatPumpCostPerKwh;
    const monthlySavings = Math.max(0, monthlyBillNum - heatPumpMonthlyCost);
    
    // Payback period in years
    const paybackPeriod = systemCost / (monthlySavings * 12);
    
    // 20-year savings (accounting for maintenance)
    const twentyYearSavings = (monthlySavings * 12 * 20) - systemCost - (systemCost * 0.1); // 10% maintenance over 20 years

    const newResults = {
      systemCost,
      monthlySavings,
      paybackPeriod,
      twentyYearSavings
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  // Remove auto-calculation - users must click calculate button

  return { results, calculateSavings };
};