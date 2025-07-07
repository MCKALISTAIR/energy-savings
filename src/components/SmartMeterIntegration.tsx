
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Clock, TrendingUp, AlertCircle, CheckCircle2, Wifi, WifiOff, Loader2, ArrowLeft } from 'lucide-react';
import { useOctopusEnergy } from '@/hooks/useOctopusEnergy';
import { useToast } from '@/hooks/use-toast';

const SmartMeterIntegration = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionForm, setConnectionForm] = useState({
    apiKey: ''
  });
  const [meterData, setMeterData] = useState({
    currentUsage: 0,
    dailyUsage: 0,
    dailyCost: 0,
    tariffRate: 0
  });

  const { 
    loading, 
    account, 
    consumptionData,
    getAccount, 
    getConsumption, 
    getCurrentTariff,
    calculateCurrentUsage,
    calculateDailyUsage
  } = useOctopusEnergy();

  const { toast } = useToast();

  const handleConnect = async () => {
    if (!connectionForm.apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide your Octopus Energy API key",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get account information with API key
      const accountData = await getAccount(connectionForm.apiKey);
      if (!accountData) {
        throw new Error('Failed to retrieve account information');
      }

      // Get the first property's meter details
      const property = accountData.properties?.[0];
      if (!property?.electricity_meter_points?.[0]) {
        throw new Error('No electricity meter found on account');
      }

      const meterPoint = property.electricity_meter_points[0];
      const mpan = meterPoint.mpan;
      const meterSerial = meterPoint.meters?.[0]?.serial_number;

      if (!meterSerial) {
        throw new Error('No meter serial number found');
      }

      // Get consumption data
      const consumption = await getConsumption(mpan, meterSerial, connectionForm.apiKey);
      if (!consumption) {
        throw new Error('Failed to retrieve consumption data');
      }

      // Get tariff information
      const tariff = await getCurrentTariff(mpan, connectionForm.apiKey);
      
      setIsConnected(true);
      
      // Update meter data with real values
      const currentUsage = calculateCurrentUsage();
      const dailyUsage = calculateDailyUsage();
      
      setMeterData({
        currentUsage,
        dailyUsage,
        dailyCost: dailyUsage * 0.28, // Default rate, should be from tariff
        tariffRate: 0.28 // Should be extracted from tariff data
      });

      toast({
        title: "Connected Successfully",
        description: "Your Octopus Energy smart meter is now connected!",
      });

    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to your smart meter",
        variant: "destructive"
      });
    }
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

  // Auto-update data every 30 minutes when connected
  useEffect(() => {
    if (!isConnected || !connectionForm.apiKey || !account) return;

    const interval = setInterval(async () => {
      try {
        const property = account.properties?.[0];
        const meterPoint = property?.electricity_meter_points?.[0];
        const mpan = meterPoint?.mpan;
        const meterSerial = meterPoint?.meters?.[0]?.serial_number;
        
        if (mpan && meterSerial) {
          await getConsumption(mpan, meterSerial, connectionForm.apiKey);
          
          const currentUsage = calculateCurrentUsage();
          const dailyUsage = calculateDailyUsage();
          
          setMeterData(prev => ({
            ...prev,
            currentUsage,
            dailyUsage,
            dailyCost: dailyUsage * prev.tariffRate
          }));
        }
      } catch (error) {
        console.error('Failed to update consumption data:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [isConnected, connectionForm.apiKey, account]);

  const energySuppliers = [
    { id: 'octopus', name: 'Octopus Energy', available: true, color: 'bg-pink-500' },
    { id: 'british-gas', name: 'British Gas', available: false, color: 'bg-blue-500' },
    { id: 'eon', name: 'E.ON', available: false, color: 'bg-green-500' },
    { id: 'edf', name: 'EDF Energy', available: false, color: 'bg-orange-500' },
    { id: 'scottishpower', name: 'ScottishPower', available: false, color: 'bg-purple-500' },
    { id: 'sse', name: 'SSE', available: false, color: 'bg-red-500' },
    { id: 'bulb', name: 'Bulb', available: false, color: 'bg-yellow-500' },
    { id: 'shell', name: 'Shell Energy', available: false, color: 'bg-gray-500' },
  ];

  if (!selectedSupplier) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Smart Meter Integration</h2>
          <p className="text-gray-600">
            Select your energy supplier to connect your smart meter and get real-time energy data
          </p>
        </div>

        {/* Supplier Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Energy Supplier</CardTitle>
            <CardDescription>
              Select your current energy supplier to set up smart meter integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energySuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    supplier.available 
                      ? 'border-gray-200 hover:border-primary hover:shadow-md' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => supplier.available && setSelectedSupplier(supplier.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${supplier.color}`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{supplier.name}</h3>
                      {!supplier.available && (
                        <Badge variant="secondary" className="mt-1">Coming Soon</Badge>
                      )}
                    </div>
                    {supplier.available && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>What you'll get with smart meter integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Real-time insights:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Live energy usage monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Accurate cost calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Historical usage patterns
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Personalized recommendations:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Optimized solar panel sizing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Battery storage calculations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ROI based on actual usage
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedSupplier(null)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Suppliers
        </Button>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Octopus Energy Integration</h2>
        <p className="text-gray-600">
          Connect your Octopus Energy smart meter to get real-time energy usage data and personalized insights
        </p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                Connected to Octopus Energy
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
              ? "Your Octopus Energy smart meter is connected and providing real-time data"
              : "Connect your Octopus Energy smart meter to unlock personalized energy insights"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To connect your smart meter, you'll need your Octopus Energy API key. 
                  This can be found in your Octopus Energy account dashboard under Developer settings.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">Octopus Energy API Key</Label>
                  <Input 
                    id="api-key"
                    type="password"
                    placeholder="sk_live_..."
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can find your API key in your Octopus Energy account dashboard
                  </p>
                </div>
              </div>

              <Button onClick={handleConnect} className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Connect Octopus Energy Smart Meter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Octopus Energy smart meter connected successfully! Data is being updated every 30 minutes.
                </AlertDescription>
              </Alert>
              
              {account && (
                <div className="text-sm text-muted-foreground">
                  <p>Account: {account.number}</p>
                  <p>API Key: {connectionForm.apiKey.substring(0, 8)}...</p>
                </div>
              )}
              
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

          <Separator />

          {/* Benefits Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Insights</CardTitle>
              <CardDescription>
                With your Octopus Energy smart meter connected, we can provide more accurate calculations and recommendations
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

      {/* Octopus Energy Specific Info */}
      <Card>
        <CardHeader>
          <CardTitle>Octopus Energy Integration</CardTitle>
          <CardDescription>
            Direct integration with Octopus Energy's API for real-time smart meter data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Features:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• 30-minute consumption data</li>
                  <li>• Current tariff information</li>
                  <li>• Historical usage patterns</li>
                  <li>• Automatic data updates</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Requirements:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Active Octopus Energy account</li>
                  <li>• Smart meter (SMETS1 or SMETS2)</li>
                  <li>• API key from account dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartMeterIntegration;
