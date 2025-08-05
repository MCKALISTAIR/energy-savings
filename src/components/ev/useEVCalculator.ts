import { useState, useEffect } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';
import { supabase } from '@/integrations/supabase/client';

interface UseEVCalculatorProps {
  milesPerYear: string;
  currentMPG: string;
  petrolPrice: string;
  electricityRate: string;
  evType: string;
  exactVehicleCost: string;
  useExactCost: boolean;
  publicChargingFrequency: string;
  batteryCapacity: string;
  hasCurrentVehicle: boolean;
  energyPrices?: EnergyPricesConfig;
  useRealTimeVehiclePricing?: boolean;
  onUpdate: (data: SavingsData['ev']) => void;
}

export const useEVCalculator = ({
  milesPerYear,
  currentMPG,
  petrolPrice,
  electricityRate,
  evType,
  exactVehicleCost,
  useExactCost,
  publicChargingFrequency,
  batteryCapacity,
  hasCurrentVehicle,
  energyPrices,
  useRealTimeVehiclePricing = false,
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

  const [dataSource, setDataSource] = useState<'marketcheck' | 'cached' | 'static'>('static');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const getVehiclePricing = async (vehicleClass: string, targetPrice: number): Promise<number> => {
    if (!useRealTimeVehiclePricing) {
      setDataSource('static');
      setLastUpdated(new Date().toISOString());
      // Static pricing: UK market adjustment for comparison vehicle
      const ukAdjustmentFactor = 1.175; // US prices are typically 15-20% lower than UK
      return targetPrice * 0.85 * ukAdjustmentFactor;
    }

    try {
      const { data, error } = await supabase.functions.invoke('vehicle-pricing', {
        body: {
          vehicleClass,
          targetPrice,
          useCache: true
        }
      });

      if (error) {
        console.error('Error fetching vehicle pricing:', error);
        setDataSource('static');
        setLastUpdated(new Date().toISOString());
        // Fallback to static pricing
        const ukAdjustmentFactor = 1.175;
        return targetPrice * 0.85 * ukAdjustmentFactor;
      }

      setDataSource(data.dataSource);
      setLastUpdated(data.lastUpdated);
      return data.priceInGBP;
    } catch (error) {
      console.error('Error calling vehicle pricing function:', error);
      setDataSource('static');
      setLastUpdated(new Date().toISOString());
      // Fallback to static pricing
      const ukAdjustmentFactor = 1.175;
      return targetPrice * 0.85 * ukAdjustmentFactor;
    }
  };

  const calculateSavings = async () => {
    const milesPerYearNum = parseFloat(milesPerYear) || 0;
    // Use current MPG if they have a vehicle, otherwise use average new car MPG
    const effectiveMPG = hasCurrentVehicle ? (parseFloat(currentMPG) || 0) : 42; // 2024 average new car MPG
    const petrolPriceNum = parseFloat(petrolPrice) || 0;
    const electricityRateNum = parseFloat(electricityRate) || 0;
    const publicChargingFrequencyNum = parseFloat(publicChargingFrequency) || 0;
    const batteryCapacityNum = parseFloat(batteryCapacity) || 0;

    // Get public charging rate from config or default
    const publicChargingRate = energyPrices?.publicCharging || 0.79;

    // EV specifications based on cost range (UK market)
    const evSpecs: { [key: string]: { efficiency: number; cost: number; range: number } } = {
      '10000': { efficiency: 4.2, cost: 10000, range: 180 }, // miles per kWh
      '20000': { efficiency: 4.3, cost: 20000, range: 200 },
      '30000': { efficiency: 4.2, cost: 30000, range: 220 },
      '40000': { efficiency: 4.0, cost: 40000, range: 250 },
      '50000': { efficiency: 3.8, cost: 50000, range: 280 },
      '60000': { efficiency: 3.7, cost: 60000, range: 300 },
      '70000': { efficiency: 3.6, cost: 70000, range: 320 },
      '80000': { efficiency: 3.5, cost: 80000, range: 350 },
      '90000': { efficiency: 3.4, cost: 90000, range: 380 },
      '100000': { efficiency: 3.3, cost: 100000, range: 400 }
    };

    const selectedEV = evSpecs[evType] || evSpecs['30000'];
    
    // Determine vehicle cost: use exact cost if provided, otherwise use dropdown selection
    let vehicleCost: number;
    if (useExactCost && exactVehicleCost && !isNaN(parseFloat(exactVehicleCost))) {
      vehicleCost = parseFloat(exactVehicleCost);
    } else {
      vehicleCost = selectedEV.cost;
    }

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

    // Get comparison vehicle pricing (async)
    const petrolCarEquivalent = hasCurrentVehicle ? 0 : await getVehiclePricing(evType, 28000);
    const vehicleCostPremium = vehicleCost - petrolCarEquivalent;

    // Payback period
    const netCostPremium = Math.max(0, vehicleCostPremium);
    const paybackPeriod = totalAnnualSavings > 0 ? netCostPremium / totalAnnualSavings : 0;

    // 10-year savings
    const tenYearSavings = (totalAnnualSavings * 10) - netCostPremium;

    const newResults = {
      vehicleCost: vehicleCost,
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

  return { results, calculateSavings, dataSource, lastUpdated };
};