
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const [gasConsumptionData, setGasConsumptionData] = useState<ConsumptionData | null>(null);
  const [electricityTariff, setElectricityTariff] = useState<any>(null);
  const [gasTariff, setGasTariff] = useState<any>(null);
  const [storedData, setStoredData] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const callOctopusApi = async (action: string, params: any = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('octopus-energy', {
        body: { 
          action, 
          userId: user?.id,
          ...params 
        }
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

  const validateApiKey = async (apiKey: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('octopus-energy', {
        body: { 
          action: 'validateApiKey',
          apiKey,
          userId: user?.id
        }
      });

      if (error) {
        throw error;
      }

      return { success: data.success, data: data.data, error: data.error };
    } catch (error) {
      console.error('API key validation error:', error);
      return { 
        success: false, 
        error: error.message || "Failed to validate API key",
        data: null 
      };
    } finally {
      setLoading(false);
    }
  };

  const getAccount = async (apiKey?: string) => {
    try {
      const data = await callOctopusApi('getAccount', { apiKey });
      setAccount(data);
      return data;
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  };

  const getElectricityConsumption = async (mpan: string, meterSerial: string, apiKey?: string, periodFrom?: string, periodTo?: string) => {
    try {
      const data = await callOctopusApi('getElectricityConsumption', { mpan, meterSerial, apiKey, periodFrom, periodTo });
      setConsumptionData(data);
      return data;
    } catch (error) {
      console.error('Failed to get electricity consumption data:', error);
      return null;
    }
  };

  const getGasConsumption = async (mprn: string, meterSerial: string, apiKey?: string, periodFrom?: string, periodTo?: string) => {
    try {
      const data = await callOctopusApi('getGasConsumption', { mprn, meterSerial, apiKey, periodFrom, periodTo });
      setGasConsumptionData(data);
      return data;
    } catch (error) {
      console.error('Failed to get gas consumption data:', error);
      return null;
    }
  };

  const getElectricityTariff = async (mpan: string, apiKey?: string) => {
    try {
      const data = await callOctopusApi('getElectricityTariff', { mpan, apiKey });
      setElectricityTariff(data);
      return data;
    } catch (error) {
      console.error('Failed to get electricity tariff data:', error);
      return null;
    }
  };

  const getGasTariff = async (mprn: string, apiKey?: string) => {
    try {
      const data = await callOctopusApi('getGasTariff', { mprn, apiKey });
      setGasTariff(data);
      return data;
    } catch (error) {
      console.error('Failed to get gas tariff data:', error);
      return null;
    }
  };

  const syncAllData = async (apiKey?: string) => {
    try {
      const data = await callOctopusApi('syncAllData', { apiKey });
      if (data.account) setAccount(data.account);
      toast({
        title: "Data Sync Complete",
        description: `Synced electricity and gas consumption data successfully`,
      });
      return data;
    } catch (error) {
      console.error('Failed to sync all data:', error);
      return null;
    }
  };

  const getStoredConsumptionData = async (meterType: 'electricity' | 'gas' = 'electricity', days: number = 7) => {
    if (!user) return null;
    
    try {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('smart_meter_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('meter_type', meterType)
        .gte('interval_start', fromDate.toISOString())
        .order('interval_start', { ascending: false });
      
      if (error) throw error;
      setStoredData(data);
      return data;
    } catch (error) {
      console.error('Failed to get stored consumption data:', error);
      return null;
    }
  };

  const getCurrentTariffRates = async (fuelType: 'electricity' | 'gas' = 'electricity') => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('tariff_rates')
        .select('*')
        .eq('user_id', user.id)
        .eq('fuel_type', fuelType)
        .is('valid_to', null)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to get current tariff rates:', error);
      return null;
    }
  };

  const calculateCurrentUsage = (meterType: 'electricity' | 'gas' = 'electricity') => {
    const data = meterType === 'electricity' ? consumptionData : gasConsumptionData;
    if (!data?.results.length) return 0;
    
    // Get the most recent consumption reading (in kWh for 30-minute period)
    const latestReading = data.results[0];
    // Convert to kW (multiply by 2 since it's a 30-minute reading for electricity)
    return meterType === 'electricity' ? latestReading.consumption * 2 : latestReading.consumption;
  };

  const calculateDailyUsage = (meterType: 'electricity' | 'gas' = 'electricity') => {
    const data = meterType === 'electricity' ? consumptionData : gasConsumptionData;
    if (!data?.results.length) return 0;
    
    // Get today's readings (last 48 half-hour periods)
    const today = new Date().toISOString().split('T')[0];
    const todayReadings = data.results.filter(reading => 
      reading.interval_start.startsWith(today)
    );
    
    return todayReadings.reduce((total, reading) => total + reading.consumption, 0);
  };

  const calculateDailyCost = async (meterType: 'electricity' | 'gas' = 'electricity') => {
    const dailyUsage = calculateDailyUsage(meterType);
    const tariff = await getCurrentTariffRates(meterType);
    
    if (!tariff || !dailyUsage) return 0;
    
    const unitCost = dailyUsage * tariff.unit_rate;
    const standingCharge = tariff.standing_charge;
    
    return unitCost + standingCharge;
  };

  // Load stored data on mount
  useEffect(() => {
    if (user) {
      getStoredConsumptionData('electricity');
      getStoredConsumptionData('gas');
    }
  }, [user]);

  return {
    loading,
    account,
    consumptionData,
    gasConsumptionData,
    electricityTariff,
    gasTariff,
    storedData,
    validateApiKey,
    getAccount,
    getElectricityConsumption,
    getGasConsumption,
    getElectricityTariff,
    getGasTariff,
    syncAllData,
    getStoredConsumptionData,
    getCurrentTariffRates,
    calculateCurrentUsage,
    calculateDailyUsage,
    calculateDailyCost
  };
};
