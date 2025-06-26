
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getCurrencySymbol, getPreferredCurrency } from '@/utils/currency';

interface SystemFormFieldsProps {
  formData: {
    name: string;
    type: 'solar' | 'battery' | 'ev';
    installDate: string;
    isActive: boolean;
    system_cost: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleCostChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFieldChange: (field: string, value: any) => void;
  handleSystemTypeChange: (newType: 'solar' | 'battery' | 'ev') => void;
  systemOrVehicle: string;
  errors: any;
  showErrors: boolean;
  isMobile?: boolean;
}

const SystemFormFields: React.FC<SystemFormFieldsProps> = ({
  formData,
  setFormData,
  handleCostChange,
  handleFieldChange,
  handleSystemTypeChange,
  systemOrVehicle,
  errors,
  showErrors,
  isMobile = false
}) => {
  const preferredCurrency = getPreferredCurrency();
  const currencySymbol = getCurrencySymbol(preferredCurrency);
  const isEV = formData.type === 'ev';

  // Get today's date in YYYY-MM-DD format for max attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div>
        <Label htmlFor="name" className={isMobile ? 'text-sm' : ''}>
          {systemOrVehicle} Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className={`${showErrors && errors.name ? 'border-red-500' : ''} ${isMobile ? 'h-12 text-base' : ''}`}
          required
        />
        {showErrors && errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label className={isMobile ? 'text-sm' : ''}>System Type</Label>
        <Select
          value={formData.type}
          onValueChange={handleSystemTypeChange}
        >
          <SelectTrigger className={isMobile ? 'h-12 text-base' : ''}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solar">Solar Panels</SelectItem>
            <SelectItem value="battery">Battery Storage</SelectItem>
            <SelectItem value="ev">Electric Vehicle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="installDate" className={isMobile ? 'text-sm' : ''}>
          {isEV ? 'Delivery Date' : 'Install Date'} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="installDate"
          type="date"
          value={formData.installDate}
          max={today}
          onChange={(e) => handleFieldChange('installDate', e.target.value)}
          className={`${showErrors && errors.installDate ? 'border-red-500' : ''} ${isMobile ? 'h-12 text-base' : ''}`}
          required
        />
        {showErrors && errors.installDate && (
          <p className="text-sm text-red-500 mt-1">{errors.installDate}</p>
        )}
      </div>

      <div className={`flex items-center space-x-2 ${isMobile ? 'py-2' : ''}`}>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive" className={isMobile ? 'text-sm' : ''}>
          {isEV ? 'Current Vehicle' : `${systemOrVehicle} Active`}
        </Label>
      </div>

      <div>
        <Label htmlFor="system_cost" className={isMobile ? 'text-sm' : ''}>
          {systemOrVehicle} Cost <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <span className={`absolute ${isMobile ? 'left-4' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground ${isMobile ? 'text-base' : ''}`}>
            {currencySymbol}
          </span>
          <Input
            id="system_cost"
            type="text"
            value={formData.system_cost > 0 ? formData.system_cost.toString() : ''}
            onChange={handleCostChange}
            placeholder={`Enter the total ${systemOrVehicle.toLowerCase()} cost`}
            className={`${isMobile ? 'pl-10 h-12 text-base' : 'pl-8'} ${showErrors && errors.system_cost ? 'border-red-500' : ''}`}
            required
          />
        </div>
        {showErrors && errors.system_cost && (
          <p className="text-sm text-red-500 mt-1">{errors.system_cost}</p>
        )}
      </div>
    </>
  );
};

export default SystemFormFields;
