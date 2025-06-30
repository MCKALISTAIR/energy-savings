import { Zap, Battery, Car, Thermometer } from 'lucide-react';
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';
import { System } from '@/hooks/useSystems';

export const getSystemIcon = (type: string) => {
  switch (type) {
    case 'solar': return <Zap className="w-4 h-4" />;
    case 'battery': return <Battery className="w-4 h-4" />;
    case 'ev': return <Car className="w-4 h-4" />;
    case 'heat_pump': return <Thermometer className="w-4 h-4" />;
    default: return null;
  }
};

export const getSystemColor = (type: string) => {
  switch (type) {
    case 'solar': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900';
    case 'battery': return 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 hover:text-blue-900';
    case 'ev': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:text-green-900';
    case 'heat_pump': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:text-purple-900';
    default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900';
  }
};

export const getFilterDisplayName = (type: string) => {
  switch (type) {
    case 'solar': return 'Solar';
    case 'battery': return 'Battery';
    case 'ev': return 'EV';
    case 'heat_pump': return 'Heat Pump';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const getHouseName = (houseId: string, houses: Array<{ id: string; name: string; address: string }>) => {
  const house = houses.find(h => h.id === houseId);
  return house?.name || 'Unknown House';
};

export const getTimeActive = (systems: System[]) => {
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
