
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getSystemIcon, getSystemColor, getFilterDisplayName } from './SystemTimelineUtils';

interface TimelineFilterProps {
  systemTypes: string[];
  activeFilter: string | null;
  onFilterClick: (systemType: string) => void;
  onClearFilter: () => void;
}

export const TimelineFilter: React.FC<TimelineFilterProps> = ({
  systemTypes,
  activeFilter,
  onFilterClick,
  onClearFilter
}) => {
  if (systemTypes.length <= 1) return null;

  return (
    <>
      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {systemTypes.map((type) => (
          <Badge
            key={type}
            className={`cursor-pointer transition-all ${
              activeFilter === type 
                ? getSystemColor(type) + ' ring-2 ring-primary' 
                : getSystemColor(type) + ' opacity-60 hover:opacity-100'
            }`}
            onClick={() => onFilterClick(type)}
          >
            {getSystemIcon(type)}
            <span className="ml-1 capitalize">{getFilterDisplayName(type)}</span>
          </Badge>
        ))}
      </div>

      {/* Active Filter Display */}
      {activeFilter && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
          <span className="text-sm text-muted-foreground">Showing:</span>
          <Badge className={getSystemColor(activeFilter)}>
            {getSystemIcon(activeFilter)}
            <span className="ml-1 capitalize">{getFilterDisplayName(activeFilter)} Systems</span>
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilter}
            className="h-6 w-6 p-0 ml-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </>
  );
};
