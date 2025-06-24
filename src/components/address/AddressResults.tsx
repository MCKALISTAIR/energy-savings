
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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

interface AddressResultsProps {
  addresses: AddressResult[];
  onSelectAddress: (address: AddressResult) => void;
  isMobile?: boolean;
}

const AddressResults: React.FC<AddressResultsProps> = ({
  addresses,
  onSelectAddress,
  isMobile = false
}) => {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-sm'}`}>Select your address:</p>
      <div className={`${isMobile ? 'max-h-40' : 'max-h-48'} overflow-y-auto space-y-1`}>
        {addresses.map((address, index) => (
          <Button
            key={index}
            variant="outline"
            className={`w-full text-left justify-start h-auto hover:bg-accent ${isMobile ? 'p-3 text-sm' : 'p-3'}`}
            onClick={() => onSelectAddress(address)}
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
  );
};

export default AddressResults;
