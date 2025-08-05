import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, AlertTriangle } from 'lucide-react';
import { DashboardConfig } from './types';

interface ApiSettingsSectionProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const ApiSettingsSection: React.FC<ApiSettingsSectionProps> = ({ config, onConfigChange }) => {
  const handleVehiclePricingToggle = (enabled: boolean) => {
    onConfigChange({
      ...config,
      useRealTimeVehiclePricing: enabled
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Database className="w-5 h-5" />
          API Integration Settings
        </CardTitle>
        <CardDescription>
          Configure real-time data sources for enhanced accuracy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="real-time-pricing" className="text-base">
              Real-time Vehicle Pricing
            </Label>
            <p className="text-sm text-muted-foreground">
              Use MarketCheck API for current ICE vehicle market pricing
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={config.useRealTimeVehiclePricing ? "default" : "outline"}>
                {config.useRealTimeVehiclePricing ? "Enabled" : "Disabled"}
              </Badge>
              {config.useRealTimeVehiclePricing && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Limited to 500 calls/month</span>
                </div>
              )}
            </div>
          </div>
          <Switch
            id="real-time-pricing"
            checked={config.useRealTimeVehiclePricing}
            onCheckedChange={handleVehiclePricingToggle}
          />
        </div>
        
        {config.useRealTimeVehiclePricing && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> MarketCheck provides US market data converted to GBP. 
              Data is cached for 7 days to optimize API usage. Falls back to static pricing if limits are exceeded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiSettingsSection;