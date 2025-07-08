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
    getAccount, 
    getConsumption, 
    getCurrentTariff,
    calculateCurrentUsage,
    calculateDailyUsage
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

      // Get the first property's meter details
      const property = accountData.properties?.[0];
      if (!property?.electricity_meter_points?.[0]) {
        throw new Error('No electricity meter found on account');
      }

      const meterPoint = property.electricity_meter_points[0];
      const mpan = meterPoint.mpan;
      const meterSerial = meterPoint.meters?.[0]?.serial_number;

      if (!meterSerial) {
        throw new Error('No meter serial number found');
      }

      // Get consumption data
      const consumption = await getConsumption(mpan, meterSerial, connectionForm.apiKey);
      if (!consumption) {
        throw new Error('Failed to retrieve consumption data');
      }

      // Get tariff information
      const tariff = await getCurrentTariff(mpan, connectionForm.apiKey);
      
      setIsConnected(true);
      
      // Update meter data with real values
      const currentUsage = calculateCurrentUsage();
      const dailyUsage = calculateDailyUsage();
      
      setMeterData({
        currentUsage,
        dailyUsage,
        dailyCost: dailyUsage * 0.28, // Default rate, should be from tariff
        tariffRate: 0.28 // Should be extracted from tariff data
      });

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

  // Auto-update data every 30 minutes when connected
  useEffect(() => {
    if (!isConnected || !connectionForm.apiKey || !account) return;

    const interval = setInterval(async () => {
      try {
        const property = account.properties?.[0];
        const meterPoint = property?.electricity_meter_points?.[0];
        const mpan = meterPoint?.mpan;
        const meterSerial = meterPoint?.meters?.[0]?.serial_number;
        
        if (mpan && meterSerial) {
          await getConsumption(mpan, meterSerial, connectionForm.apiKey);
          
          const currentUsage = calculateCurrentUsage();
          const dailyUsage = calculateDailyUsage();
          
          setMeterData(prev => ({
            ...prev,
            currentUsage,
            dailyUsage,
            dailyCost: dailyUsage * prev.tariffRate
          }));
        }
      } catch (error) {
        console.error('Failed to update consumption data:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isConnected, connectionForm.apiKey, account]);

  return {
    selectedSupplier,
    isTransitioning,
    isReverseTransitioning,
    isConnected,
    connectionForm,
    meterData,
    loading,
    account,
    showGuestPrompt,
    setConnectionForm,
    handleConnect,
    handleDisconnect,
    handleSupplierSelect,
    handleBackToSuppliers,
    handleDismissGuestPrompt
  };
};