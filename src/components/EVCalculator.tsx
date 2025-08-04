
import React, { useState, useEffect } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';
import { useEVCalculator } from './ev/useEVCalculator';
import EVInputForm from './ev/EVInputForm';
import EVResults from './ev/EVResults';

interface EVCalculatorProps {
  onUpdate: (data: SavingsData['ev']) => void;
  energyPrices?: EnergyPricesConfig;
}

const EVCalculator: React.FC<EVCalculatorProps> = ({ onUpdate, energyPrices }) => {
  const [milesPerYear, setMilesPerYear] = useState<string>('');
  const [currentMPG, setCurrentMPG] = useState<string>('');
  const [petrolPrice, setPetrolPrice] = useState<string>('');
  const [electricityRate, setElectricityRate] = useState<string>('');
  const [electricityUnit, setElectricityUnit] = useState<'pounds' | 'pence'>('pence');
  const [evType, setEVType] = useState<string>('');
  const [publicChargingFrequency, setPublicChargingFrequency] = useState<string>('');
  const [batteryCapacity, setBatteryCapacity] = useState<string>('');
  const [hasCurrentVehicle, setHasCurrentVehicle] = useState<boolean>(true);

  // Convert electricity rate to pounds for calculation if needed
  const electricityRateInPounds = electricityUnit === 'pence' && electricityRate 
    ? (parseFloat(electricityRate) / 100).toString() 
    : electricityRate;

  const { results, calculateSavings } = useEVCalculator({
    milesPerYear,
    currentMPG,
    petrolPrice,
    electricityRate: electricityRateInPounds,
    evType,
    publicChargingFrequency,
    batteryCapacity,
    hasCurrentVehicle,
    energyPrices,
    onUpdate
  });

  const clearForm = () => {
    setMilesPerYear('');
    setCurrentMPG('');
    setPetrolPrice('');
    setElectricityRate('');
    setElectricityUnit('pence');
    setEVType('');
    setPublicChargingFrequency('');
    setBatteryCapacity('');
    setHasCurrentVehicle(true);
  };

  // Update form values when energyPrices change
  useEffect(() => {
    if (energyPrices) {
      setPetrolPrice(energyPrices.petrol.toString());
      // Convert to current unit (energyPrices are in pounds)
      if (electricityUnit === 'pence') {
        setElectricityRate((energyPrices.electricity * 100).toString());
      } else {
        setElectricityRate(energyPrices.electricity.toString());
      }
    }
  }, [energyPrices, electricityUnit]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <EVInputForm
        milesPerYear={milesPerYear}
        setMilesPerYear={setMilesPerYear}
        currentMPG={currentMPG}
        setCurrentMPG={setCurrentMPG}
        petrolPrice={petrolPrice}
        setPetrolPrice={setPetrolPrice}
        electricityRate={electricityRate}
        setElectricityRate={setElectricityRate}
        electricityUnit={electricityUnit}
        setElectricityUnit={setElectricityUnit}
        evType={evType}
        setEVType={setEVType}
        publicChargingFrequency={publicChargingFrequency}
        setPublicChargingFrequency={setPublicChargingFrequency}
        batteryCapacity={batteryCapacity}
        setBatteryCapacity={setBatteryCapacity}
        hasCurrentVehicle={hasCurrentVehicle}
        setHasCurrentVehicle={setHasCurrentVehicle}
        onCalculate={calculateSavings}
        onClear={clearForm}
      />

      <EVResults 
        results={results} 
        milesPerYear={milesPerYear} 
        currentMPG={currentMPG} 
        hasCurrentVehicle={hasCurrentVehicle}
      />
    </div>
  );
};

export default EVCalculator;
