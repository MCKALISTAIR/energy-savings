import React, { useState } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';
import { useHeatPumpCalculator } from './heatpump/useHeatPumpCalculator';
import HeatPumpInputForm from './heatpump/HeatPumpInputForm';
import HeatPumpResults from './heatpump/HeatPumpResults';

interface HeatPumpCalculatorProps {
  onUpdate: (data: SavingsData['heatPump']) => void;
  energyPrices?: EnergyPricesConfig;
}

const HeatPumpCalculator: React.FC<HeatPumpCalculatorProps> = ({ onUpdate, energyPrices }) => {
  const [homeSize, setHomeSize] = useState<string>('');
  const [currentHeatingType, setCurrentHeatingType] = useState<string>('');
  const [monthlyHeatingBill, setMonthlyHeatingBill] = useState<string>('');
  const [heatPumpType, setHeatPumpType] = useState<string>('');
  const [quotePrice, setQuotePrice] = useState<string>('');

  const { results, calculateSavings } = useHeatPumpCalculator({
    homeSize,
    currentHeatingType,
    monthlyHeatingBill,
    heatPumpType,
    quotePrice,
    energyPrices,
    onUpdate
  });

  const clearForm = () => {
    setHomeSize('');
    setCurrentHeatingType('');
    setMonthlyHeatingBill('');
    setHeatPumpType('');
    setQuotePrice('');
  };

  // Check if any data has been entered
  const hasData = !!(homeSize || currentHeatingType || monthlyHeatingBill || heatPumpType || quotePrice);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <HeatPumpInputForm
        homeSize={homeSize}
        setHomeSize={setHomeSize}
        currentHeatingType={currentHeatingType}
        setCurrentHeatingType={setCurrentHeatingType}
        monthlyHeatingBill={monthlyHeatingBill}
        setMonthlyHeatingBill={setMonthlyHeatingBill}
        heatPumpType={heatPumpType}
        setHeatPumpType={setHeatPumpType}
        quotePrice={quotePrice}
        setQuotePrice={setQuotePrice}
        onCalculate={calculateSavings}
        onClear={clearForm}
      />

      <HeatPumpResults results={results} hasData={hasData} />
    </div>
  );
};

export default HeatPumpCalculator;