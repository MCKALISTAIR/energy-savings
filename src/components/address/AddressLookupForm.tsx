
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import PostcodeSearch from './PostcodeSearch';
import AddressResults from './AddressResults';
import ManualAddressForm from './ManualAddressForm';
import AddressError from './AddressError';
import LocationDetector from './LocationDetector';
import { useAddressLookup } from '@/hooks/useAddressLookup';
import { parseAddressIntoFields, updateAddressFromFields } from '@/utils/addressParser';

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

interface AddressLookupFormProps {
  formData: { name: string; address: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; address: string }>>;
  className?: string;
  isMobile?: boolean;
  showErrors?: boolean;
  errors?: { address?: string };
}

const AddressLookupForm: React.FC<AddressLookupFormProps> = ({ 
  formData, 
  setFormData, 
  className, 
  isMobile = false,
  showErrors = false,
  errors = {}
}) => {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [addressFields, setAddressFields] = useState<AddressFields>({
    houseNumber: '',
    street: '',
    postcode: '',
    city: ''
  });

  const {
    searchPostcode,
    setSearchPostcode,
    addresses,
    loadingAddresses,
    error,
    searchAddresses,
    clearResults,
    setError
  } = useAddressLookup();

  const selectAddress = (address: AddressResult) => {
    setFormData(prev => ({ ...prev, address: address.formatted_address }));
    clearResults();
    setError(null);
  };

  const handleFieldChange = (field: keyof AddressFields, value: string) => {
    const newFields = { ...addressFields, [field]: value };
    setAddressFields(newFields);
    const fullAddress = updateAddressFromFields(newFields);
    setFormData(prev => ({ ...prev, address: fullAddress }));
  };

  const handleLocationDetected = (detectedAddress: string) => {
    // Parse the detected address into fields
    const parsedFields = parseAddressIntoFields(detectedAddress);
    setAddressFields(parsedFields);
    
    // Set the full address
    setFormData(prev => ({ ...prev, address: detectedAddress }));
    
    // Show manual entry form so user can edit the parsed fields
    setShowManualEntry(true);
    setError(null);
  };

  const resetAddressForm = () => {
    setSearchPostcode('');
    clearResults();
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

export default AddressLookupForm;
