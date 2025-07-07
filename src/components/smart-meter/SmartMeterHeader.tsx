import React from 'react';

interface SmartMeterHeaderProps {
  selectedSupplier: string | null;
  isConnected: boolean;
}

const SmartMeterHeader: React.FC<SmartMeterHeaderProps> = ({
  selectedSupplier,
  isConnected
}) => {
  const getDescription = () => {
    if (selectedSupplier === 'octopus' && !isConnected) {
      return "Connect your Octopus Energy smart meter to get real-time energy usage data";
    }
    return "Select your energy supplier to connect your smart meter and get real-time energy data";
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Meter Integration</h2>
      <p className="text-gray-600">
        {getDescription()}
      </p>
    </div>
  );
};

export default SmartMeterHeader;