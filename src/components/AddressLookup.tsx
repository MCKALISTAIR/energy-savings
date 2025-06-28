
import React from 'react';
import AddressLookupForm from './address/AddressLookupForm';

interface AddressLookupProps {
  formData: { name: string; address: string };
  setFormData: React.Dispatch<React.SetStateAction<{ name: string; address: string }>>;
  className?: string;
  isMobile?: boolean;
  showErrors?: boolean;
  errors?: { address?: string };
}

const AddressLookup: React.FC<AddressLookupProps> = (props) => {
  return <AddressLookupForm {...props} />;
};

export default AddressLookup;
