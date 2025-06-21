
import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { SystemType } from '@/types';

interface UseSystemFormProps {
  initialData?: SystemType;
  onSuccess: () => void;
}

interface ValidationErrors {
  name?: string;
  installDate?: string;
  system_cost?: string;
  capacity?: string;
  batteryCapacity?: string;
  annualMileage?: string;
}

export const useSystemForm = ({ initialData, onSuccess }: UseSystemFormProps) => {
  const { addSystem, updateSystem, currentHouse } = useSystem();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'solar' as const,
    installDate: initialData?.installDate ? initialData.installDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isActive: initialData?.isActive ?? true,
    system_cost: initialData?.system_cost || 0,
    specifications: initialData?.specifications || {}
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate install date
    if (!formData.installDate) {
      newErrors.installDate = 'Date is required';
    }

    // Validate cost
    if (!formData.system_cost || formData.system_cost <= 0) {
      newErrors.system_cost = 'Cost is required and must be greater than 0';
    }

    // Validate capacity based on system type
    const capacity = getSpecValue('capacity');
    if (formData.type === 'solar' || formData.type === 'battery') {
      if (!capacity || capacity <= 0) {
        newErrors.capacity = 'Capacity is required and must be greater than 0';
      }
    }

    // Validate EV specific fields
    if (formData.type === 'ev') {
      const batteryCapacity = getSpecValue('batteryCapacity');
      const annualMileage = getSpecValue('annualMileage');
      
      if (!batteryCapacity || batteryCapacity <= 0) {
        newErrors.batteryCapacity = 'Battery capacity is required and must be greater than 0';
      }
      
      if (!annualMileage || annualMileage <= 0) {
        newErrors.annualMileage = 'Annual mileage is required and must be greater than 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    if (!validateForm()) {
      return;
    }

    if (!currentHouse) return;

    const systemData = {
      houseId: currentHouse.id,
      name: formData.name,
      type: formData.type,
      installDate: new Date(formData.installDate),
      isActive: formData.isActive,
      system_cost: formData.system_cost,
      specifications: formData.specifications
    };

    if (initialData) {
      updateSystem(initialData.id, systemData as Partial<SystemType>);
    } else {
      addSystem(systemData as Omit<SystemType, 'id'>);
    }
    onSuccess();
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return;
    }
    
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    const parsedValue = numericValue === '' ? 0 : parseFloat(numericValue) || 0;
    setFormData(prev => ({ ...prev, system_cost: parsedValue }));
    
    // Clear error when user starts typing
    if (showErrors && errors.system_cost) {
      setErrors(prev => ({ ...prev, system_cost: undefined }));
    }
  };

  const updateSpecification = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
    
    // Clear relevant error when user starts typing
    if (showErrors && errors[key as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const getSpecValue = (key: string, defaultValue: any = '') => {
    return (formData.specifications as any)[key] || defaultValue;
  };

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (showErrors && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleCostChange,
    updateSpecification,
    getSpecValue,
    errors,
    showErrors,
    handleFieldChange
  };
};
