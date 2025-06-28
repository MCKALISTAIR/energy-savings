
interface AddressFields {
  houseNumber: string;
  street: string;
  postcode: string;
  city: string;
}

export const parseAddressIntoFields = (detectedAddress: string): AddressFields => {
  // Split the address by comma to get parts
  const parts = detectedAddress.split(', ').map(part => part.trim());
  
  let houseNumber = '';
  let street = '';
  let city = '';
  let postcode = '';

  // Try to identify postcode (typically last part or contains numbers and letters)
  const postcodePattern = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
  const postcodeIndex = parts.findIndex(part => postcodePattern.test(part));
  
  if (postcodeIndex !== -1) {
    postcode = parts[postcodeIndex];
    parts.splice(postcodeIndex, 1);
  }

  // City is typically the second to last part (before postcode)
  if (parts.length > 0) {
    city = parts[parts.length - 1];
    parts.pop();
  }

  // Street is typically the first part
  if (parts.length > 0) {
    const firstPart = parts[0];
    
    // Try to extract house number from the beginning of street
    const houseNumberMatch = firstPart.match(/^(\d+[A-Z]?|[A-Za-z\s]+\s\d+[A-Z]?)\s+(.+)/i);
    if (houseNumberMatch) {
      houseNumber = houseNumberMatch[1];
      street = houseNumberMatch[2];
    } else {
      // If no clear house number pattern, check if first part is just a number
      const numberOnlyMatch = firstPart.match(/^(\d+[A-Z]?)$/i);
      if (numberOnlyMatch && parts.length > 1) {
        houseNumber = numberOnlyMatch[1];
        street = parts[1];
      } else {
        street = firstPart;
      }
    }
  }

  return { houseNumber, street, postcode, city };
};

export const updateAddressFromFields = (fields: AddressFields): string => {
  const addressParts = [
    fields.houseNumber,
    fields.street,
    fields.city,
    fields.postcode
  ].filter(part => part.trim());
  
  return addressParts.join(', ');
};

export const parseSelectedAddressIntoFields = (address: any): AddressFields => {
  const houseNumber = [
    address.building_number,
    address.building_name,
    address.sub_building_name
  ].filter(Boolean).join(' ') || '';
  
  const street = address.thoroughfare || '';
  const city = address.post_town || '';
  const postcode = address.postcode || '';
  
  return { houseNumber, street, postcode, city };
};
