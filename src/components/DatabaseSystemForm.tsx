import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDatabaseSystem } from '@/contexts/DatabaseSystemContext';
import { System } from '@/hooks/useSystems';

interface DatabaseSystemFormProps {
  initialData?: System;
  onSuccess: () => void;
}

const DatabaseSystemForm: React.FC<DatabaseSystemFormProps> = ({ initialData, onSuccess }) => {
  const { addSystem, updateSystem, currentHouse } = useDatabaseSystem();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'solar' as const,
    install_date: initialData?.install_date ? initialData.install_date : new Date().toISOString().split('T')[0],
    is_active: initialData?.is_active ?? true,
    system_cost: initialData?.system_cost || 0,
    specifications: initialData?.specifications || {}
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse) return;

    setLoading(true);
    try {
      const systemData = {
        house_id: currentHouse.id,
        name: formData.name,
        type: formData.type,
        install_date: formData.install_date,
        is_active: formData.is_active,
        system_cost: formData.system_cost,
        specifications: formData.specifications
      };

      if (initialData) {
        await updateSystem(initialData.id, systemData);
      } else {
        await addSystem(systemData);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save system:', error);
    } finally {
      setLoading(false);
    }
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

      case 'heat_pump':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heatPumpType">Heat Pump Type</Label>
              <Select
                value={getSpecValue('heatPumpType', 'air-source')}
                onValueChange={(value) => updateSpecification('heatPumpType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="air-source">Air Source</SelectItem>
                  <SelectItem value="ground-source">Ground Source (Geothermal)</SelectItem>
                  <SelectItem value="water-source">Water Source</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cop">Coefficient of Performance (COP)</Label>
              <Input
                id="cop"
                type="number"
                step="0.1"
                value={getSpecValue('cop')}
                onChange={(e) => updateSpecification('cop', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="heatingCapacity">Heating Capacity (BTU/hr)</Label>
              <Input
                id="heatingCapacity"
                type="number"
                value={getSpecValue('heatingCapacity')}
                onChange={(e) => updateSpecification('heatingCapacity', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="coolingCapacity">Cooling Capacity (BTU/hr)</Label>
              <Input
                id="coolingCapacity"
                type="number"
                value={getSpecValue('coolingCapacity')}
                onChange={(e) => updateSpecification('coolingCapacity', Number(e.target.value))}
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

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onValueChange={(value: 'solar' | 'battery' | 'ev' | 'heat_pump') => 
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
            <SelectItem value="heat_pump">Heat Pump</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="system_cost">System Cost (£)</Label>
        <Input
          id="system_cost"
          type="number"
          step="0.01"
          min="0"
          value={formData.system_cost}
          onChange={(e) => setFormData(prev => ({ ...prev, system_cost: Number(e.target.value) }))}
          placeholder="Enter the total system cost"
          required
        />
      </div>

      <div>
        <Label htmlFor="install_date">Install Date</Label>
        <Input
          id="install_date"
          type="date"
          value={formData.install_date}
          onChange={(e) => setFormData(prev => ({ ...prev, install_date: e.target.value }))}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">System Active</Label>
      </div>

      {renderSpecificationsFields()}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : (initialData ? 'Update System' : 'Add System')}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DatabaseSystemForm;
