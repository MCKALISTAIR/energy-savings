
import React from 'react';
import { SystemType } from '@/types';
import { getTimeActive } from './SystemUtils';

interface SystemSummaryStatsProps {
  systems: SystemType[];
  houses: Array<{ id: string; name: string }>;
  years: number[];
}

const SystemSummaryStats: React.FC<SystemSummaryStatsProps> = ({
  systems,
  houses,
  years
}) => {
  const timeActive = getTimeActive(systems);

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">{systems.length}</div>
          <div className="text-xs text-muted-foreground">Total Systems</div>
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
      </div>
    </div>
  );
};

export default SystemSummaryStats;
