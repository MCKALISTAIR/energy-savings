import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SupplierSelectionGrid from './SupplierSelectionGrid';
import SelectedSupplierDisplay from './SelectedSupplierDisplay';

interface EnergySupplier {
  id: string;
  name: string;
  available: boolean;
  color: string;
}

interface SupplierSelectionCardProps {
  selectedSupplier: string | null;
  isTransitioning: boolean;
  isReverseTransitioning: boolean;
  energySuppliers: EnergySupplier[];
  onSupplierSelect: (supplierId: string) => void;
  onChangeSupplier: () => void;
}

const SupplierSelectionCard: React.FC<SupplierSelectionCardProps> = ({
  selectedSupplier,
  isTransitioning,
  isReverseTransitioning,
  energySuppliers,
  onSupplierSelect,
  onChangeSupplier
}) => {
  return (
    <Card className="will-change-transform backface-visibility-hidden">
      <CardHeader>
        <CardTitle>
          {selectedSupplier === 'octopus' && !isReverseTransitioning ? 'Selected Energy Supplier' : 'Choose Your Energy Supplier'}
        </CardTitle>
        <CardDescription>
          {selectedSupplier === 'octopus' && !isReverseTransitioning
            ? 'You have selected Octopus Energy for smart meter integration'
            : 'Select your current energy supplier to set up smart meter integration'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedSupplier === 'octopus' && !isReverseTransitioning ? (
          <SelectedSupplierDisplay
            supplierName="Octopus Energy"
            supplierColor="bg-pink-500"
            onChangeSupplier={onChangeSupplier}
          />
        ) : (
          <div className={`transition-transform duration-700 ease-in-out transform-gpu origin-top ${
            isTransitioning 
              ? 'scale-y-0 opacity-0' 
              : 'scale-y-100 opacity-100'
          }`}>
            <SupplierSelectionGrid
              suppliers={energySuppliers}
              isTransitioning={isTransitioning}
              isReverseTransitioning={isReverseTransitioning}
              onSupplierSelect={onSupplierSelect}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplierSelectionCard;