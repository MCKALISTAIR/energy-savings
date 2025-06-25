
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDatabaseSystem } from '@/contexts/DatabaseSystemContext';
import { Plus, List, Calendar } from 'lucide-react';
import DatabaseSystemForm from './DatabaseSystemForm';
import SystemList from './SystemList';
import SystemTimeline from './SystemTimeline';
import { System } from '@/hooks/useSystems';

const DatabaseSystemManager: React.FC = () => {
  const { 
    getCurrentHouseSystems, 
    deleteSystem, 
    currentHouse,
    systemsLoading,
    houses,
    systems // Get all systems for timeline view
  } = useDatabaseSystem();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);

  const currentHouseSystems = getCurrentHouseSystems();

  // Debug logging
  console.log('Systems data:', currentHouseSystems);
  currentHouseSystems.forEach(system => {
    console.log(`System ${system.name} cost:`, system.system_cost, typeof system.system_cost);
  });

  const openEditDialog = (system: System) => {
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

  const handleDeleteSystem = async (systemId: string) => {
    try {
      await deleteSystem(systemId);
    } catch (error) {
      console.error('Failed to delete system:', error);
    }
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

  if (systemsLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading systems...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>System Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add System
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New System</DialogTitle>
              </DialogHeader>
              <DatabaseSystemForm onSuccess={handleAddSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Current House
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-4">
            <SystemList
              systems={currentHouseSystems}
              onEdit={openEditDialog}
              onDelete={handleDeleteSystem}
              isAddDialogOpen={isAddDialogOpen}
              setIsAddDialogOpen={setIsAddDialogOpen}
            />
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <SystemTimeline 
              systems={systems} 
              houses={houses}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit System</DialogTitle>
            </DialogHeader>
            {editingSystem && (
              <DatabaseSystemForm 
                initialData={editingSystem} 
                onSuccess={handleEditSuccess} 
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DatabaseSystemManager;
