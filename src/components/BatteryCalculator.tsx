
import React, { useState } from 'react';
import { SavingsData } from '@/pages/Index';
import { EnergyPricesConfig } from '@/components/dashboard/types';
import { useBatteryCalculator } from './battery/useBatteryCalculator';
import BatteryInputForm from './battery/BatteryInputForm';
import BatteryResults from './battery/BatteryResults';

interface BatteryCalculatorProps {
  onUpdate: (data: SavingsData['battery']) => void;
  energyPrices?: EnergyPricesConfig;
}

const BatteryCalculator: React.FC<BatteryCalculatorProps> = ({ onUpdate, energyPrices }) => {
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [peakUsage, setPeakUsage] = useState<string>('');
  const [outageFrequency, setOutageFrequency] = useState<string>('');
  const [batterySize, setBatterySize] = useState<string>('');

  const { results, calculateSavings } = useBatteryCalculator({
    monthlyBill,
    peakUsage,
    outageFrequency,
    batterySize,
    energyPrices,
    onUpdate
  });

  const clearForm = () => {
    setMonthlyBill('');
    setPeakUsage('');
    setOutageFrequency('');
    setBatterySize('');
  };

  // Check if any data has been entered
  const hasData = !!(monthlyBill || peakUsage || outageFrequency || batterySize);

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
      <BatteryInputForm
        monthlyBill={monthlyBill}
        setMonthlyBill={setMonthlyBill}
        peakUsage={peakUsage}
        setPeakUsage={setPeakUsage}
        outageFrequency={outageFrequency}
        setOutageFrequency={setOutageFrequency}
        batterySize={batterySize}
        setBatterySize={setBatterySize}
        onCalculate={calculateSavings}
        onClear={clearForm}
      />

      <BatteryResults
        results={results}
        outageFrequency={outageFrequency}
        batterySize={batterySize}
        hasData={hasData}
      />
    </div>
  );
};

export default BatteryCalculator;
