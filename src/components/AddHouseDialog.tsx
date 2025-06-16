
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AddressLookup from './AddressLookup';

interface AddHouseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHouse: (houseData: { name: string; address: string }) => void;
}

const AddHouseDialog: React.FC<AddHouseDialogProps> = ({ isOpen, onOpenChange, onAddHouse }) => {
  const [formData, setFormData] = useState({ name: '', address: '' });

  const handleAddHouse = () => {
    if (formData.name && formData.address) {
      onAddHouse(formData);
      setFormData({ name: '', address: '' });
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setFormData({ name: '', address: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="mt-6">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New House</DialogTitle>
          <DialogDescription>
            Add a new house to your account. You can search by postcode or enter the address manually.
          </DialogDescription>
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
          
          <AddressLookup formData={formData} setFormData={setFormData} />
          
          <Button onClick={handleAddHouse} className="w-full">
            Add House
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHouseDialog;
