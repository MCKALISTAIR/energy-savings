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
  const mpg = parseFloat(currentMPG);
  
  // Check if we have valid input values
  const hasValidData = !isNaN(miles) && !isNaN(mpg) && miles > 0 && mpg > 0;
  
  if (!hasValidData) {
    return (
      <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          Environmental Impact
        </h4>
        <p className="text-sm text-muted-foreground">
          Please fill in <span className="font-medium">Annual Miles</span> and{' '}
          <span className="font-medium">Current MPG</span> to see your potential CO₂ savings.
        </p>
      </div>
    );
  }

  const co2Savings = (miles / mpg) * 2.3 * 4.546 / 1000;
  
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Environmental Impact</h4>
      <p className="text-sm text-muted-foreground">
        You'll prevent approximately{' '}
        <span className="font-semibold text-green-600">
          {co2Savings.toFixed(1)} tonnes
        </span>{' '}
        of CO₂ emissions annually.
      </p>
    </div>
  );
};

export default EnvironmentalImpactInfo;