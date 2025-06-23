
import { useState } from 'react';

export const useNumericValidation = () => {
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const handleNumericInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    allowDecimals: boolean = true,
    updateSpecification: (key: string, value: any) => void
  ) => {
    const value = e.target.value;
    const pattern = allowDecimals ? /^[0-9.]*$/ : /^[0-9]*$/;
    
    if (value === '' || pattern.test(value)) {
      // Clear any validation error for this field
      if (validationErrors[fieldKey]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldKey];
          return newErrors;
        });
      }
      
      // Handle decimal validation for decimal fields
      if (allowDecimals && value.includes('.')) {
        const parts = value.split('.');
        if (parts.length > 2) {
          setValidationErrors(prev => ({
            ...prev,
            [fieldKey]: 'Only one decimal point allowed'
          }));
          return;
        }
        if (parts[1] && parts[1].length > 2) {
          setValidationErrors(prev => ({
            ...prev,
            [fieldKey]: 'Maximum 2 decimal places allowed'
          }));
          return;
        }
      }
      
      const numericValue = value === '' ? '' : (allowDecimals ? parseFloat(value) || '' : parseInt(value) || '');
      updateSpecification(fieldKey, numericValue);
    } else {
      // Show validation error
      setValidationErrors(prev => ({
        ...prev,
        [fieldKey]: 'Only numbers and decimal points are allowed'
      }));
    }
  };

  return {
    validationErrors,
    handleNumericInput
  };
};
