
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useDatabaseSystem } from '@/contexts/DatabaseSystemContext';
import { Zap, Battery, Car, Plus, Edit, Trash2, Calendar, Thermometer, PoundSterling } from 'lucide-react';
import DatabaseSystemForm from './DatabaseSystemForm';
import { System } from '@/hooks/useSystems';
import { formatCurrency } from '@/utils/currency';

const DatabaseSystemManager: React.FC = () => {
  const { 
    getCurrentHouseSystems, 
    deleteSystem, 
    currentHouse,
    systemsLoading 
  } = useDatabaseSystem();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<System | null>(null);

  const systems = getCurrentHouseSystems();

  // Debug logging
  console.log('Systems data:', systems);
  systems.forEach(system => {
    console.log(`System ${system.name} cost:`, system.system_cost, typeof system.system_cost);
  });

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Zap className="w-4 h-4" />;
      case 'battery': return <Battery className="w-4 h-4" />;
      case 'ev': return <Car className="w-4 h-4" />;
      case 'heat_pump': return <Thermometer className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSystemColor = (type: string) => {
    switch (type) {
      case 'solar': return 'bg-yellow-100 text-yellow-800';
      case 'battery': return 'bg-blue-100 text-blue-800';
      case 'ev': return 'bg-green-100 text-green-800';
      case 'heat_pump': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSystemDisplayName = (type: string) => {
    switch (type) {
      case 'heat_pump': return 'Heat Pump';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

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
        {systems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No systems added yet</p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First System
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {systems.map((system) => (
              <div key={system.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSystemColor(system.type)}>
                        {getSystemIcon(system.type)}
                        <span className="ml-1">{getSystemDisplayName(system.type)}</span>
                      </Badge>
                      <h3 className="font-semibold">{system.name}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2 space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Installed: {new Date(system.install_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <PoundSterling className="w-3 h-3" />
                        Cost: {formatCurrency(system.system_cost || 0)}
                      </div>
                    </div>
                    <div className="text-sm">
                      {system.type === 'solar' && system.specifications.capacity && (
                        <span>Capacity: {system.specifications.capacity}kW</span>
                      )}
                      {system.type === 'battery' && system.specifications.capacity && (
                        <span>Capacity: {system.specifications.capacity}kWh</span>
                      )}
                      {system.type === 'ev' && system.specifications.make && system.specifications.model && (
                        <span>{system.specifications.make} {system.specifications.model}</span>
                      )}
                      {system.type === 'heat_pump' && system.specifications.heatPumpType && (
                        <span>{system.specifications.heatPumpType} Heat Pump{system.specifications.cop ? `, COP: ${system.specifications.cop}` : ''}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(system)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteSystem(system.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
