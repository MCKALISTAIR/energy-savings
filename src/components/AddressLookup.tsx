import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import PostcodeSearch from './address/PostcodeSearch';
import AddressResults from './address/AddressResults';
import ManualAddressForm from './address/ManualAddressForm';
import AddressError from './address/AddressError';
import LocationDetector from './address/LocationDetector';

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

interface AddressLookupProps {
  formData: { name: string; address: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; address: string }>>;
  className?: string;
  isMobile?: boolean;
  showErrors?: boolean;
  errors?: { address?: string };
}

const AddressLookup: React.FC<AddressLookupProps> = ({ 
  formData, 
  setFormData, 
  className, 
  isMobile = false,
  showErrors = false,
  errors = {}
}) => {
  const [searchPostcode, setSearchPostcode] = useState('');
  const [addresses, setAddresses] = useState<AddressResult[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressFields, setAddressFields] = useState<AddressFields>({
    houseNumber: '',
    street: '',
    postcode: '',
    city: ''
  });

  const searchAddresses = async () => {
    if (!searchPostcode.trim()) return;
    
    setLoadingAddresses(true);
    setError(null);
    
    try {
      console.log('Searching addresses for postcode:', searchPostcode);
      
      const { data, error: functionError } = await supabase.functions.invoke('address-lookup', {
        body: { postcode: searchPostcode.trim() }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        setError('Address lookup service is temporarily unavailable. Please try manual entry.');
        setAddresses([]);
        return;
      }

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

  const selectAddress = (address: AddressResult) => {
    setFormData(prev => ({ ...prev, address: address.formatted_address }));
    setAddresses([]);
    setSearchPostcode('');
    setError(null);
  };

  const updateAddressFromFields = (fields: AddressFields) => {
    const addressParts = [
      fields.houseNumber,
      fields.street,
      fields.city,
      fields.postcode
    ].filter(part => part.trim());
    
    const fullAddress = addressParts.join(', ');
    setFormData(prev => ({ ...prev, address: fullAddress }));
  };

  const handleFieldChange = (field: keyof AddressFields, value: string) => {
    const newFields = { ...addressFields, [field]: value };
    setAddressFields(newFields);
    updateAddressFromFields(newFields);
  };

  const handleLocationDetected = (detectedAddress: string) => {
    setFormData(prev => ({ ...prev, address: detectedAddress }));
    setError(null);
  };

  const resetAddressForm = () => {
    setSearchPostcode('');
    setAddresses([]);
    setShowManualEntry(false);
    setAddressFields({ houseNumber: '', street: '', postcode: '', city: '' });
    setFormData(prev => ({ ...prev, address: '' }));
    setError(null);
  };

  const hasError = showErrors && !!errors.address;

  return (
    <div>
      <Label htmlFor="house-address" className={isMobile ? 'text-sm' : ''}>
        Address <span className="text-red-500">*</span>
      </Label>
      
      {!showManualEntry && !formData.address && (
        <div className="space-y-3 mt-2">
          <LocationDetector
            onLocationDetected={handleLocationDetected}
            isMobile={isMobile}
          />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or search by postcode</span>
            </div>
          </div>
          
          <PostcodeSearch
            searchPostcode={searchPostcode}
            setSearchPostcode={setSearchPostcode}
            onSearch={searchAddresses}
            loading={loadingAddresses}
            isMobile={isMobile}
            hasError={hasError}
          />

          {hasError && (
            <p className="text-sm text-red-500">{errors.address}</p>
          )}

          {error && <AddressError error={error} isMobile={isMobile} />}
          
          <AddressResults
            addresses={addresses}
            onSelectAddress={selectAddress}
            isMobile={isMobile}
          />
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowManualEntry(true)}
            className={`w-full ${isMobile ? 'text-sm h-10' : 'text-sm'}`}
          >
            Enter address manually
          </Button>
        </div>
      )}
      
      {(showManualEntry || formData.address) && !addresses.length && (
        <div className="mt-2">
          <ManualAddressForm
            addressFields={addressFields}
            onFieldChange={handleFieldChange}
            onReset={resetAddressForm}
            showResetButton={!showManualEntry}
            className={hasError ? 'border-red-500' : className}
            isMobile={isMobile}
          />
          {hasError && (
            <p className="text-sm text-red-500 mt-1">{errors.address}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressLookup;
