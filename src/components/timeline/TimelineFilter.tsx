
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getSystemIcon, getSystemColor, getFilterDisplayName } from './SystemTimelineUtils';

interface TimelineFilterProps {
  systemTypes: string[];
  years: number[];
  activeSystemFilter: string | null;
  activeYearFilter: number | null;
  onSystemFilterClick: (systemType: string) => void;
  onYearFilterClick: (year: number) => void;
  onClearSystemFilter: () => void;
  onClearYearFilter: () => void;
}

export const TimelineFilter: React.FC<TimelineFilterProps> = ({
  systemTypes,
  years,
  activeSystemFilter,
  activeYearFilter,
  onSystemFilterClick,
  onYearFilterClick,
  onClearSystemFilter,
  onClearYearFilter
}) => {
  if (systemTypes.length <= 1 && years.length <= 1) return null;

  return (
    <>
      {/* Filter Options */}
      <div className="space-y-3">
        {/* System Type Filters */}
        {systemTypes.length > 1 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Filter by System Type:</div>
            <div className="flex flex-wrap gap-2">
              {systemTypes.map((type) => (
                <Badge
                  key={type}
                  className={`cursor-pointer transition-all ${
                    activeSystemFilter === type 
                      ? getSystemColor(type) + ' ring-2 ring-primary' 
                      : getSystemColor(type) + ' opacity-60 hover:opacity-100'
                  }`}
                  onClick={() => onSystemFilterClick(type)}
                >
                  {getSystemIcon(type)}
                  <span className="ml-1 capitalize">{getFilterDisplayName(type)}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Year Filters */}
        {years.length > 1 && (
          <div>
            <div className="text-sm text-muted-foreground mb-2">Filter by Year:</div>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <Badge
                  key={year}
                  className={`cursor-pointer transition-all ${
                    activeYearFilter === year 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  onClick={() => onYearFilterClick(year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {(activeSystemFilter || activeYearFilter) && (
        <div className="space-y-2">
          {activeSystemFilter && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
              <span className="text-sm text-muted-foreground">System Type:</span>
              <Badge className={getSystemColor(activeSystemFilter)}>
                {getSystemIcon(activeSystemFilter)}
                <span className="ml-1 capitalize">{getFilterDisplayName(activeSystemFilter)} Systems</span>
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSystemFilter}
                className="h-6 w-6 p-0 ml-2"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
          
          {activeYearFilter && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
              <span className="text-sm text-muted-foreground">Year:</span>
              <Badge className="bg-primary text-primary-foreground">
                {activeYearFilter}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearYearFilter}
                className="h-6 w-6 p-0 ml-2"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
