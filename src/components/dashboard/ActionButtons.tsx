
import React from 'react';
import { Button } from '@/components/ui/button';
import { DashboardConfig } from './types';

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onSave, onReset }) => {
  return (
    <div className="flex gap-2 pt-2">
      <Button onClick={onSave} size="sm" className="flex-1">
        Apply
      </Button>
      <Button onClick={onReset} variant="outline" size="sm">
        Reset
      </Button>
    </div>
  );
};

export default ActionButtons;
