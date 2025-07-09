import { useState, useEffect } from 'react';
import { useOctopusEnergy } from '@/hooks/useOctopusEnergy';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSmartMeterIntegration = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReverseTransitioning, setIsReverseTransitioning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    apiKey: ''
  });
  const [meterData, setMeterData] = useState({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });
  const [gasData, setGasData] = useState({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });

  const { user } = useAuth();
  const { 
    selectedSupplier: savedSupplier, 
    saveSelectedSupplier, 
    clearSelectedSupplier 
  } = useUserPreferences();

  const { 
    loading, 
    account, 
    consumptionData,
    gasConsumptionData,
    getAccount, 
    getElectricityConsumption,
    getGasConsumption,
    getElectricityTariff,
    getGasTariff,
    syncAllData,
    getCurrentTariffRates,
    calculateCurrentUsage,
    calculateDailyUsage,
    calculateDailyCost
  } = useOctopusEnergy();

  const { toast } = useToast();

  // Load saved supplier preference when available
  useEffect(() => {
    if (savedSupplier && !selectedSupplier) {
      setSelectedSupplier(savedSupplier);
    }
  }, [savedSupplier, selectedSupplier]);

  const handleConnect = async () => {
    if (!connectionForm.apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide your Octopus Energy API key",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get account information with API key
      const accountData = await getAccount(connectionForm.apiKey);
      if (!accountData) {
        throw new Error('Failed to retrieve account information');
      }

      // Use the enhanced sync function to get all data
      const syncResult = await syncAllData(connectionForm.apiKey);
      if (!syncResult) {
        throw new Error('Failed to sync meter data');
      }
      
      setIsConnected(true);
      
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

      toast({
        title: "Connected Successfully",
        description: "Your Octopus Energy smart meter is now connected!",
      });

    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to your smart meter",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = () => {
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

  const handleSupplierSelect = async (supplierId: string) => {
    setIsTransitioning(true);
    // Extended delay to allow full transition animation to complete
    setTimeout(async () => {
      setSelectedSupplier(supplierId);
      setIsTransitioning(false);
      
      // Save to user preferences if authenticated, show guest prompt if not
      if (user) {
        await saveSelectedSupplier(supplierId);
      } else {
        setShowGuestPrompt(true);
      }
    }, 900);
  };

  const handleBackToSuppliers = async () => {
    setIsReverseTransitioning(true);
    // Clear saved preference if user is authenticated
    if (user) {
      await clearSelectedSupplier();
    }
    // Show reverse animation first
    setTimeout(() => {
      setSelectedSupplier(null);
      setIsReverseTransitioning(false);
      setShowGuestPrompt(false);
    }, 900);
  };

  const handleDismissGuestPrompt = () => {
    setShowGuestPrompt(false);
  };

  const refreshMeterData = async () => {
    if (!isConnected || !connectionForm.apiKey) return;
    
    try {
      await syncAllData(connectionForm.apiKey);
      
      // Update electricity data
      const electricityUsage = calculateCurrentUsage('electricity');
      const electricityDailyUsage = calculateDailyUsage('electricity');
      
      setMeterData(prev => ({
        ...prev,
        currentUsage: electricityUsage,
        dailyUsage: electricityDailyUsage,
        dailyCost: electricityDailyUsage * prev.tariffRate
      }));
      
      // Update gas data if available
      const gasUsage = calculateCurrentUsage('gas');
      const gasDailyUsage = calculateDailyUsage('gas');
      
      if (gasUsage > 0 || gasDailyUsage > 0) {
        setGasData(prev => ({
          ...prev,
          currentUsage: gasUsage,
          dailyUsage: gasDailyUsage,
          dailyCost: gasDailyUsage * prev.tariffRate
        }));
      }
      
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

  // Auto-update data every 30 minutes when connected
  useEffect(() => {
    if (!isConnected || !connectionForm.apiKey) return;

    const interval = setInterval(refreshMeterData, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [isConnected, connectionForm.apiKey]);

  return {
    selectedSupplier,
    isTransitioning,
    isReverseTransitioning,
    isConnected,
    connectionForm,
    meterData,
    gasData,
    loading,
    account,
    showGuestPrompt,
    setConnectionForm,
    handleConnect,
    handleDisconnect,
    handleSupplierSelect,
    handleBackToSuppliers,
    handleDismissGuestPrompt,
    refreshMeterData
  };
};