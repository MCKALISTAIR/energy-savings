
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
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (house) {
      setFormData({ name: house.name, address: house.address });
      setErrors({});
      setShowErrors(false);
    }
  }, [house]);

  const validateForm = () => {
    const newErrors: { name?: string; address?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'House name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditHouse = () => {
    setShowErrors(true);
    if (house && validateForm()) {
      onEditHouse(house.id, formData);
      onOpenChange(false);
      setFormData({ name: '', address: '' });
      setErrors({});
      setShowErrors(false);
    }
  };

  const handleFieldChange = (field: 'name' | 'address', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (showErrors && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setErrors({});
      setShowErrors(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit House</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-house-name">House Name <span className="text-red-500">*</span></Label>
            <Input
              id="edit-house-name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className={showErrors && errors.name ? 'border-red-500' : ''}
            />
            {showErrors && errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="edit-house-address">Address <span className="text-red-500">*</span></Label>
            <Textarea
              id="edit-house-address"
              value={formData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              className={showErrors && errors.address ? 'border-red-500' : ''}
            />
            {showErrors && errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEditHouse} className="flex-1">
              Update House
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditHouseDialog;
