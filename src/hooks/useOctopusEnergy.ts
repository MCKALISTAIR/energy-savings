
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OctopusAccount {
  number: string;
  properties: Array<{
    id: number;
    moved_in_at: string;
    moved_out_at: string | null;
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    town: string;
    county: string;
    postcode: string;
    electricity_meter_points: Array<{
      mpan: string;
      profile_class: number;
      consumption_standard: number;
      meters: Array<{
        serial_number: string;
        registers: Array<{
          identifier: string;
          rate: string;
          is_settlement_register: boolean;
        }>;
      }>;
      agreements: Array<{
        tariff_code: string;
        valid_from: string;
        valid_to: string | null;
      }>;
    }>;
  }>;
}

interface ConsumptionData {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    consumption: number;
    interval_start: string;
    interval_end: string;
  }>;
}

export const useOctopusEnergy = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<OctopusAccount | null>(null);
  const [consumptionData, setConsumptionData] = useState<ConsumptionData | null>(null);
  const { toast } = useToast();

  const callOctopusApi = async (action: string, params: any = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('octopus-energy', {
        body: { action, ...params }
      });

      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      console.error('Octopus Energy API error:', error);
      toast({
        title: "API Error",
        description: error.message || "Failed to connect to Octopus Energy API",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAccount = async () => {
    try {
      const data = await callOctopusApi('getAccount');
      setAccount(data);
      return data;
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  };

  const getConsumption = async (mpan: string, meterSerial: string) => {
    try {
      const data = await callOctopusApi('getConsumption', { mpan, meterSerial });
      setConsumptionData(data);
      return data;
    } catch (error) {
      console.error('Failed to get consumption data:', error);
      return null;
    }
  };

  const getCurrentTariff = async (mpan: string) => {
    try {
      const data = await callOctopusApi('getCurrentTariff', { mpan });
      return data;
    } catch (error) {
      console.error('Failed to get tariff data:', error);
      return null;
    }
  };

  const calculateCurrentUsage = () => {
    if (!consumptionData?.results.length) return 0;
    
    // Get the most recent consumption reading (in kWh for 30-minute period)
    const latestReading = consumptionData.results[0];
    // Convert to kW (multiply by 2 since it's a 30-minute reading)
    return latestReading.consumption * 2;
  };

  const calculateDailyUsage = () => {
    if (!consumptionData?.results.length) return 0;
    
    // Get today's readings (last 48 half-hour periods)
    const today = new Date().toISOString().split('T')[0];
    const todayReadings = consumptionData.results.filter(reading => 
      reading.interval_start.startsWith(today)
    );
    
    return todayReadings.reduce((total, reading) => total + reading.consumption, 0);
  };

  return {
    loading,
    account,
    consumptionData,
    getAccount,
    getConsumption,
    getCurrentTariff,
    calculateCurrentUsage,
    calculateDailyUsage
  };
};
