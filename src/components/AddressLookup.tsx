
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, MapPin } from 'lucide-react';

interface AddressLookupProps {
  formData: { name: string; address: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; address: string }>>;
}

const AddressLookup: React.FC<AddressLookupProps> = ({ formData, setFormData }) => {
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<string[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const searchAddresses = async () => {
    if (!postcode.trim()) return;
    
    setLoadingAddresses(true);
    try {
      const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          const formattedAddress = [
            data.result.admin_district,
            data.result.admin_county,
            data.result.country,
            data.result.postcode
          ].filter(Boolean).join(', ');
          
          setAddresses([formattedAddress]);
        } else {
          setAddresses([]);
        }
      } else {
        console.error('Postcode lookup failed');
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error looking up postcode:', error);
      setAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const selectAddress = (address: string) => {
    setFormData(prev => ({ ...prev, address }));
    setAddresses([]);
    setPostcode('');
  };

  const resetAddressForm = () => {
    setPostcode('');
    setAddresses([]);
    setShowManualEntry(false);
    setFormData(prev => ({ ...prev, address: '' }));
  };

  return (
    <div>
      <Label htmlFor="house-address">Address</Label>
      
      {!showManualEntry && !formData.address && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              id="postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Enter postcode (e.g. SW1A 1AA)"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={searchAddresses}
              disabled={loadingAddresses || !postcode.trim()}
              variant="default"
              className="px-4"
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
          
          {addresses.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Select an address:</p>
              {addresses.map((address, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => selectAddress(address)}
                >
                  <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{address}</span>
                </Button>
              ))}
            </div>
          )}
          
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowManualEntry(true)}
            className="w-full text-sm"
          >
            Enter address manually
          </Button>
        </div>
      )}
      
      {(showManualEntry || formData.address) && (
        <div className="space-y-2">
          <Textarea
            id="house-address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Full address including postcode"
          />
          {!showManualEntry && (
            <Button
              type="button"
              variant="ghost"
              onClick={resetAddressForm}
              className="w-full text-sm"
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
