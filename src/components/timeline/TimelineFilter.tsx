
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getSystemIcon, getSystemColor, getFilterDisplayName } from './SystemTimelineUtils';

interface TimelineFilterProps {
  systemTypes: string[];
  years: number[];
  activeSystemFilters: string[];
  activeYearFilter: number | null;
  onSystemFilterToggle: (systemType: string) => void;
  onYearFilterClick: (year: number) => void;
  onClearSystemFilter: (systemType: string) => void;
  onClearYearFilter: () => void;
}

export const TimelineFilter: React.FC<TimelineFilterProps> = ({
  systemTypes,
  years,
  activeSystemFilters,
  activeYearFilter,
  onSystemFilterToggle,
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
              {systemTypes.map((type) => {
                const colorClasses = getSystemColor(type);
                const isActive = activeSystemFilters.includes(type);
                
                return (
                  <Badge
                    key={type}
                    className={`cursor-pointer transition-all ${
                      isActive 
                        ? `${colorClasses} ring-2 ring-primary shadow-sm font-bold [&>svg]:stroke-none [&>svg]:fill-current hover:${colorClasses}` 
                        : `${colorClasses} opacity-70 hover:opacity-100 hover:font-bold hover:[&>svg]:stroke-none hover:[&>svg]:fill-current hover:${colorClasses}`
                    }`}
                    onClick={() => onSystemFilterToggle(type)}
                  >
                    {getSystemIcon(type)}
                    <span className="ml-1 capitalize">{getFilterDisplayName(type)}</span>
                  </Badge>
                );
              })}
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
                  className={`cursor-pointer transition-all hover:font-bold ${
                    activeYearFilter === year 
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary shadow-sm font-bold hover:bg-primary' 
                      : 'bg-muted text-muted-foreground opacity-70 hover:opacity-100 hover:bg-muted'
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
      {(activeSystemFilters.length > 0 || activeYearFilter) && (
        <div className="space-y-2">
          {activeSystemFilters.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-2">
                Active System Filters ({activeSystemFilters.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {activeSystemFilters.map((systemType) => (
                  <div key={systemType} className="flex items-center gap-1">
                    <Badge className={`${getSystemColor(systemType)} font-bold [&>svg]:stroke-none [&>svg]:fill-current`}>
                      {getSystemIcon(systemType)}
                      <span className="ml-1 capitalize">{getFilterDisplayName(systemType)}</span>
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClearSystemFilter(systemType)}
                      className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive hover:font-bold"
                      aria-label={`Clear ${systemType} filter`}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeYearFilter && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
              <span className="text-sm text-muted-foreground">Year:</span>
              <Badge className="bg-primary text-primary-foreground font-bold hover:bg-primary">
                {activeYearFilter}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearYearFilter}
                className="h-6 w-6 p-0 ml-2 hover:bg-destructive/10 hover:text-destructive hover:font-bold"
                aria-label="Clear year filter"
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
