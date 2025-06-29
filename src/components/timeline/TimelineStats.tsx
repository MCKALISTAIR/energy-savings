
import React from 'react';
import { System } from '@/hooks/useSystems';
import { getTimeActive, getFilterDisplayName } from './SystemTimelineUtils';

interface TimelineStatsProps {
  systems: System[];
  houses: Array<{ id: string; name: string; address: string }>;
  activeSystemFilter: string | null;
  activeYearFilter: number | null;
}

export const TimelineStats: React.FC<TimelineStatsProps> = ({
  systems,
  houses,
  activeSystemFilter,
  activeYearFilter
}) => {
  const timeActive = getTimeActive(systems);

  const getFilterDescription = () => {
    if (activeSystemFilter && activeYearFilter) {
      return `${getFilterDisplayName(activeSystemFilter)} Systems (${activeYearFilter})`;
    } else if (activeSystemFilter) {
      return `${getFilterDisplayName(activeSystemFilter)} Systems`;
    } else if (activeYearFilter) {
      return `Systems (${activeYearFilter})`;
    }
    return 'Total Systems';
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">{systems.length}</div>
          <div className="text-xs text-muted-foreground">
            {getFilterDescription()}
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">{timeActive.value}</div>
          <div className="text-xs text-muted-foreground">
            {timeActive.unit.charAt(0).toUpperCase() + timeActive.unit.slice(1)} Active
          </div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">{houses.length}</div>
          <div className="text-xs text-muted-foreground">Properties</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-primary">
            £{systems.reduce((total, system) => total + (system.system_cost || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Investment</div>
        </div>
      </div>
    </div>
  );
};
