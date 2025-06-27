
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { useSystem } from '@/contexts/SystemContext';
import { SystemType } from '@/types';
import SystemManagerHeader from './SystemManagerHeader';
import SystemManagerTabs from './SystemManagerTabs';
import SystemManagerContent from './SystemManagerContent';

const SystemManager: React.FC = () => {
  const { getCurrentHouseSystems, deleteSystem, currentHouse, systems, houses } = useSystem();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemType | null>(null);

  const currentHouseSystems = getCurrentHouseSystems();

  const openEditDialog = (system: SystemType) => {
    setEditingSystem(system);
    setIsEditDialogOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setEditingSystem(null);
  };

  if (!currentHouse) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please select a house to manage systems</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <SystemManagerHeader
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        onAddSuccess={handleAddSuccess}
      />
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <SystemManagerTabs />
          
          <SystemManagerContent
            currentHouseSystems={currentHouseSystems}
            systems={systems}
            houses={houses}
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            editingSystem={editingSystem}
            setEditingSystem={setEditingSystem}
            onEdit={openEditDialog}
            onDelete={deleteSystem}
            onEditSuccess={handleEditSuccess}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemManager;
