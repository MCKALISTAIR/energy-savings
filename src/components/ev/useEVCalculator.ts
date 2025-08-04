import { useState, useEffect } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';

interface UseEVCalculatorProps {
  milesPerYear: string;
  currentMPG: string;
  petrolPrice: string;
  electricityRate: string;
  evType: string;
  publicChargingFrequency: string;
  batteryCapacity: string;
  hasCurrentVehicle: boolean;
  energyPrices?: EnergyPricesConfig;
  onUpdate: (data: SavingsData['ev']) => void;
}

export const useEVCalculator = ({
  milesPerYear,
  currentMPG,
  petrolPrice,
  electricityRate,
  evType,
  publicChargingFrequency,
  batteryCapacity,
  hasCurrentVehicle,
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
    // Use current MPG if they have a vehicle, otherwise use average new car MPG
    const effectiveMPG = hasCurrentVehicle ? (parseFloat(currentMPG) || 0) : 42; // 2024 average new car MPG
    const petrolPriceNum = parseFloat(petrolPrice) || 0;
    const electricityRateNum = parseFloat(electricityRate) || 0;
    const publicChargingFrequencyNum = parseFloat(publicChargingFrequency) || 0;
    const batteryCapacityNum = parseFloat(batteryCapacity) || 0;

    // Get public charging rate from config or default
    const publicChargingRate = energyPrices?.publicCharging || 0.79;

    // EV specifications based on type (UK market)
    const evSpecs: { [key: string]: { efficiency: number; cost: number; range: number } } = {
      'economy': { efficiency: 4.5, cost: 25000, range: 200 }, // miles per kWh
      'mid-range': { efficiency: 4.0, cost: 35000, range: 250 },
      'luxury': { efficiency: 3.5, cost: 55000, range: 300 },
      'truck': { efficiency: 3.0, cost: 50000, range: 250 }
    };

    const selectedEV = evSpecs[evType] || evSpecs['mid-range'];

    // Annual fuel costs for comparison vehicle (convert MPG to miles per litre)
    const milesPerLitre = effectiveMPG / 4.546; // 1 gallon = 4.546 litres
    const annualLitres = milesPerYearNum / milesPerLitre;
    const annualPetrolCost = annualLitres * petrolPriceNum;

    // Calculate EV charging costs considering home vs public charging
    const annualKWh = milesPerYearNum / selectedEV.efficiency;
    
    // Calculate public charging usage based on frequency and battery capacity
    const monthlyPublicCharges = publicChargingFrequencyNum;
    const annualPublicCharges = monthlyPublicCharges * 12;
    const kWhPerPublicCharge = batteryCapacityNum * 0.8; // Assume 80% charge from 20%
    const annualPublicChargingKWh = annualPublicCharges * kWhPerPublicCharge;
    
    // Remaining energy comes from home charging
    const annualHomeChargingKWh = Math.max(0, annualKWh - annualPublicChargingKWh);
    
    // Calculate total electricity costs
    const annualPublicChargingCost = annualPublicChargingKWh * publicChargingRate;
    const annualHomeChargingCost = annualHomeChargingKWh * electricityRateNum;
    const totalAnnualElectricityCost = annualPublicChargingCost + annualHomeChargingCost;

    // Annual fuel savings
    const annualFuelSavings = annualPetrolCost - totalAnnualElectricityCost;

    // Annual maintenance savings (EVs require ~50% less maintenance in UK)
    const annualMaintenanceSavings = 800; // Typical UK savings

    // Total annual savings
    const totalAnnualSavings = annualFuelSavings + annualMaintenanceSavings;

    // Vehicle cost comparison
    const petrolCarEquivalent = hasCurrentVehicle ? 0 : 28000; // If no current car, compare to new petrol car
    const vehicleCostPremium = selectedEV.cost - petrolCarEquivalent;

    // Payback period (considering UK EV grants where applicable)
    const evGrant = selectedEV.cost <= 35000 ? 2500 : 0; // UK EV grant for cars under £35k
    const netCostPremium = Math.max(0, vehicleCostPremium - evGrant);
    const paybackPeriod = totalAnnualSavings > 0 ? netCostPremium / totalAnnualSavings : 0;

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

  // Remove auto-calculation - users must click calculate button

  return { results, calculateSavings };
};