
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SystemType } from '@/types';
import { useSystemForm } from '@/hooks/useSystemForm';
import SystemFormFields from './SystemFormFields';
import SystemSpecifications from './SystemSpecifications';
import SystemFormButtons from './SystemFormButtons';

interface SystemFormProps {
  initialData?: SystemType;
  onSuccess: () => void;
}

const SystemForm: React.FC<SystemFormProps> = ({ initialData, onSuccess }) => {
  const {
    formData,
    setFormData,
    handleSubmit,
    handleCostChange,
    updateSpecification,
    getSpecValue
  } = useSystemForm({ initialData, onSuccess });

  // Determine if we should use "Vehicle" or "System" terminology
  const isEV = formData.type === 'ev';
  const systemOrVehicle = isEV ? 'Vehicle' : 'System';

  return (
    <div className="max-h-[70vh] overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 pr-6">
        <div className="p-2">
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <SystemFormFields
              formData={formData}
              setFormData={setFormData}
              handleCostChange={handleCostChange}
              systemOrVehicle={systemOrVehicle}
            />
            
            <SystemSpecifications
              systemType={formData.type}
              getSpecValue={getSpecValue}
              updateSpecification={updateSpecification}
            />
          </form>
        </div>
      </ScrollArea>
      
      <div className="px-2">
        <SystemFormButtons
          initialData={initialData}
          systemOrVehicle={systemOrVehicle}
          onSubmit={handleSubmit}
          onCancel={onSuccess}
        />
      </div>
    </div>
  );
};

export default SystemForm;
