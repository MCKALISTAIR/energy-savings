
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddressFields {
  houseNumber: string;
  street: string;
  postcode: string;
  city: string;
}

interface ManualAddressFormProps {
  addressFields: AddressFields;
  onFieldChange: (field: keyof AddressFields, value: string) => void;
  onReset?: () => void;
  onClear?: () => void;
  showResetButton?: boolean;
  showClearButton?: boolean;
  className?: string;
  isMobile?: boolean;
}

const ManualAddressForm: React.FC<ManualAddressFormProps> = ({
  addressFields,
  onFieldChange,
  onReset,
  onClear,
  showResetButton = false,
  showClearButton = false,
  className = '',
  isMobile = false
}) => {
  const hasError = className.includes('border-red-500');
  const errorClass = hasError ? 'border-red-500' : '';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="house-number" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
            House Number/Name
          </Label>
          <Input
            id="house-number"
            value={addressFields.houseNumber}
            onChange={(e) => onFieldChange('houseNumber', e.target.value)}
            placeholder="e.g. 123 or Flat 2A"
            className={`${errorClass} ${isMobile ? 'h-10 text-base' : ''}`}
          />
        </div>
        <div>
          <Label htmlFor="postcode-manual" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
            Postcode
          </Label>
          <Input
            id="postcode-manual"
            value={addressFields.postcode}
            onChange={(e) => onFieldChange('postcode', e.target.value.toUpperCase())}
            placeholder="e.g. SW1A 1AA"
            className={`${errorClass} ${isMobile ? 'h-10 text-base' : ''}`}
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
          onChange={(e) => onFieldChange('street', e.target.value)}
          placeholder="e.g. Baker Street"
          className={`${errorClass} ${isMobile ? 'h-10 text-base' : ''}`}
        />
      </div>
      
      <div>
        <Label htmlFor="city" className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
          City/Town
        </Label>
        <Input
          id="city"
          value={addressFields.city}
          onChange={(e) => onFieldChange('city', e.target.value)}
          placeholder="e.g. London"
          className={`${errorClass} ${isMobile ? 'h-10 text-base' : ''}`}
        />
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
        {showClearButton && onClear && (
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className={`${isMobile ? 'w-full text-sm h-10' : 'flex-1 text-sm'}`}
          >
            <X className="w-4 h-4 mr-2" />
            Clear address
          </Button>
        )}
        
        {showResetButton && onReset && (
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className={`${isMobile ? 'w-full text-sm h-10' : 'flex-1 text-sm'}`}
          >
            Use postcode lookup instead
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManualAddressForm;
