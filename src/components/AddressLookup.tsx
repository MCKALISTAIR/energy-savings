
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
}

const AddressLookup: React.FC<AddressLookupProps> = ({ formData, setFormData, className, isMobile = false }) => {
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

  const resetAddressForm = () => {
    setSearchPostcode('');
    setAddresses([]);
    setShowManualEntry(false);
    setAddressFields({ houseNumber: '', street: '', postcode: '', city: '' });
    setFormData(prev => ({ ...prev, address: '' }));
    setError(null);
  };

  return (
    <div>
      <Label htmlFor="house-address" className={isMobile ? 'text-sm' : ''}>Address</Label>
      
      {!showManualEntry && !formData.address && (
        <div className="space-y-3">
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Input
              id="postcode"
              value={searchPostcode}
              onChange={(e) => setSearchPostcode(e.target.value.toUpperCase())}
              placeholder="Enter postcode (e.g. SW1A 1AA)"
              className={`${isMobile ? 'h-12 text-base' : 'flex-1'}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  searchAddresses();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={searchAddresses}
              disabled={loadingAddresses || !searchPostcode.trim()}
              variant="default"
              className={`${isMobile ? 'h-12 text-base' : 'px-4'}`}
            >
              {loadingAddresses ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className={`text-red-600 bg-red-50 border border-red-200 rounded p-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {error}
            </div>
          )}
          
          {addresses.length > 0 && (
            <div className="space-y-2">
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-sm'}`}>Select your address:</p>
              <div className={`${isMobile ? 'max-h-40' : 'max-h-48'} overflow-y-auto space-y-1`}>
                {addresses.map((address, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full text-left justify-start h-auto hover:bg-accent ${isMobile ? 'p-3 text-sm' : 'p-3'}`}
                    onClick={() => selectAddress(address)}
                  >
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-left">
                      <div className={`font-medium ${isMobile ? 'text-sm' : ''}`}>
                        {address.building_number && `${address.building_number} `}
                        {address.building_name && `${address.building_name}, `}
                        {address.thoroughfare}
                      </div>
                      <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {address.post_town}, {address.postcode}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="house-number" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                House Number/Name
              </Label>
              <Input
                id="house-number"
                value={addressFields.houseNumber}
                onChange={(e) => handleFieldChange('houseNumber', e.target.value)}
                placeholder="e.g. 123 or Flat 2A"
                className={`${className} ${isMobile ? 'h-10 text-base' : ''}`}
              />
            </div>
            <div>
              <Label htmlFor="postcode-manual" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
                Postcode
              </Label>
              <Input
                id="postcode-manual"
                value={addressFields.postcode}
                onChange={(e) => handleFieldChange('postcode', e.target.value.toUpperCase())}
                placeholder="e.g. SW1A 1AA"
                className={`${className} ${isMobile ? 'h-10 text-base' : ''}`}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="street" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
              Street
            </Label>
            <Input
              id="street"
              value={addressFields.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              placeholder="e.g. Baker Street"
              className={`${className} ${isMobile ? 'h-10 text-base' : ''}`}
            />
          </div>
          
          <div>
            <Label htmlFor="city" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
              City/Town
            </Label>
            <Input
              id="city"
              value={addressFields.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder="e.g. London"
              className={`${className} ${isMobile ? 'h-10 text-base' : ''}`}
            />
          </div>
          
          {!showManualEntry && (
            <Button
              type="button"
              variant="ghost"
              onClick={resetAddressForm}
              className={`w-full ${isMobile ? 'text-sm h-10' : 'text-sm'}`}
            >
              Use postcode lookup instead
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressLookup;
