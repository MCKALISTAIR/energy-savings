import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface SelectedSupplierDisplayProps {
  supplierName: string;
  supplierColor: string;
  onChangeSupplier: () => void;
}

const SelectedSupplierDisplay: React.FC<SelectedSupplierDisplayProps> = ({
  supplierName,
  supplierColor,
  onChangeSupplier
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary animate-scale-in">
      <div className="flex items-center space-x-3">
        <div className={`w-4 h-4 rounded-full ${supplierColor}`} />
        <h3 className="font-medium text-gray-900">{supplierName}</h3>
        <CheckCircle2 className="w-5 h-5 text-green-500 animate-scale-in" />
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onChangeSupplier}
        className="text-muted-foreground hover:text-foreground"
      >
        Change
      </Button>
    </div>
  );
};

export default SelectedSupplierDisplay;