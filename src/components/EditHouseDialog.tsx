
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface House {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
}

interface EditHouseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  house: House | null;
  onEditHouse: (id: string, houseData: { name: string; address: string }) => void;
}

const EditHouseDialog: React.FC<EditHouseDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  house, 
  onEditHouse 
}) => {
  const [formData, setFormData] = useState({ name: '', address: '' });

  useEffect(() => {
    if (house) {
      setFormData({ name: house.name, address: house.address });
    }
  }, [house]);

  const handleEditHouse = () => {
    if (house && formData.name && formData.address) {
      onEditHouse(house.id, formData);
      onOpenChange(false);
      setFormData({ name: '', address: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button onClick={handleEditHouse} className="w-full">
            Update House
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditHouseDialog;
