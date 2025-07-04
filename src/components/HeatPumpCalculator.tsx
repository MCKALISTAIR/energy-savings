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
  const [homeSize, setHomeSize] = useState<string>('185'); // m² instead of sq ft
  const [currentHeatingType, setCurrentHeatingType] = useState<string>('gas');
  const [monthlyHeatingBill, setMonthlyHeatingBill] = useState<string>('80');
  const [heatPumpType, setHeatPumpType] = useState<string>('air_source');

  const { results, calculateSavings } = useHeatPumpCalculator({
    homeSize,
    currentHeatingType,
    monthlyHeatingBill,
    heatPumpType,
    energyPrices,
    onUpdate
  });

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
        onCalculate={calculateSavings}
      />

      <HeatPumpResults results={results} />
    </div>
  );
};

export default HeatPumpCalculator;