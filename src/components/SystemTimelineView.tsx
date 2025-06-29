
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Home, Edit, Trash2, X } from 'lucide-react';
import { SystemType } from '@/types';
import { format } from 'date-fns';
import { getSystemIcon, getSystemColor, getHouseName } from './SystemUtils';
import SystemSummaryStats from './SystemSummaryStats';

interface SystemTimelineViewProps {
  systems: SystemType[];
  houses: Array<{ id: string; name: string }>;
  onEdit: (system: SystemType) => void;
  onDelete: (systemId: string) => void;
}

const SystemTimelineView: React.FC<SystemTimelineViewProps> = ({
  systems,
  houses,
  onEdit,
  onDelete
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filter systems based on active filter
  const filteredSystems = activeFilter 
    ? systems.filter(system => system.type === activeFilter)
    : systems;

  // Sort systems by install date (newest first)
  const sortedSystems = [...filteredSystems].sort((a, b) => 
    new Date(b.installDate).getTime() - new Date(a.installDate).getTime()
  );

  // Group systems by year
  const systemsByYear = sortedSystems.reduce((acc, system) => {
    const year = new Date(system.installDate).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(system);
    return acc;
  }, {} as Record<number, SystemType[]>);

  const years = Object.keys(systemsByYear).map(Number).sort((a, b) => b - a);

  // Get unique system types for filter options
  const systemTypes = [...new Set(systems.map(system => system.type))];

  const handleFilterClick = (systemType: string) => {
    setActiveFilter(activeFilter === systemType ? null : systemType);
  };

  const clearFilter = () => {
    setActiveFilter(null);
  };

  const getFilterDisplayName = (type: string) => {
    switch (type) {
      case 'solar': return 'Solar';
      case 'battery': return 'Battery';
      case 'ev': return 'EV';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (systems.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No systems installed yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add your first renewable energy system to see your timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Options */}
      {systemTypes.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {systemTypes.map((type) => (
            <Badge
              key={type}
              className={`cursor-pointer transition-all ${
                activeFilter === type 
                  ? getSystemColor(type) + ' ring-2 ring-primary' 
                  : getSystemColor(type) + ' opacity-60 hover:opacity-100'
              }`}
              onClick={() => handleFilterClick(type)}
            >
              {getSystemIcon(type)}
              <span className="ml-1 capitalize">{getFilterDisplayName(type)}</span>
            </Badge>
          ))}
        </div>
      )}

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
            onClick={clearFilter}
            className="h-6 w-6 p-0 ml-2"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Timeline Content */}
      {filteredSystems.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No {activeFilter} systems found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different filter or add a new {activeFilter} system
          </p>
        </div>
      ) : (
        <>
          {years.map((year) => (
            <div key={year} className="relative">
              {/* Year Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {year}
                </div>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* Systems for this year */}
              <div className="space-y-3 ml-4">
                {systemsByYear[year].map((system, index) => (
                  <div key={system.id} className="relative">
                    {/* Timeline connector */}
                    <div className="absolute -left-6 top-4 w-2 h-2 bg-primary rounded-full"></div>
                    {index < systemsByYear[year].length - 1 && (
                      <div className="absolute -left-5 top-6 w-px h-12 bg-border"></div>
                    )}

                    {/* System Card */}
                    <div className="border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSystemColor(system.type)}>
                              {getSystemIcon(system.type)}
                              <span className="ml-1 capitalize">{system.type}</span>
                            </Badge>
                            <h3 className="font-semibold">{system.name}</h3>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(system.installDate, 'MMM dd, yyyy')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {getHouseName(system.houseId, houses)}
                            </div>
                          </div>

                          {/* System specifications preview */}
                          <div className="text-sm text-muted-foreground">
                            {system.type === 'solar' && (
                              <span>Capacity: {system.specifications.capacity}kW</span>
                            )}
                            {system.type === 'battery' && (
                              <span>Capacity: {system.specifications.capacity}kWh</span>
                            )}
                            {system.type === 'ev' && (
                              <span>
                                {system.specifications.make} {system.specifications.model}
                              </span>
                            )}
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
                  </div>
                ))}
              </div>
            </div>
          ))}

          <SystemSummaryStats systems={filteredSystems} houses={houses} years={years} />
        </>
      )}
    </div>
  );
};

export default SystemTimelineView;
