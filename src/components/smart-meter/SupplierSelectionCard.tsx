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
  const isShowingSelected = selectedSupplier === 'octopus' && !isReverseTransitioning;
  // Start height transition immediately when Octopus is selected
  const shouldUseCompactHeight = selectedSupplier === 'octopus' && !isReverseTransitioning;

  return (
    <Card className="will-change-transform backface-visibility-hidden overflow-hidden">
      <div className="transition-all duration-700 ease-in-out transform-gpu">
        <CardHeader>
          <CardTitle>
            {isShowingSelected ? 'Selected Energy Supplier' : 'Choose Your Energy Supplier'}
          </CardTitle>
          <CardDescription>
            {isShowingSelected
              ? 'You have selected Octopus Energy for smart meter integration'
              : 'Select your current energy supplier to set up smart meter integration'
            }
          </CardDescription>
        </CardHeader>
        <CardContent 
          className="relative transition-all duration-700 ease-in-out"
          style={{
            height: shouldUseCompactHeight ? '120px' : 'auto',
            minHeight: shouldUseCompactHeight ? '120px' : '300px'
          }}
        >
          {/* Grid view */}
          <div className={`transition-all duration-700 ease-in-out ${
            isShowingSelected 
              ? 'opacity-0 transform scale-95 pointer-events-none absolute inset-0' 
              : 'opacity-100 transform scale-100'
          }`}>
            <SupplierSelectionGrid
              suppliers={energySuppliers}
              isTransitioning={isTransitioning}
              isReverseTransitioning={isReverseTransitioning}
              onSupplierSelect={onSupplierSelect}
            />
          </div>
          
          {/* Selected supplier view */}
          <div className={`transition-all duration-700 ease-in-out flex items-center ${
            isShowingSelected
              ? 'opacity-100 transform scale-100 delay-350'
              : 'opacity-0 transform scale-95 pointer-events-none absolute inset-0'
          }`}>
            <div className="w-full">
              <SelectedSupplierDisplay
                supplierName="Octopus Energy"
                supplierColor="bg-pink-500"
                onChangeSupplier={onChangeSupplier}
              />
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default SupplierSelectionCard;