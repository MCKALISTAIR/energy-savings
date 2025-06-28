
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import AddressSearchSection from './AddressSearchSection';
import AddressManualSection from './AddressManualSection';
import { useAddressLookup } from '@/hooks/useAddressLookup';
import { parseAddressIntoFields, parseSelectedAddressIntoFields, updateAddressFromFields } from '@/utils/addressParser';

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
    // Parse the selected address into individual fields
    const parsedFields = parseSelectedAddressIntoFields(address);
    setAddressFields(parsedFields);
    setFormData(prev => ({ ...prev, address: address.formatted_address }));
    setShowManualEntry(true);
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
    const parsedFields = parseAddressIntoFields(detectedAddress);
    setAddressFields(parsedFields);
    setFormData(prev => ({ ...prev, address: detectedAddress }));
    setShowManualEntry(true);
    setError(null);
  };

  const clearAddressForm = () => {
    setSearchPostcode('');
    clearResults();
    setShowManualEntry(false);
    setAddressFields({ houseNumber: '', street: '', postcode: '', city: '' });
    setFormData(prev => ({ ...prev, address: '' }));
    setError(null);
  };

  const resetAddressForm = () => {
    clearAddressForm();
  };

  const hasError = showErrors && !!errors.address;

  return (
    <div>
      <Label htmlFor="house-address" className={isMobile ? 'text-sm' : ''}>
        Address <span className="text-red-500">*</span>
      </Label>
      
      {!showManualEntry && !formData.address && (
        <AddressSearchSection
          searchPostcode={searchPostcode}
          setSearchPostcode={setSearchPostcode}
          addresses={addresses}
          loadingAddresses={loadingAddresses}
          error={error}
          onSearch={searchAddresses}
          onSelectAddress={selectAddress}
          onLocationDetected={handleLocationDetected}
          onManualEntry={() => setShowManualEntry(true)}
          isMobile={isMobile}
          hasError={hasError}
          errorMessage={errors.address}
        />
      )}
      
      {(showManualEntry || formData.address) && !addresses.length && (
        <AddressManualSection
          addressFields={addressFields}
          onFieldChange={handleFieldChange}
          onReset={resetAddressForm}
          onClear={clearAddressForm}
          showResetButton={!showManualEntry}
          showClearButton={true}
          className={className}
          isMobile={isMobile}
          hasError={hasError}
          errorMessage={errors.address}
        />
      )}
    </div>
  );
};

export default AddressLookupForm;
