
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Activity, Zap, Clock, TrendingUp, AlertCircle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';

const SmartMeterIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [meterData, setMeterData] = useState({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });
  const [connectionForm, setConnectionForm] = useState({
    meterType: '',
    mpan: '',
    apiKey: ''
  });

  const handleConnect = () => {
    // Simulate connection and data retrieval
    setIsConnected(true);
    setMeterData({
      currentUsage: 2.4,
      dailyUsage: 18.7,
      dailyCost: 5.24,
      tariffRate: 0.28
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMeterData({
      currentUsage: 0,
      dailyUsage: 0,
      dailyCost: 0,
      tariffRate: 0
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Meter Integration</h2>
        <p className="text-gray-600">
          Connect your smart meter to get real-time energy usage data and personalized insights
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                Connected to Smart Meter
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-gray-400" />
                Smart Meter Not Connected
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isConnected 
              ? "Your smart meter is connected and providing real-time data"
              : "Connect your smart meter to unlock personalized energy insights"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To connect your smart meter, you'll need your MPAN number and supplier API credentials. 
                  This information can usually be found on your energy bill or supplier's app.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meter-type">Meter Type</Label>
                  <Input 
                    id="meter-type"
                    placeholder="e.g., SMETS2"
                    value={connectionForm.meterType}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, meterType: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpan">MPAN Number</Label>
                  <Input 
                    id="mpan"
                    placeholder="13-digit MPAN number"
                    value={connectionForm.mpan}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, mpan: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">Supplier API Key</Label>
                <Input 
                  id="api-key"
                  type="password"
                  placeholder="API key from your energy supplier"
                  value={connectionForm.apiKey}
                  onChange={(e) => setConnectionForm(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>

              <Button onClick={handleConnect} className="w-full">
                Connect Smart Meter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Smart meter connected successfully! Data is being updated every 30 minutes.
                </AlertDescription>
              </Alert>
              
              <Button onClick={handleDisconnect} variant="outline">
                Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live Data Display */}
      {isConnected && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Current Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{meterData.currentUsage} kW</div>
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
                <div className="text-2xl font-bold">{meterData.dailyUsage} kWh</div>
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
                <div className="text-2xl font-bold">£{meterData.dailyCost}</div>
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
                <div className="text-2xl font-bold">{meterData.tariffRate}p</div>
                <p className="text-xs text-muted-foreground">Per kWh</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Benefits Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Insights</CardTitle>
              <CardDescription>
                With your smart meter connected, we can provide more accurate calculations and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">What you get:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Real-time energy usage monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Accurate cost calculations based on your tariff
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Personalized solar panel sizing recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Optimized battery storage calculations
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Enhanced features:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Peak usage time analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Seasonal consumption patterns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ROI calculations based on actual usage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Smart home automation suggestions
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Supported Suppliers */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Energy Suppliers</CardTitle>
          <CardDescription>
            We currently support smart meter integration with the following suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">Octopus Energy</div>
              <div className="text-sm text-muted-foreground">Full API support</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">British Gas</div>
              <div className="text-sm text-muted-foreground">Smart meter data</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">E.ON</div>
              <div className="text-sm text-muted-foreground">SMETS2 support</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-semibold">EDF Energy</div>
              <div className="text-sm text-muted-foreground">Coming soon</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartMeterIntegration;
