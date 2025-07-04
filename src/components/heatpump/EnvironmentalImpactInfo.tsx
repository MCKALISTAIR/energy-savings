import React from 'react';
import { SavingsData } from '@/pages/Index';

interface EnvironmentalImpactInfoProps {
  results: SavingsData['heatPump'];
}

const EnvironmentalImpactInfo: React.FC<EnvironmentalImpactInfoProps> = ({ results }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Environmental Impact</h4>
      <p className="text-sm text-muted-foreground">
        Your heat pump would reduce CO₂ emissions by approximately{' '}
        <span className="font-semibold text-green-600">
          {(results.monthlySavings * 12 * 20 / 200).toFixed(1)} tonnes
        </span>{' '}
        over 20 years compared to gas heating.
      </p>
    </div>
  );
};

export default EnvironmentalImpactInfo;