
import React from 'react';
import { Button } from '@/components/ui/button';
import { SystemType } from '@/types';

interface SystemFormButtonsProps {
  initialData?: SystemType;
  systemOrVehicle: string;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const SystemFormButtons: React.FC<SystemFormButtonsProps> = ({
  initialData,
  systemOrVehicle,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="flex gap-2 pt-4 border-t">
      <Button type="submit" onClick={onSubmit}>
        {initialData ? `Update ${systemOrVehicle}` : `Add ${systemOrVehicle}`}
      </Button>
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default SystemFormButtons;
