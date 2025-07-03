import React from 'react';
import { Shield } from 'lucide-react';

interface BatteryBackupInfoProps {
  outageFrequency: string;
  batterySize: string;
}

const BatteryBackupInfo: React.FC<BatteryBackupInfoProps> = ({ 
  outageFrequency, 
  batterySize 
}) => {
  const getOutageValue = () => {
    const values: { [key: string]: string } = {
      'low': '£400',
      'medium': '£1,200',
      'high': '£2,500'
    };
    return values[outageFrequency] || '£400';
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Backup Power Value
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          Estimated annual value of avoiding outages: <span className="font-semibold">{getOutageValue()}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Based on avoided food spoilage, lost productivity, and comfort
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{batterySize} kWh</div>
          <div className="text-xs text-muted-foreground">Backup Capacity</div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {(parseFloat(batterySize) / 5).toFixed(0)}h
          </div>
          <div className="text-xs text-muted-foreground">Backup Runtime</div>
        </div>
      </div>
    </>
  );
};

export default BatteryBackupInfo;