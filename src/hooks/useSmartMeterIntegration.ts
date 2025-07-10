import { useEffect } from 'react';
import { useSmartMeterUI } from './useSmartMeterUI';
import { useSmartMeterData } from './useSmartMeterData';
import { useSmartMeterConnection } from './useSmartMeterConnection';

export const useSmartMeterIntegration = () => {
  const {
    selectedSupplier,
    isTransitioning,
    isReverseTransitioning,
    showGuestPrompt,
    handleSupplierSelect,
    handleBackToSuppliers,
    handleDismissGuestPrompt,
    initializeSupplier
  } = useSmartMeterUI();

  const {
    isConnected,
    meterData,
    gasData,
    loading,
    account,
    connectMeter,
    disconnectMeter,
    refreshMeterData
  } = useSmartMeterData();

  const {
    connectionForm,
    setConnectionForm,
    updateApiKey,
    clearConnection
  } = useSmartMeterConnection();

  // Initialize supplier preference on mount
  useEffect(() => {
    initializeSupplier();
  }, []);

  // Auto-refresh data every 30 minutes when connected
  useEffect(() => {
    if (!isConnected || !connectionForm.apiKey) return;

    const interval = setInterval(() => {
      refreshMeterData(connectionForm.apiKey);
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isConnected, connectionForm.apiKey]);

  const handleConnect = async () => {
    // Skip validation since it's already been done in the form
    const success = await connectMeter(connectionForm.apiKey, true);
    return success;
  };

  const handleDisconnect = () => {
    disconnectMeter();
    clearConnection();
  };

  const handleRefreshData = () => {
    refreshMeterData(connectionForm.apiKey);
  };

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
    refreshMeterData: handleRefreshData
  };
};