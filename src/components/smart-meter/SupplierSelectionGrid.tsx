import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface EnergySupplier {
  id: string;
  name: string;
  available: boolean;
  color: string;
}

interface SupplierSelectionGridProps {
  suppliers: EnergySupplier[];
  isTransitioning: boolean;
  onSupplierSelect: (supplierId: string) => void;
}

const SupplierSelectionGrid: React.FC<SupplierSelectionGridProps> = ({
  suppliers,
  isTransitioning,
  onSupplierSelect
}) => {
  if (isTransitioning) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((supplier, index) => (
          <div
            key={supplier.id}
            className={`relative p-4 border rounded-lg transition-all duration-500 ${
              supplier.available && supplier.id === 'octopus'
                ? 'border-primary bg-primary/5 scale-105 z-10'
                : 'opacity-0 scale-95 translate-y-2'
            }`}
            style={{ 
              transitionDelay: supplier.id === 'octopus' ? '0ms' : `${index * 50}ms`
            }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${supplier.color}`} />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                {!supplier.available && (
                  <Badge variant="secondary" className="mt-1">Coming Soon</Badge>
                )}
              </div>
              {supplier.available && supplier.id === 'octopus' && (
                <CheckCircle2 className="w-5 h-5 text-green-500 animate-scale-in" />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {suppliers.map((supplier) => (
        <div
          key={supplier.id}
          className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 hover-scale ${
            supplier.available 
              ? 'border-gray-200 hover:border-primary hover:shadow-md' 
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
          }`}
          onClick={() => supplier.available && onSupplierSelect(supplier.id)}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${supplier.color}`} />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{supplier.name}</h3>
              {!supplier.available && (
                <Badge variant="secondary" className="mt-1">Coming Soon</Badge>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SupplierSelectionGrid;