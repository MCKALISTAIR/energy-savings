
import React from 'react';
import ManualAddressForm from './ManualAddressForm';

interface AddressFields {
  houseNumber: string;
  street: string;
  postcode: string;
  city: string;
}

interface AddressManualSectionProps {
  addressFields: AddressFields;
  onFieldChange: (field: keyof AddressFields, value: string) => void;
  onReset: () => void;
  onClear?: () => void;
  showResetButton?: boolean;
  showClearButton?: boolean;
  className?: string;
  isMobile?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const AddressManualSection: React.FC<AddressManualSectionProps> = ({
  addressFields,
  onFieldChange,
  onReset,
  onClear,
  showResetButton = false,
  showClearButton = false,
  className = '',
  isMobile = false,
  hasError = false,
  errorMessage
}) => {
  return (
    <div className="mt-2">
      <ManualAddressForm
        addressFields={addressFields}
        onFieldChange={onFieldChange}
        onReset={onReset}
        onClear={onClear}
        showResetButton={showResetButton}
        showClearButton={showClearButton}
        className={hasError ? 'border-red-500' : className}
        isMobile={isMobile}
      />
      {hasError && errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default AddressManualSection;
