import { useState, useEffect } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';

interface UseBatteryCalculatorProps {
  monthlyBill: string;
  peakUsage: string;
  outageFrequency: string;
  batterySize: string;
  energyPrices?: EnergyPricesConfig;
  onUpdate: (data: SavingsData['battery']) => void;
}

export const useBatteryCalculator = ({
  monthlyBill,
  peakUsage,
  outageFrequency,
  batterySize,
  energyPrices,
  onUpdate
}: UseBatteryCalculatorProps) => {
  const [results, setResults] = useState<SavingsData['battery']>({
    systemCost: 0,
    monthlySavings: 0,
    paybackPeriod: 0,
    twentyYearSavings: 0
  });

  const calculateSavings = () => {
    const monthlyBillNum = parseFloat(monthlyBill) || 0;
    const peakUsageNum = parseFloat(peakUsage) || 0;
    const batterySizeNum = parseFloat(batterySize) || 0;

    // Battery system cost in UK (including installation)
    const costPerKWh = 1000; // £1000 per kWh in UK
    const systemCost = batterySizeNum * costPerKWh + 2500; // Base installation cost

    // Peak hour savings (Economy 7 and time-of-use tariffs)
    const electricityRate = energyPrices?.electricity || 0.30;
    const peakRateDiff = electricityRate * 0.67; // Peak rates typically 67% higher than base rate
    const dailyPeakSavings = Math.min(peakUsageNum, batterySizeNum) * peakRateDiff;
    const monthlyPeakSavings = dailyPeakSavings * 30;

    // Grid independence benefit (reduced standing charges and peak demand)
    const demandChargeSavings = monthlyBillNum * 0.08; // Typical 8% savings

    // Total monthly savings
    const monthlySavings = monthlyPeakSavings + demandChargeSavings;

    // Payback period
    const paybackPeriod = systemCost / (monthlySavings * 12);

    // 20-year savings (batteries typically last 15-20 years)
    const twentyYearSavings = (monthlySavings * 12 * 18) - systemCost; // 18 year lifespan

    const newResults = {
      systemCost,
      monthlySavings,
      paybackPeriod,
      twentyYearSavings
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  useEffect(() => {
    calculateSavings();
  }, [monthlyBill, peakUsage, outageFrequency, batterySize, energyPrices]);

  return { results, calculateSavings };
};