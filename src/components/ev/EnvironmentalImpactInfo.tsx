import React from 'react';

interface EnvironmentalImpactInfoProps {
  milesPerYear: string;
  currentMPG: string;
}

const EnvironmentalImpactInfo: React.FC<EnvironmentalImpactInfoProps> = ({ 
  milesPerYear, 
  currentMPG 
}) => {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Environmental Impact</h4>
      <p className="text-sm text-muted-foreground">
        You'll prevent approximately{' '}
        <span className="font-semibold text-green-600">
          {((parseFloat(milesPerYear) / parseFloat(currentMPG)) * 2.3 * 4.546 / 1000).toFixed(1)} tonnes
        </span>{' '}
        of CO₂ emissions annually.
      </p>
    </div>
  );
};

export default EnvironmentalImpactInfo;