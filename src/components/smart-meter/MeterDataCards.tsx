import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, Clock, TrendingUp } from 'lucide-react';

interface MeterData {
  currentUsage: number;
  dailyUsage: number;
  dailyCost: number;
  tariffRate: number;
}

interface MeterDataCardsProps {
  meterData: MeterData;
}

const MeterDataCards: React.FC<MeterDataCardsProps> = ({ meterData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            Current Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{meterData.currentUsage.toFixed(2)} kW</div>
          <p className="text-xs text-muted-foreground">Right now</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            Daily Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{meterData.dailyUsage.toFixed(1)} kWh</div>
          <p className="text-xs text-muted-foreground">Today so far</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Daily Cost
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">£{meterData.dailyCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Today so far</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            Tariff Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(meterData.tariffRate * 100).toFixed(1)}p</div>
          <p className="text-xs text-muted-foreground">Per kWh</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeterDataCards;