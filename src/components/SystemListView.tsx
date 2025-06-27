
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Calendar, Plus } from 'lucide-react';
import { SystemType } from '@/types';
import { getSystemIcon, getSystemColor } from './SystemUtils';

interface SystemListViewProps {
  currentHouseSystems: SystemType[];
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  onEdit: (system: SystemType) => void;
  onDelete: (systemId: string) => void;
}

const SystemListView: React.FC<SystemListViewProps> = ({
  currentHouseSystems,
  isAddDialogOpen,
  setIsAddDialogOpen,
  onEdit,
  onDelete
}) => {
  if (currentHouseSystems.length === 0) {
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
  }

  return (
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
                onClick={() => onEdit(system)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(system.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemListView;
