import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OctopusInfoSection: React.FC = () => {
  return (
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
  );
};

export default OctopusInfoSection;