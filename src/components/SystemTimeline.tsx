
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { System } from '@/hooks/useSystems';
import { Calendar } from 'lucide-react';
import { TimelineFilter } from './timeline/TimelineFilter';
import { TimelineItem } from './timeline/TimelineItem';
import { TimelineStats } from './timeline/TimelineStats';

interface SystemTimelineProps {
  systems: System[];
  houses: Array<{ id: string; name: string; address: string }>;
}

const SystemTimeline: React.FC<SystemTimelineProps> = ({ systems, houses }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filter systems based on active filter
  const filteredSystems = activeFilter 
    ? systems.filter(system => system.type === activeFilter)
    : systems;

  // Sort systems by install date (newest first)
  const sortedSystems = [...filteredSystems].sort((a, b) => 
    new Date(b.install_date).getTime() - new Date(a.install_date).getTime()
  );

  // Group systems by year for better organization
  const systemsByYear = sortedSystems.reduce((acc, system) => {
    const year = new Date(system.install_date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(system);
    return acc;
  }, {} as Record<number, System[]>);

  const years = Object.keys(systemsByYear).map(Number).sort((a, b) => b - a);

  // Get unique system types for filter options
  const systemTypes = [...new Set(systems.map(system => system.type))];

  const handleFilterClick = (systemType: string) => {
    setActiveFilter(activeFilter === systemType ? null : systemType);
  };

  const clearFilter = () => {
    setActiveFilter(null);
  };

  if (systems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No systems installed yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first renewable energy system to see your timeline
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Installation Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TimelineFilter
            systemTypes={systemTypes}
            activeFilter={activeFilter}
            onFilterClick={handleFilterClick}
            onClearFilter={clearFilter}
          />

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
                      <TimelineItem
                        key={system.id}
                        system={system}
                        houses={houses}
                        isLast={index === systemsByYear[year].length - 1}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <TimelineStats
          systems={filteredSystems}
          houses={houses}
          activeFilter={activeFilter}
        />
      </CardContent>
    </Card>
  );
};

export default SystemTimeline;
