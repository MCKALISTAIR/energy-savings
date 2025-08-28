import { useState } from 'react';
import { apiFetch } from '@/utils/apiFetch';

interface AddressResult {
  formatted_address: string;
  thoroughfare?: string;
  building_number?: string;
  building_name?: string;
  sub_building_name?: string;
  postcode: string;
  post_town: string;
  county?: string;
}

interface AddressFields {
  houseNumber: string;
  street: string;
  postcode: string;
  city: string;
}

export const useAddressLookup = () => {
  const [searchPostcode, setSearchPostcode] = useState('');
  const [addresses, setAddresses] = useState<AddressResult[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddresses = async () => {
    if (!searchPostcode.trim()) return;
    
    setLoadingAddresses(true);
    setError(null);
    
    try {
      console.log('Searching addresses for postcode:', searchPostcode);
      
      const data = await apiFetch('address-lookup', { postcode: searchPostcode.trim() });

      if (data.error) {
        setError(data.error);
        setAddresses([]);
        return;
      }

      if (data.addresses && data.addresses.length > 0) {
        setAddresses(data.addresses);
      } else {
        setError('No addresses found for this postcode. Please check the postcode or try manual entry.');
        setAddresses([]);
      }
      
    } catch (error) {
      console.error('Error looking up addresses:', error);
      setError('Address lookup service is temporarily unavailable. Please try manual entry.');
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const clearResults = () => {
    setAddresses([]);
    setSearchPostcode('');
    setError(null);
  };

  return {
    searchPostcode,
    setSearchPostcode,
    addresses,
    loadingAddresses,
    error,
    searchAddresses,
    clearResults,
    setError
  };
};