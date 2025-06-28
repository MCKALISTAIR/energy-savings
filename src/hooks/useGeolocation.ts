
import { useState } from 'react';

interface GeolocationResult {
  latitude: number;
  longitude: number;
  address?: string;
}

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async (): Promise<GeolocationResult | null> => {
    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        setLoading(false);
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use reverse geocoding to get address from coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            
            if (response.ok) {
              const data = await response.json();
              const address = [
                data.locality || data.city,
                data.principality || data.countryName
              ].filter(Boolean).join(', ');
              
              resolve({
                latitude,
                longitude,
                address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              });
            } else {
              resolve({
                latitude,
                longitude,
                address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
              });
            }
          } catch (err) {
            console.error('Error getting address:', err);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError(
            err.code === 1 
              ? 'Location access denied. Please enable location permissions.'
              : err.code === 2
              ? 'Location unavailable. Please try again.'
              : 'Location request timed out. Please try again.'
          );
          setLoading(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  return {
    getCurrentLocation,
    loading,
    error
  };
};
