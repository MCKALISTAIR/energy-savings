import React from 'react';
import { useSmartMeterIntegration } from '@/hooks/useSmartMeterIntegration';
import SmartMeterHeader from './smart-meter/SmartMeterHeader';
import SmartMeterBackButton from './smart-meter/SmartMeterBackButton';
import SupplierSelectionCard from './smart-meter/SupplierSelectionCard';
import OctopusConnectionForm from './smart-meter/OctopusConnectionForm';
import ConnectedMeterDisplay from './smart-meter/ConnectedMeterDisplay';
import BenefitsSection from './smart-meter/BenefitsSection';

const SmartMeterIntegration = () => {
  const {
    selectedSupplier,
    isTransitioning,
    isReverseTransitioning,
    isConnected,
    connectionForm,
    meterData,
    loading,
    account,
    setConnectionForm,
    handleConnect,
    handleDisconnect,
    handleSupplierSelect,
    handleBackToSuppliers
  } = useSmartMeterIntegration();

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
        onChangeSupplier={handleBackToSuppliers}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SmartMeterHeader 
        selectedSupplier={selectedSupplier}
        isConnected={isConnected}
      />

      {/* Back Button */}
      {selectedSupplier && !isReverseTransitioning && (
        <SmartMeterBackButton onBack={handleBackToSuppliers} />
      )}

      {/* Supplier Selection */}
      <SupplierSelectionCard
        selectedSupplier={selectedSupplier}
        isTransitioning={isTransitioning}
        isReverseTransitioning={isReverseTransitioning}
        energySuppliers={energySuppliers}
        onSupplierSelect={handleSupplierSelect}
        onChangeSupplier={handleBackToSuppliers}
      />

      {/* API Key Form - only show when Octopus is selected and not connected and not transitioning */}
      {selectedSupplier === 'octopus' && !isConnected && !isReverseTransitioning && (
        <OctopusConnectionForm
          apiKey={connectionForm.apiKey}
          loading={loading}
          onApiKeyChange={(value) => setConnectionForm(prev => ({ ...prev, apiKey: value }))}
          onConnect={handleConnect}
        />
      )}

      {/* Info Section - only show when no supplier is selected and not transitioning */}
      {!selectedSupplier && !isReverseTransitioning && <BenefitsSection />}
    </div>
  );
};

export default SmartMeterIntegration;