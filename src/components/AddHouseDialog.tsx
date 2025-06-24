import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AddressLookup from './AddressLookup';

interface AddHouseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHouse: (houseData: { name: string; address: string }) => void;
}

const AddHouseDialog: React.FC<AddHouseDialogProps> = ({ isOpen, onOpenChange, onAddHouse }) => {
  const [formData, setFormData] = useState({ name: '', address: '' });
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});
  const [showErrors, setShowErrors] = useState(false);
  const isMobile = useIsMobile();

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

  const handleAddHouse = () => {
    setShowErrors(true);
    if (validateForm()) {
      onAddHouse(formData);
      setFormData({ name: '', address: '' });
      setErrors({});
      setShowErrors(false);
      onOpenChange(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="mt-6">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className={isMobile ? 'w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] m-2' : 'max-w-2xl'}>
        <DialogHeader>
          <DialogTitle className={isMobile ? 'text-lg' : 'text-xl'}>Add New House</DialogTitle>
          <DialogDescription className={isMobile ? 'text-sm' : ''}>
            Add a new house to your account. You can search by postcode or enter the address manually.
          </DialogDescription>
        </DialogHeader>
        <div className={`space-y-4 ${isMobile ? 'overflow-y-auto flex-1' : ''}`}>
          <div>
            <Label htmlFor="house-name" className={isMobile ? 'text-sm' : ''}>
              House Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="house-name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="e.g. Main House, Holiday Home"
              className={`${showErrors && errors.name ? 'border-red-500' : ''} ${isMobile ? 'h-12 text-base' : ''}`}
            />
            {showErrors && errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <AddressLookup 
              formData={formData} 
              setFormData={(newFormData) => {
                if (typeof newFormData === 'function') {
                  setFormData(newFormData);
                } else {
                  setFormData(newFormData);
                  // Clear address error when address is updated via lookup
                  if (showErrors && errors.address && newFormData.address) {
                    setErrors(prev => ({ ...prev, address: undefined }));
                  }
                }
              }}
              className={`${showErrors && errors.address ? 'border-red-500' : ''} ${isMobile ? 'min-h-12 text-base' : ''}`}
              isMobile={isMobile}
            />
            {showErrors && errors.address && (
              <p className="text-sm text-red-500 mt-1">{errors.address}</p>
            )}
          </div>
          
          <Button 
            onClick={handleAddHouse} 
            className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
          >
            Add House
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHouseDialog;
