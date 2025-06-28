
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

interface LocationDetectorProps {
  onLocationDetected: (address: string) => void;
  isMobile?: boolean;
  disabled?: boolean;
}

const LocationDetector: React.FC<LocationDetectorProps> = ({
  onLocationDetected,
  isMobile = false,
  disabled = false
}) => {
  const { getCurrentLocation, loading, error } = useGeolocation();

  const handleDetectLocation = async () => {
    const result = await getCurrentLocation();
    if (result && result.address) {
      onLocationDetected(result.address);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleDetectLocation}
        disabled={loading || disabled}
        className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
      >
        <MapPin className="w-4 h-4 mr-2" />
        {loading ? 'Detecting location...' : 'Use my current location'}
      </Button>
      
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default LocationDetector;
