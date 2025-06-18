
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface EmptySystemsStateProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
}

const EmptySystemsState: React.FC<EmptySystemsStateProps> = ({ 
  isAddDialogOpen, 
  setIsAddDialogOpen 
}) => {
  return (
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
  );
};

export default EmptySystemsState;
