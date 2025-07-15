import React from 'react';
import { SavingsData } from '@/pages/Index';
import { AlertTriangle } from 'lucide-react';

interface EnvironmentalImpactInfoProps {
  results: SavingsData['heatPump'];
}

const EnvironmentalImpactInfo: React.FC<EnvironmentalImpactInfoProps> = ({ results }) => {
  // Check if we have valid calculation results
  const hasValidData = !isNaN(results.monthlySavings) && results.monthlySavings > 0;
  
  if (!hasValidData) {
    return (
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Environmental Impact
        </h4>
        <p className="text-sm text-muted-foreground">
          Please fill in the heat pump details to see your potential environmental impact.
        </p>
      </div>
    );
  }

  const co2Reduction = results.monthlySavings * 12 * 20 / 200;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Environmental Impact</h4>
      <p className="text-sm text-muted-foreground">
        Your heat pump would reduce CO₂ emissions by approximately{' '}
        <span className="font-semibold text-green-600">
          {co2Reduction.toFixed(1)} tonnes
        </span>{' '}
        over 20 years compared to gas heating.
      </p>
    </div>
  );
};

export default EnvironmentalImpactInfo;