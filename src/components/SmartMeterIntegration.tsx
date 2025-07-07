import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useOctopusEnergy } from '@/hooks/useOctopusEnergy';
import { useToast } from '@/hooks/use-toast';
import SupplierSelectionGrid from './smart-meter/SupplierSelectionGrid';
import SelectedSupplierDisplay from './smart-meter/SelectedSupplierDisplay';
import OctopusConnectionForm from './smart-meter/OctopusConnectionForm';
import ConnectedMeterDisplay from './smart-meter/ConnectedMeterDisplay';
import BenefitsSection from './smart-meter/BenefitsSection';

const SmartMeterIntegration = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    apiKey: ''
  });
  const [meterData, setMeterData] = useState({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });

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

  const handleSupplierSelect = (supplierId: string) => {
    setIsTransitioning(true);
    // Small delay to allow transition animation to start
    setTimeout(() => {
      setSelectedSupplier(supplierId);
      setIsTransitioning(false);
    }, 400);
  };

  const energySuppliers = [
    { id: 'octopus', name: 'Octopus Energy', available: true, color: 'bg-pink-500' },
    { id: 'british-gas', name: 'British Gas', available: false, color: 'bg-blue-500' },
    { id: 'eon', name: 'E.ON', available: false, color: 'bg-green-500' },
    { id: 'edf', name: 'EDF Energy', available: false, color: 'bg-orange-500' },
    { id: 'scottishpower', name: 'ScottishPower', available: false, color: 'bg-purple-500' },
    { id: 'sse', name: 'SSE', available: false, color: 'bg-red-500' },
    { id: 'bulb', name: 'Bulb', available: false, color: 'bg-yellow-500' },
    { id: 'shell', name: 'Shell Energy', available: false, color: 'bg-gray-500' },
  ];

  // If connected, show the connected state
  if (isConnected) {
    return (
      <ConnectedMeterDisplay
        account={account}
        apiKey={connectionForm.apiKey}
        meterData={meterData}
        onDisconnect={handleDisconnect}
        onChangeSupplier={() => setSelectedSupplier(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Meter Integration</h2>
        <p className="text-gray-600">
          {selectedSupplier === 'octopus' && !isConnected 
            ? "Connect your Octopus Energy smart meter to get real-time energy usage data"
            : "Select your energy supplier to connect your smart meter and get real-time energy data"
          }
        </p>
      </div>

      {/* Back Button */}
      {selectedSupplier && (
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedSupplier(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Suppliers
          </Button>
        </div>
      )}

      {/* Supplier Selection */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedSupplier === 'octopus' ? 'Selected Energy Supplier' : 'Choose Your Energy Supplier'}
          </CardTitle>
          <CardDescription>
            {selectedSupplier === 'octopus' 
              ? 'You have selected Octopus Energy for smart meter integration'
              : 'Select your current energy supplier to set up smart meter integration'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedSupplier === 'octopus' ? (
            <SelectedSupplierDisplay
              supplierName="Octopus Energy"
              supplierColor="bg-pink-500"
              onChangeSupplier={() => setSelectedSupplier(null)}
            />
          ) : (
            <SupplierSelectionGrid
              suppliers={energySuppliers}
              isTransitioning={isTransitioning}
              onSupplierSelect={handleSupplierSelect}
            />
          )}
        </CardContent>
      </Card>

      {/* API Key Form - only show when Octopus is selected and not connected */}
      {selectedSupplier === 'octopus' && !isConnected && (
        <OctopusConnectionForm
          apiKey={connectionForm.apiKey}
          loading={loading}
          onApiKeyChange={(value) => setConnectionForm(prev => ({ ...prev, apiKey: value }))}
          onConnect={handleConnect}
        />
      )}

      {/* Info Section - only show when no supplier is selected */}
      {!selectedSupplier && <BenefitsSection />}
    </div>
  );
};

export default SmartMeterIntegration;