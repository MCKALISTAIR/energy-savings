
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SystemType } from '@/types';
import SystemForm from './SystemForm';
import SystemListView from './SystemListView';
import SystemTimelineView from './SystemTimelineView';

interface SystemManagerContentProps {
  currentHouseSystems: SystemType[];
  systems: SystemType[];
  houses: Array<{ id: string; name: string }>;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editingSystem: SystemType | null;
  setEditingSystem: (system: SystemType | null) => void;
  onEdit: (system: SystemType) => void;
  onDelete: (systemId: string) => void;
  onEditSuccess: () => void;
}

const SystemManagerContent: React.FC<SystemManagerContentProps> = ({
  currentHouseSystems,
  systems,
  houses,
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  editingSystem,
  setEditingSystem,
  onEdit,
  onDelete,
  onEditSuccess
}) => {
  return (
    <>
      <TabsContent value="list" className="mt-4">
        <SystemListView
          currentHouseSystems={currentHouseSystems}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>
      
      <TabsContent value="timeline" className="mt-4">
        <SystemTimelineView
          systems={systems}
          houses={houses}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TabsContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit System</DialogTitle>
          </DialogHeader>
          {editingSystem && (
            <SystemForm 
              initialData={editingSystem} 
              onSuccess={onEditSuccess} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SystemManagerContent;
