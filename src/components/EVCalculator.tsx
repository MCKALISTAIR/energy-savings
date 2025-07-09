
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
  const [evType, setEVType] = useState<string>('');
  const [publicChargingFrequency, setPublicChargingFrequency] = useState<string>('');
  const [batteryCapacity, setBatteryCapacity] = useState<string>('');

  const { results, calculateSavings } = useEVCalculator({
    milesPerYear,
    currentMPG,
    petrolPrice,
    electricityRate,
    evType,
    publicChargingFrequency,
    batteryCapacity,
    energyPrices,
    onUpdate
  });

  const clearForm = () => {
    setMilesPerYear('');
    setCurrentMPG('');
    setPetrolPrice('');
    setElectricityRate('');
    setEVType('');
    setPublicChargingFrequency('');
    setBatteryCapacity('');
  };

  // Update form values when energyPrices change
  useEffect(() => {
    if (energyPrices) {
      setPetrolPrice(energyPrices.petrol.toString());
      setElectricityRate(energyPrices.electricity.toString());
    }
  }, [energyPrices]);

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
        evType={evType}
        setEVType={setEVType}
        publicChargingFrequency={publicChargingFrequency}
        setPublicChargingFrequency={setPublicChargingFrequency}
        batteryCapacity={batteryCapacity}
        setBatteryCapacity={setBatteryCapacity}
        onCalculate={calculateSavings}
        onClear={clearForm}
      />

      <EVResults 
        results={results} 
        milesPerYear={milesPerYear} 
        currentMPG={currentMPG} 
      />
    </div>
  );
};

export default EVCalculator;
