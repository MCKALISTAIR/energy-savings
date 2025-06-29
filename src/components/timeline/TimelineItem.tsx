
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Home } from 'lucide-react';
import { format } from 'date-fns';
import { System } from '@/hooks/useSystems';
import { getSystemIcon, getSystemColor, getHouseName } from './SystemTimelineUtils';

interface TimelineItemProps {
  system: System;
  houses: Array<{ id: string; name: string; address: string }>;
  isLast: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ 
  system, 
  houses, 
  isLast 
}) => {
  return (
    <div className="relative">
      {/* Timeline connector */}
      <div className="absolute -left-6 top-4 w-2 h-2 bg-primary rounded-full"></div>
      {!isLast && (
        <div className="absolute -left-5 top-6 w-px h-12 bg-border"></div>
      )}

      {/* System Card */}
      <div className="border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getSystemColor(system.type)}>
                {getSystemIcon(system.type)}
                <span className="ml-1 capitalize">
                  {system.type === 'heat_pump' ? 'Heat Pump' : system.type}
                </span>
              </Badge>
              <h3 className="font-semibold">{system.name}</h3>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(system.install_date), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <Home className="w-3 h-3" />
                {getHouseName(system.house_id, houses)}
              </div>
            </div>

            {/* System specifications preview */}
            <div className="text-sm text-muted-foreground">
              {system.type === 'solar' && system.specifications.capacity && (
                <span>Capacity: {system.specifications.capacity}kW</span>
              )}
              {system.type === 'battery' && system.specifications.capacity && (
                <span>Capacity: {system.specifications.capacity}kWh</span>
              )}
              {system.type === 'ev' && (
                <span>
                  {system.specifications.make} {system.specifications.model}
                </span>
              )}
              {system.type === 'heat_pump' && system.specifications.type && (
                <span>Type: {system.specifications.type}</span>
              )}
            </div>
          </div>

          {/* System cost if available */}
          {system.system_cost && system.system_cost > 0 && (
            <div className="text-right">
              <div className="text-sm font-medium">
                £{system.system_cost.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Investment</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
