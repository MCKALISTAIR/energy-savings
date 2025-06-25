
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSystem } from '@/contexts/SystemContext';
import { SystemType } from '@/types';
import { Zap, Battery, Car, Plus, Edit, Trash2, Calendar, List, Home } from 'lucide-react';
import SystemForm from './SystemForm';
import { format } from 'date-fns';

const SystemManager: React.FC = () => {
  const { getCurrentHouseSystems, deleteSystem, currentHouse, systems, houses } = useSystem();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<SystemType | null>(null);

  const currentHouseSystems = getCurrentHouseSystems();

  const getSystemIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Zap className="w-4 h-4" />;
      case 'battery': return <Battery className="w-4 h-4" />;
      case 'ev': return <Car className="w-4 h-4" />;
      default: return null;
    }
  };

  const getSystemColor = (type: string) => {
    switch (type) {
      case 'solar': return 'bg-yellow-100 text-yellow-800';
      case 'battery': return 'bg-blue-100 text-blue-800';
      case 'ev': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHouseName = (houseId: string) => {
    const house = houses.find(h => h.id === houseId);
    return house?.name || 'Unknown House';
  };

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

  // Timeline view component for local systems
  const TimelineView = () => {
    // Sort systems by install date (newest first)
    const sortedSystems = [...systems].sort((a, b) => 
      new Date(b.installDate).getTime() - new Date(a.installDate).getTime()
    );

    // Group systems by year
    const systemsByYear = sortedSystems.reduce((acc, system) => {
      const year = new Date(system.installDate).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(system);
      return acc;
    }, {} as Record<number, SystemType[]>);

    const years = Object.keys(systemsByYear).map(Number).sort((a, b) => b - a);

    if (systems.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No systems installed yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add your first renewable energy system to see your timeline
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {years.map((year) => (
          <div key={year} className="relative">
            {/* Year Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                {year}
              </div>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Systems for this year */}
            <div className="space-y-3 ml-4">
              {systemsByYear[year].map((system, index) => (
                <div key={system.id} className="relative">
                  {/* Timeline connector */}
                  <div className="absolute -left-6 top-4 w-2 h-2 bg-primary rounded-full"></div>
                  {index < systemsByYear[year].length - 1 && (
                    <div className="absolute -left-5 top-6 w-px h-12 bg-border"></div>
                  )}

                  {/* System Card */}
                  <div className="border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSystemColor(system.type)}>
                            {getSystemIcon(system.type)}
                            <span className="ml-1 capitalize">{system.type}</span>
                          </Badge>
                          <h3 className="font-semibold">{system.name}</h3>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(system.installDate, 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Home className="w-3 h-3" />
                            {getHouseName(system.houseId)}
                          </div>
                        </div>

                        {/* System specifications preview */}
                        <div className="text-sm text-muted-foreground">
                          {system.type === 'solar' && (
                            <span>Capacity: {system.specifications.capacity}kW</span>
                          )}
                          {system.type === 'battery' && (
                            <span>Capacity: {system.specifications.capacity}kWh</span>
                          )}
                          {system.type === 'ev' && (
                            <span>
                              {system.specifications.make} {system.specifications.model}
                            </span>
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
                          onClick={() => deleteSystem(system.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{systems.length}</div>
              <div className="text-xs text-muted-foreground">Total Systems</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{years.length}</div>
              <div className="text-xs text-muted-foreground">Years Active</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{houses.length}</div>
              <div className="text-xs text-muted-foreground">Properties</div>
            </div>
          </div>
        </div>
      </div>
    );
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
              <SystemForm onSuccess={handleAddSuccess} />
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
            {currentHouseSystems.length === 0 ? (
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
                {currentHouseSystems.map((system) => (
                  <div key={system.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSystemColor(system.type)}>
                            {getSystemIcon(system.type)}
                            <span className="ml-1 capitalize">{system.type}</span>
                          </Badge>
                          <h3 className="font-semibold">{system.name}</h3>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Installed: {system.installDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-sm">
                          {system.type === 'solar' && (
                            <span>Capacity: {system.specifications.capacity}kW</span>
                          )}
                          {system.type === 'battery' && (
                            <span>Capacity: {system.specifications.capacity}kWh</span>
                          )}
                          {system.type === 'ev' && (
                            <span>{system.specifications.make} {system.specifications.model}</span>
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
                          onClick={() => deleteSystem(system.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timeline" className="mt-4">
            <TimelineView />
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit System</DialogTitle>
            </DialogHeader>
            {editingSystem && (
              <SystemForm 
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

export default SystemManager;
