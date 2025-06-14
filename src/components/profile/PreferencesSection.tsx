
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PreferencesSectionProps {
  currency: string;
  onCurrencyChange: (value: string) => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  currency,
  onCurrencyChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Preferences</h3>
      
      <div>
        <Label htmlFor="currency">Currency</Label>
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GBP">GBP (£)</SelectItem>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="CAD">CAD (C$)</SelectItem>
            <SelectItem value="AUD">AUD (A$)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PreferencesSection;
