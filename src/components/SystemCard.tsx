
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Battery, Car, Edit, Trash2, Calendar, Thermometer, PoundSterling } from 'lucide-react';
import { System } from '@/hooks/useSystems';
import { formatCurrency } from '@/utils/currency';

interface SystemCardProps {
  system: System;
  onEdit: (system: System) => void;
  onDelete: (systemId: string) => void;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, onEdit, onDelete }) => {
  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Zap className="w-4 h-4" />;
      case 'battery': return <Battery className="w-4 h-4" />;
      case 'ev': return <Car className="w-4 h-4" />;
      case 'heat_pump': return <Thermometer className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSystemColor = (type: string) => {
    switch (type) {
      case 'solar': return 'bg-yellow-100 text-yellow-800';
      case 'battery': return 'bg-blue-100 text-blue-800';
      case 'ev': return 'bg-green-100 text-green-800';
      case 'heat_pump': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSystemDisplayName = (type: string) => {
    switch (type) {
      case 'heat_pump': return 'Heat Pump';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const renderSpecifications = () => {
    const { type, specifications } = system;
    
    if (type === 'solar' && specifications.capacity) {
      return <span>Capacity: {specifications.capacity}kW</span>;
    }
    
    if (type === 'battery' && specifications.capacity) {
      return <span>Capacity: {specifications.capacity}kWh</span>;
    }
    
    if (type === 'ev' && specifications.make && specifications.model) {
      return <span>{specifications.make} {specifications.model}</span>;
    }
    
    if (type === 'heat_pump' && specifications.heatPumpType) {
      return (
        <span>
          {specifications.heatPumpType} Heat Pump
          {specifications.cop ? `, COP: ${specifications.cop}` : ''}
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getSystemColor(system.type)}>
              {getSystemIcon(system.type)}
              <span className="ml-1">{getSystemDisplayName(system.type)}</span>
            </Badge>
            <h3 className="font-semibold">{system.name}</h3>
          </div>
          <div className="text-sm text-muted-foreground mb-2 space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Installed: {new Date(system.install_date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <PoundSterling className="w-3 h-3" />
              Cost: {formatCurrency(system.system_cost || 0)}
            </div>
          </div>
          <div className="text-sm">
            {renderSpecifications()}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(system)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(system.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemCard;
