import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface EnvironmentalImpactInfoProps {
  milesPerYear: string;
  currentMPG: string;
  
}

const EnvironmentalImpactInfo: React.FC<EnvironmentalImpactInfoProps> = ({ 
  milesPerYear, 
  currentMPG
}) => {
  const miles = parseFloat(milesPerYear);
  // Use provided MPG for comparison, or average new car MPG (42)
  const effectiveMPG = parseFloat(currentMPG) || 42;
  
  // Check if we have valid input values
  const hasValidData = !isNaN(miles) && !isNaN(effectiveMPG) && miles > 0 && effectiveMPG > 0;
  
  if (!hasValidData) {
    return (
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Environmental Impact
        </h4>
        <p className="text-sm text-muted-foreground">
          Please fill in <span className="font-medium">Annual Miles</span> and{' '}
          <span className="font-medium">Comparison MPG</span> to see environmental impact.
        </p>
      </div>
    );
  }

  const co2Savings = (miles / effectiveMPG) * 2.3 * 4.546 / 1000;
  
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Environmental Impact</h4>
      <p className="text-sm text-muted-foreground">
        You'll prevent approximately{' '}
        <span className="font-semibold text-green-600">
          {co2Savings.toFixed(1)} tonnes
        </span>{' '}
        of CO₂ emissions annually compared to equivalent petrol car.
      </p>
    </div>
  );
};

export default EnvironmentalImpactInfo;