
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useDatabaseSystem } from '@/contexts/DatabaseSystemContext';
import { Home, Plus, Edit, Trash2 } from 'lucide-react';

const DatabaseHouseSelector: React.FC = () => {
  const { 
    houses, 
    currentHouse, 
    setCurrentHouse, 
    addHouse, 
    updateHouse, 
    deleteHouse,
    housesLoading 
  } = useDatabaseSystem();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleAddHouse = async () => {
    if (formData.name && formData.address) {
      setLoading(true);
      try {
        await addHouse(formData);
        setFormData({ name: '', address: '' });
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Failed to add house:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditHouse = async () => {
    if (editingHouse && formData.name && formData.address) {
      setLoading(true);
      try {
        await updateHouse(editingHouse.id, formData);
        setIsEditDialogOpen(false);
        setEditingHouse(null);
        setFormData({ name: '', address: '' });
      } catch (error) {
        console.error('Failed to update house:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteHouse = async (houseId: string) => {
    try {
      await deleteHouse(houseId);
    } catch (error) {
      console.error('Failed to delete house:', error);
    }
  };

  const openEditDialog = (house: any) => {
    setEditingHouse(house);
    setFormData({ name: house.name, address: house.address });
    setIsEditDialogOpen(true);
  };

  if (housesLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Loading houses...</p>
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
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="mt-6">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New House</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="house-name">House Name</Label>
                  <Input
                    id="house-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Main House, Holiday Home"
                  />
                </div>
                <div>
                  <Label htmlFor="house-address">Address</Label>
                  <Textarea
                    id="house-address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address including postcode"
                  />
                </div>
                <Button onClick={handleAddHouse} className="w-full" disabled={loading}>
                  {loading ? 'Adding...' : 'Add House'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {currentHouse && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{currentHouse.name}</h3>
                <p className="text-sm text-muted-foreground">{currentHouse.address}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Added: {new Date(currentHouse.created_at).toLocaleDateString()}
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
                  onClick={() => handleDeleteHouse(currentHouse.id)}
                  disabled={houses.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit House</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-house-name">House Name</Label>
                <Input
                  id="edit-house-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-house-address">Address</Label>
                <Textarea
                  id="edit-house-address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <Button onClick={handleEditHouse} className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update House'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DatabaseHouseSelector;
