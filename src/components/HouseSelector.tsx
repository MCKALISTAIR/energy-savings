
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSystem } from '@/contexts/SystemContext';
import { Home, Edit, Trash2, Plus } from 'lucide-react';
import AddHouseDialog from './AddHouseDialog';
import EditHouseDialog from './EditHouseDialog';

const HouseSelector: React.FC = () => {
  const { houses, currentHouse, setCurrentHouse, addHouse, updateHouse, deleteHouse } = useSystem();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<any>(null);

  const openEditDialog = (house: any) => {
    setEditingHouse(house);
    setIsEditDialogOpen(true);
  };

  // Show empty state when no houses exist
  if (houses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            House Management
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="py-8">
            <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No houses added yet</h3>
            <p className="text-muted-foreground mb-6">
              Add your first house to start managing your renewable energy systems
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First House
            </Button>
          </div>
          
          <AddHouseDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddHouse={addHouse}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          House Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="house-select">Current House</Label>
            <Select value={currentHouse?.id || ''} onValueChange={(value) => {
              const house = houses.find(h => h.id === value);
              setCurrentHouse(house || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a house" />
              </SelectTrigger>
              <SelectContent>
                {houses.map((house) => (
                  <SelectItem key={house.id} value={house.id}>
                    {house.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <AddHouseDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddHouse={addHouse}
          />
        </div>

        {currentHouse && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{currentHouse.name}</h3>
                <p className="text-sm text-muted-foreground">{currentHouse.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Added: {currentHouse.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditDialog(currentHouse)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteHouse(currentHouse.id)}
                  disabled={houses.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <EditHouseDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          house={editingHouse}
          onEditHouse={updateHouse}
        />
      </CardContent>
    </Card>
  );
};

export default HouseSelector;
