
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import SystemForm from './SystemForm';

interface SystemManagerHeaderProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  onAddSuccess: () => void;
}

const SystemManagerHeader: React.FC<SystemManagerHeaderProps> = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  onAddSuccess
}) => {
  return (
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
            <SystemForm onSuccess={onAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  );
};

export default SystemManagerHeader;
