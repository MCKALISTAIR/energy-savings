import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FuelPrices {
  petrol: number;
  diesel: number;
  date: string;
  source: string;
  csvUrl?: string;
  message?: string;
}

export const useFuelPrices = () => {
  const [fuelPrices, setFuelPrices] = useState<FuelPrices | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuelPrices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('fetch-fuel-prices');
      
      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data) {
        setFuelPrices(data);
      } else {
        throw new Error('No data received from fuel prices API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch fuel prices';
      setError(errorMessage);
      console.error('Error fetching fuel prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFuelPrices();
  }, []);

  return {
    fuelPrices,
    loading,
    error,
    refetch: fetchFuelPrices
  };
};