
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
}

const SystemFormFields: React.FC<SystemFormFieldsProps> = ({
  formData,
  setFormData,
  handleCostChange,
  handleFieldChange,
  handleSystemTypeChange,
  systemOrVehicle,
  errors,
  showErrors
}) => {
  const preferredCurrency = getPreferredCurrency();
  const currencySymbol = getCurrencySymbol(preferredCurrency);
  const isEV = formData.type === 'ev';

  return (
    <>
      <div>
        <Label htmlFor="name">{systemOrVehicle} Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className={showErrors && errors.name ? 'border-red-500' : ''}
          required
        />
        {showErrors && errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label>System Type</Label>
        <Select
          value={formData.type}
          onValueChange={handleSystemTypeChange}
        >
          <SelectTrigger>
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
        <Label htmlFor="installDate">{isEV ? 'Delivery Date' : 'Install Date'} <span className="text-red-500">*</span></Label>
        <Input
          id="installDate"
          type="date"
          value={formData.installDate}
          onChange={(e) => handleFieldChange('installDate', e.target.value)}
          className={showErrors && errors.installDate ? 'border-red-500' : ''}
          required
        />
        {showErrors && errors.installDate && (
          <p className="text-sm text-red-500 mt-1">{errors.installDate}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">{isEV ? 'Current Vehicle' : `${systemOrVehicle} Active`}</Label>
      </div>

      <div>
        <Label htmlFor="system_cost">{systemOrVehicle} Cost <span className="text-red-500">*</span></Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {currencySymbol}
          </span>
          <Input
            id="system_cost"
            type="text"
            value={formData.system_cost > 0 ? formData.system_cost.toString() : ''}
            onChange={handleCostChange}
            placeholder={`Enter the total ${systemOrVehicle.toLowerCase()} cost`}
            className={`pl-8 ${showErrors && errors.system_cost ? 'border-red-500' : ''}`}
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
