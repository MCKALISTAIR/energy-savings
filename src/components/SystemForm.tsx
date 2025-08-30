
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SystemType } from '@/types';
import { useSystemForm } from '@/hooks/useSystemForm';
import { useIsMobile } from '@/hooks/use-mobile';
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

  const isMobile = useIsMobile();

  // Determine if we should use "Vehicle" or "System" terminology
  const isEV = formData.type === 'ev';
  const systemOrVehicle = isEV ? 'Vehicle' : 'System';

  return (
    <div className="sm:max-h-[70vh] h-[75vh] overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 sm:pr-6 pr-2">
        <div className="sm:p-6 p-4">
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
              isMobile={isMobile}
            />
            
            <SystemSpecifications
              systemType={formData.type}
              getSpecValue={getSpecValue}
              updateSpecification={updateSpecification}
              errors={errors}
              showErrors={showErrors}
              isMobile={isMobile}
            />
          </form>
        </div>
      </ScrollArea>
      
      <div className="sm:px-6 px-4 pb-4">
        <SystemFormButtons
          initialData={initialData}
          systemOrVehicle={systemOrVehicle}
          onSubmit={handleSubmit}
          onCancel={onSuccess}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default SystemForm;