import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, Database, Clock } from 'lucide-react';
import { SavingsData } from '@/pages/Index';
import EVSavingsStats from './EVSavingsStats';
import EnvironmentalImpactInfo from './EnvironmentalImpactInfo';
import { Badge } from '@/components/ui/badge';

interface EVResultsProps {
  results: SavingsData['ev'];
  milesPerYear: string;
  currentMPG: string;
  hasCurrentVehicle: boolean;
  dataSource?: 'marketcheck' | 'cached' | 'static';
  lastUpdated?: string;
  useRealTimeVehiclePricing: boolean;
  onTogglePricing: () => void;
}

const EVResults: React.FC<EVResultsProps> = ({ 
  results, 
  milesPerYear, 
  currentMPG, 
  hasCurrentVehicle, 
  dataSource = 'static', 
  lastUpdated,
  useRealTimeVehiclePricing,
  onTogglePricing
}) => {
  const getDataSourceInfo = () => {
    if (!useRealTimeVehiclePricing) {
      return {
        icon: <Database className="w-4 h-4" />,
        label: 'Static pricing',
        description: 'Estimated pricing based on market averages',
        variant: 'outline' as const
      };
    }

    switch (dataSource) {
      case 'marketcheck':
        return {
          icon: <Database className="w-4 h-4" />,
          label: 'Market pricing',
          description: 'Live pricing from MarketCheck API (US market, converted to GBP)',
          variant: 'default' as const
        };
      case 'cached':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'Market pricing',
          description: 'Recent MarketCheck data (updated within 7 days)',
          variant: 'secondary' as const
        };
      default:
        return {
          icon: <Database className="w-4 h-4" />,
          label: 'Market pricing',
          description: 'Fetching real-time market data...',
          variant: 'default' as const
        };
    }
  };

  const dataSourceInfo = getDataSourceInfo();
  const formattedDate = lastUpdated 
    ? new Date(lastUpdated).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    : null;

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-green-500" />
          Your EV Savings Potential
        </CardTitle>
        <CardDescription>
          {hasCurrentVehicle 
            ? 'Financial benefits of switching to electric' 
            : 'EV savings vs equivalent new petrol vehicle'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <EVSavingsStats results={results} />
        
        {/* Data Source Attribution */}
        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <Badge 
              variant={dataSourceInfo.variant} 
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onTogglePricing}
              title={useRealTimeVehiclePricing ? "Click to use static pricing" : "Click to use market pricing"}
            >
              {dataSourceInfo.icon}
              {dataSourceInfo.label}
            </Badge>
            <span className="text-xs">{dataSourceInfo.description}</span>
          </div>
          {formattedDate && (
            <span className="text-xs">Updated: {formattedDate}</span>
          )}
        </div>
        
        <EnvironmentalImpactInfo 
          milesPerYear={milesPerYear} 
          currentMPG={currentMPG} 
          hasCurrentVehicle={hasCurrentVehicle} 
        />
      </CardContent>
    </Card>
  );
};

export default EVResults;