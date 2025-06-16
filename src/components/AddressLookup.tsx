
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search, MapPin } from 'lucide-react';

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

interface AddressLookupProps {
  formData: { name: string; address: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; address: string }>>;
}

const AddressLookup: React.FC<AddressLookupProps> = ({ formData, setFormData }) => {
  const [postcode, setPostcode] = useState('');
  const [addresses, setAddresses] = useState<AddressResult[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const searchAddresses = async () => {
    if (!postcode.trim()) return;
    
    setLoadingAddresses(true);
    try {
      // First, validate the postcode format and get basic info
      const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode.trim())}`);
      
      if (postcodeResponse.ok) {
        const postcodeData = await postcodeResponse.json();
        
        // For demonstration, we'll create mock addresses based on the postcode
        // In a real implementation, you'd use a service like GetAddress.io, Ideal Postcodes, or similar
        const mockAddresses: AddressResult[] = [
          {
            formatted_address: `1 ${postcodeData.result.admin_ward}, ${postcodeData.result.admin_district}, ${postcodeData.result.postcode}`,
            building_number: '1',
            thoroughfare: postcodeData.result.admin_ward,
            postcode: postcodeData.result.postcode,
            post_town: postcodeData.result.admin_district
          },
          {
            formatted_address: `2 ${postcodeData.result.admin_ward}, ${postcodeData.result.admin_district}, ${postcodeData.result.postcode}`,
            building_number: '2',
            thoroughfare: postcodeData.result.admin_ward,
            postcode: postcodeData.result.postcode,
            post_town: postcodeData.result.admin_district
          },
          {
            formatted_address: `3 ${postcodeData.result.admin_ward}, ${postcodeData.result.admin_district}, ${postcodeData.result.postcode}`,
            building_number: '3',
            thoroughfare: postcodeData.result.admin_ward,
            postcode: postcodeData.result.postcode,
            post_town: postcodeData.result.admin_district
          },
          {
            formatted_address: `4 ${postcodeData.result.admin_ward}, ${postcodeData.result.admin_district}, ${postcodeData.result.postcode}`,
            building_number: '4',
            thoroughfare: postcodeData.result.admin_ward,
            postcode: postcodeData.result.postcode,
            post_town: postcodeData.result.admin_district
          },
          {
            formatted_address: `5 ${postcodeData.result.admin_ward}, ${postcodeData.result.admin_district}, ${postcodeData.result.postcode}`,
            building_number: '5',
            thoroughfare: postcodeData.result.admin_ward,
            postcode: postcodeData.result.postcode,
            post_town: postcodeData.result.admin_district
          }
        ];
        
        setAddresses(mockAddresses);
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

  const selectAddress = (address: AddressResult) => {
    setFormData(prev => ({ ...prev, address: address.formatted_address }));
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
              onChange={(e) => setPostcode(e.target.value.toUpperCase())}
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
              <p className="text-sm text-muted-foreground">Select your address:</p>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {addresses.map((address, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-3 hover:bg-accent"
                    onClick={() => selectAddress(address)}
                  >
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">
                        {address.building_number && `${address.building_number} `}
                        {address.building_name && `${address.building_name}, `}
                        {address.thoroughfare}
                      </div>
                      <div className="text-sm text-muted-foreground">
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
