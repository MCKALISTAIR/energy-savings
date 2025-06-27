import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { System } from '@/hooks/useSystems';
import { Zap, Battery, Car, Thermometer, Calendar, Home } from 'lucide-react';
import { format, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

interface SystemTimelineProps {
  systems: System[];
  houses: Array<{ id: string; name: string; address: string }>;
}

const SystemTimeline: React.FC<SystemTimelineProps> = ({ systems, houses }) => {
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
      case 'solar': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'battery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ev': return 'bg-green-100 text-green-800 border-green-200';
      case 'heat_pump': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHouseName = (houseId: string) => {
    const house = houses.find(h => h.id === houseId);
    return house?.name || 'Unknown House';
  };

  const getTimeActive = () => {
    if (systems.length === 0) return { value: 0, unit: 'days' };

    // Find the oldest system install date
    const oldestDate = systems.reduce((oldest, system) => {
      const systemDate = new Date(system.install_date);
      return systemDate < oldest ? systemDate : oldest;
    }, new Date(systems[0].install_date));

    const now = new Date();
    const days = differenceInDays(now, oldestDate);
    const weeks = differenceInWeeks(now, oldestDate);
    const months = differenceInMonths(now, oldestDate);
    const years = differenceInYears(now, oldestDate);

    // Return appropriate unit based on time elapsed
    // Only show years if it's actually been 1+ years
    if (years >= 1) {
      return { value: years, unit: years === 1 ? 'year' : 'years' };
    } else if (months >= 1) {
      return { value: months, unit: months === 1 ? 'month' : 'months' };
    } else if (weeks >= 1) {
      return { value: weeks, unit: weeks === 1 ? 'week' : 'weeks' };
    } else {
      return { value: Math.max(days, 0), unit: days === 1 ? 'day' : 'days' };
    }
  };

  // Sort systems by install date (newest first)
  const sortedSystems = [...systems].sort((a, b) => 
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
  const timeActive = getTimeActive();

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
                              {getHouseName(system.house_id)}
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
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
            <div>
              <div className="text-2xl font-bold text-primary">
                £{systems.reduce((total, system) => total + (system.system_cost || 0), 0).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Investment</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemTimeline;
