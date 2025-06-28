
import React from 'react';
import PostcodeSearch from './PostcodeSearch';
import AddressResults from './AddressResults';
import AddressError from './AddressError';
import LocationDetector from './LocationDetector';

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

interface AddressSearchSectionProps {
  searchPostcode: string;
  setSearchPostcode: (postcode: string) => void;
  addresses: AddressResult[];
  loadingAddresses: boolean;
  error: string | null;
  onSearch: () => void;
  onSelectAddress: (address: AddressResult) => void;
  onLocationDetected: (address: string) => void;
  onManualEntry: () => void;
  isMobile?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

const AddressSearchSection: React.FC<AddressSearchSectionProps> = ({
  searchPostcode,
  setSearchPostcode,
  addresses,
  loadingAddresses,
  error,
  onSearch,
  onSelectAddress,
  onLocationDetected,
  onManualEntry,
  isMobile = false,
  hasError = false,
  errorMessage
}) => {
  return (
    <div className="space-y-3 mt-2">
      <LocationDetector
        onLocationDetected={onLocationDetected}
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
        onSearch={onSearch}
        loading={loadingAddresses}
        isMobile={isMobile}
        hasError={hasError}
      />

      {hasError && errorMessage && (
        <p className="text-sm text-red-500">{errorMessage}</p>
      )}

      {error && <AddressError error={error} isMobile={isMobile} />}
      
      <AddressResults
        addresses={addresses}
        onSelectAddress={onSelectAddress}
        isMobile={isMobile}
      />
      
      <button
        type="button"
        onClick={onManualEntry}
        className={`w-full bg-transparent hover:bg-accent hover:text-accent-foreground border-0 p-2 rounded text-sm ${isMobile ? 'text-sm h-10' : 'text-sm'}`}
      >
        Enter address manually
      </button>
    </div>
  );
};

export default AddressSearchSection;
