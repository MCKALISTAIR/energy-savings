
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
    getSpecValue,
    errors,
    showErrors,
    handleFieldChange,
    handleSystemTypeChange
  } = useSystemForm({ initialData, onSuccess });

  // Determine if we should use "Vehicle" or "System" terminology
  const isEV = formData.type === 'ev';
  const systemOrVehicle = isEV ? 'Vehicle' : 'System';

  return (
    <div className="max-h-[70vh] overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 pr-6">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 pb-4">
            <SystemFormFields
              formData={formData}
              setFormData={setFormData}
              handleCostChange={handleCostChange}
              handleFieldChange={handleFieldChange}
              handleSystemTypeChange={handleSystemTypeChange}
              systemOrVehicle={systemOrVehicle}
              errors={errors}
              showErrors={showErrors}
            />
            
            <SystemSpecifications
              systemType={formData.type}
              getSpecValue={getSpecValue}
              updateSpecification={updateSpecification}
              errors={errors}
              showErrors={showErrors}
            />
          </form>
        </div>
      </ScrollArea>
      
      <div className="px-6">
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
