
import React from 'react';

interface AddressErrorProps {
  error: string;
  isMobile?: boolean;
}

const AddressError: React.FC<AddressErrorProps> = ({ error, isMobile = false }) => {
  return (
    <div className={`text-red-600 bg-red-50 border border-red-200 rounded p-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
      {error}
    </div>
  );
};

export default AddressError;
