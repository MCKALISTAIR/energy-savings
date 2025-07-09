import { useState, useEffect } from 'react';
import { useOctopusEnergy } from '@/hooks/useOctopusEnergy';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MeterData {
  currentUsage: number;
  dailyUsage: number;
  dailyCost: number;
  tariffRate: number;
}

export const useSmartMeterData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [meterData, setMeterData] = useState<MeterData>({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });
  const [gasData, setGasData] = useState<MeterData>({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    loading, 
    account, 
    syncAllData,
    getCurrentTariffRates,
    calculateCurrentUsage,
    calculateDailyUsage,
    calculateDailyCost
  } = useOctopusEnergy();

  const connectMeter = async (apiKey: string) => {
    if (!apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide your Octopus Energy API key",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Use the enhanced sync function to get all data
      const syncResult = await syncAllData(apiKey);
      if (!syncResult) {
        throw new Error('Failed to sync meter data');
      }
      
      setIsConnected(true);
      await updateMeterData();
      
      toast({
        title: "Connected Successfully",
        description: "Your Octopus Energy smart meter is now connected!",
      });
      
      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to your smart meter",
        variant: "destructive"
      });
      return false;
    }
  };

  const disconnectMeter = () => {
    setIsConnected(false);
    setMeterData({
      currentUsage: 0,
      dailyUsage: 0,
      dailyCost: 0,
      tariffRate: 0
    });
    setGasData({
      currentUsage: 0,
      dailyUsage: 0,
      dailyCost: 0,
      tariffRate: 0
    });
  };

  const updateMeterData = async () => {
    try {
      // Update electricity meter data
      const electricityUsage = calculateCurrentUsage('electricity');
      const electricityDailyUsage = calculateDailyUsage('electricity');
      const electricityTariff = await getCurrentTariffRates('electricity');
      
      setMeterData({
        currentUsage: electricityUsage,
        dailyUsage: electricityDailyUsage,
        dailyCost: await calculateDailyCost('electricity') || 0,
        tariffRate: electricityTariff?.unit_rate || 0.28
      });
      
      // Update gas meter data if available
      const gasUsage = calculateCurrentUsage('gas');
      const gasDailyUsage = calculateDailyUsage('gas');
      const gasTariff = await getCurrentTariffRates('gas');
      
      if (gasUsage > 0 || gasDailyUsage > 0) {
        setGasData({
          currentUsage: gasUsage,
          dailyUsage: gasDailyUsage,
          dailyCost: await calculateDailyCost('gas') || 0,
          tariffRate: gasTariff?.unit_rate || 0.06
        });
      }
    } catch (error) {
      console.error('Failed to update meter data:', error);
    }
  };

  const refreshMeterData = async (apiKey?: string) => {
    if (!isConnected || !apiKey) return;
    
    try {
      await syncAllData(apiKey);
      await updateMeterData();
      
      toast({
        title: "Data Updated",
        description: "Smart meter data refreshed successfully",
      });
    } catch (error) {
      console.error('Failed to refresh meter data:', error);
      toast({
        title: "Refresh Failed",
        description: "Failed to update smart meter data",
        variant: "destructive"
      });
    }
  };

  return {
    isConnected,
    meterData,
    gasData,
    loading,
    account,
    connectMeter,
    disconnectMeter,
    refreshMeterData,
    updateMeterData
  };
};