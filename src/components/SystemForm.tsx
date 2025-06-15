
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSystem } from '@/contexts/SystemContext';
import { SystemType } from '@/types';

interface SystemFormProps {
  initialData?: SystemType;
  onSuccess: () => void;
}

const SystemForm: React.FC<SystemFormProps> = ({ initialData, onSuccess }) => {
  const { addSystem, updateSystem, currentHouse } = useSystem();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'solar' as const,
    installDate: initialData?.installDate ? initialData.installDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isActive: initialData?.isActive ?? true,
    specifications: initialData?.specifications || {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse) return;

    const systemData = {
      houseId: currentHouse.id,
      name: formData.name,
      type: formData.type,
      installDate: new Date(formData.installDate),
      isActive: formData.isActive,
      specifications: formData.specifications
    };

    if (initialData) {
      updateSystem(initialData.id, systemData as Partial<SystemType>);
    } else {
      addSystem(systemData as Omit<SystemType, 'id'>);
    }
    onSuccess();
  };

  const updateSpecification = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const getSpecValue = (key: string, defaultValue: any = '') => {
    return (formData.specifications as any)[key] || defaultValue;
  };

  const renderSpecificationsFields = () => {
    switch (formData.type) {
      case 'solar':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="capacity">Capacity (kW)</Label>
              <Input
                id="capacity"
                type="number"
                value={getSpecValue('capacity')}
                onChange={(e) => updateSpecification('capacity', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="panelCount">Panel Count</Label>
              <Input
                id="panelCount"
                type="number"
                value={getSpecValue('panelCount')}
                onChange={(e) => updateSpecification('panelCount', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input
                id="efficiency"
                type="number"
                step="0.1"
                value={getSpecValue('efficiency')}
                onChange={(e) => updateSpecification('efficiency', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="orientation">Orientation</Label>
              <Input
                id="orientation"
                value={getSpecValue('orientation')}
                onChange={(e) => updateSpecification('orientation', e.target.value)}
                placeholder="e.g., South"
              />
            </div>
            <div>
              <Label htmlFor="tilt">Tilt (degrees)</Label>
              <Input
                id="tilt"
                type="number"
                value={getSpecValue('tilt')}
                onChange={(e) => updateSpecification('tilt', Number(e.target.value))}
              />
            </div>
          </div>
        );

      case 'battery':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="capacity">Capacity (kWh)</Label>
              <Input
                id="capacity"
                type="number"
                value={getSpecValue('capacity')}
                onChange={(e) => updateSpecification('capacity', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="efficiency">Efficiency (%)</Label>
              <Input
                id="efficiency"
                type="number"
                step="0.1"
                value={getSpecValue('efficiency')}
                onChange={(e) => updateSpecification('efficiency', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={getSpecValue('brand')}
                onChange={(e) => updateSpecification('brand', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={getSpecValue('model')}
                onChange={(e) => updateSpecification('model', e.target.value)}
              />
            </div>
          </div>
        );

      case 'ev':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={getSpecValue('make')}
                onChange={(e) => updateSpecification('make', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={getSpecValue('model')}
                onChange={(e) => updateSpecification('model', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="batteryCapacity">Battery Capacity (kWh)</Label>
              <Input
                id="batteryCapacity"
                type="number"
                value={getSpecValue('batteryCapacity')}
                onChange={(e) => updateSpecification('batteryCapacity', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="efficiency">Efficiency (miles/kWh)</Label>
              <Input
                id="efficiency"
                type="number"
                step="0.1"
                value={getSpecValue('efficiency')}
                onChange={(e) => updateSpecification('efficiency', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="annualMileage">Annual Mileage</Label>
              <Input
                id="annualMileage"
                type="number"
                value={getSpecValue('annualMileage')}
                onChange={(e) => updateSpecification('annualMileage', Number(e.target.value))}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-h-[70vh] overflow-hidden flex flex-col">
      <ScrollArea className="flex-1 pr-6">
        <form onSubmit={handleSubmit} className="space-y-4 pb-4">
          <div>
            <Label htmlFor="name">System Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label>System Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'solar' | 'battery' | 'ev') => 
                setFormData(prev => ({ ...prev, type: value, specifications: {} }))
              }
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
            <Label htmlFor="installDate">Install Date</Label>
            <Input
              id="installDate"
              type="date"
              value={formData.installDate}
              onChange={(e) => setFormData(prev => ({ ...prev, installDate: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">System Active</Label>
          </div>

          {renderSpecificationsFields()}
        </form>
      </ScrollArea>
      
      <div className="flex gap-2 pt-4 border-t">
        <Button type="submit" onClick={handleSubmit}>
          {initialData ? 'Update System' : 'Add System'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default SystemForm;
