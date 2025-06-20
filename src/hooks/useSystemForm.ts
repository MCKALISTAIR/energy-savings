
import { useState } from 'react';
import { useSystem } from '@/contexts/SystemContext';
import { SystemType } from '@/types';

interface UseSystemFormProps {
  initialData?: SystemType;
  onSuccess: () => void;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const updateSpecification = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const getSpecValue = (key: string, defaultValue: any = '') => {
    return (formData.specifications as any)[key] || defaultValue;
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    handleCostChange,
    updateSpecification,
    getSpecValue
  };
};
