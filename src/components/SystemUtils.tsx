
import { SystemType } from '@/types';
import { Zap, Battery, Car } from 'lucide-react';
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears } from 'date-fns';

export const getSystemIcon = (type: string) => {
  switch (type) {
    case 'solar': return <Zap className="w-4 h-4" />;
    case 'battery': return <Battery className="w-4 h-4" />;
    case 'ev': return <Car className="w-4 h-4" />;
    default: return null;
  }
};

export const getSystemColor = (type: string) => {
  switch (type) {
    case 'solar': return 'bg-yellow-100 text-yellow-800';
    case 'battery': return 'bg-blue-100 text-blue-800';
    case 'ev': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getHouseName = (houseId: string, houses: Array<{ id: string; name: string }>) => {
  const house = houses.find(h => h.id === houseId);
  return house?.name || 'Unknown House';
};

export const getTimeActive = (systems: SystemType[]) => {
  if (systems.length === 0) return { value: 0, unit: 'days' };

  // Find the oldest system install date
  const oldestDate = systems.reduce((oldest, system) => {
    const systemDate = system.installDate;
    return systemDate < oldest ? systemDate : oldest;
  }, systems[0].installDate);

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
