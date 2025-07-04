import { useState, useEffect } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';

interface UseEVCalculatorProps {
  milesPerYear: string;
  currentMPG: string;
  petrolPrice: string;
  electricityRate: string;
  evType: string;
  energyPrices?: EnergyPricesConfig;
  onUpdate: (data: SavingsData['ev']) => void;
}

export const useEVCalculator = ({
  milesPerYear,
  currentMPG,
  petrolPrice,
  electricityRate,
  evType,
  energyPrices,
  onUpdate
}: UseEVCalculatorProps) => {
  const [results, setResults] = useState<SavingsData['ev']>({
    vehicleCost: 0,
    fuelSavings: 0,
    maintenanceSavings: 0,
    totalMonthlySavings: 0,
    paybackPeriod: 0,
    tenYearSavings: 0
  });

  const calculateSavings = () => {
    const milesPerYearNum = parseFloat(milesPerYear) || 0;
    const currentMPGNum = parseFloat(currentMPG) || 0;
    const petrolPriceNum = parseFloat(petrolPrice) || 0;
    const electricityRateNum = parseFloat(electricityRate) || 0;

    // EV specifications based on type (UK market)
    const evSpecs: { [key: string]: { efficiency: number; cost: number; range: number } } = {
      'economy': { efficiency: 4.5, cost: 25000, range: 200 }, // miles per kWh
      'mid-range': { efficiency: 4.0, cost: 35000, range: 250 },
      'luxury': { efficiency: 3.5, cost: 55000, range: 300 },
      'truck': { efficiency: 3.0, cost: 50000, range: 250 }
    };

    const selectedEV = evSpecs[evType] || evSpecs['mid-range'];

    // Current annual fuel costs (convert MPG to miles per litre)
    const milesPerLitre = currentMPGNum / 4.546; // 1 gallon = 4.546 litres
    const annualLitres = milesPerYearNum / milesPerLitre;
    const annualPetrolCost = annualLitres * petrolPriceNum;

    // EV annual electricity costs
    const annualKWh = milesPerYearNum / selectedEV.efficiency;
    const annualElectricityCost = annualKWh * electricityRateNum;

    // Annual fuel savings
    const annualFuelSavings = annualPetrolCost - annualElectricityCost;

    // Annual maintenance savings (EVs require ~50% less maintenance in UK)
    const annualMaintenanceSavings = 800; // Typical UK savings

    // Total annual savings
    const totalAnnualSavings = annualFuelSavings + annualMaintenanceSavings;

    // Vehicle cost premium over comparable petrol car
    const petrolCarEquivalent = 28000; // Average comparable petrol vehicle in UK
    const vehicleCostPremium = selectedEV.cost - petrolCarEquivalent;

    // Payback period (considering UK EV grants where applicable)
    const evGrant = selectedEV.cost <= 35000 ? 2500 : 0; // UK EV grant for cars under £35k
    const netCostPremium = Math.max(0, vehicleCostPremium - evGrant);
    const paybackPeriod = netCostPremium / totalAnnualSavings;

    // 10-year savings
    const tenYearSavings = (totalAnnualSavings * 10) - netCostPremium;

    const newResults = {
      vehicleCost: selectedEV.cost,
      fuelSavings: annualFuelSavings,
      maintenanceSavings: annualMaintenanceSavings,
      totalMonthlySavings: totalAnnualSavings / 12,
      paybackPeriod,
      tenYearSavings
    };

    setResults(newResults);
    onUpdate(newResults);
  };

  useEffect(() => {
    calculateSavings();
  }, [milesPerYear, currentMPG, petrolPrice, electricityRate, evType, energyPrices]);

  return { results, calculateSavings };
};