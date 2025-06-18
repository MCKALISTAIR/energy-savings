
import React from 'react';
import { System } from '@/hooks/useSystems';
import SystemCard from './SystemCard';
import EmptySystemsState from './EmptySystemsState';

interface SystemListProps {
  systems: System[];
  onEdit: (system: System) => void;
  onDelete: (systemId: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
}

const SystemList: React.FC<SystemListProps> = ({ 
  systems, 
  onEdit, 
  onDelete, 
  isAddDialogOpen, 
  setIsAddDialogOpen 
}) => {
  if (systems.length === 0) {
    return (
      <EmptySystemsState 
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />
    );
  }

  return (
    <div className="space-y-4">
      {systems.map((system) => (
        <SystemCard
          key={system.id}
          system={system}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SystemList;
