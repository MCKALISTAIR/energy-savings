
import React from 'react';
import { HelpCircle, Lightbulb, Calculator, Battery, Car, Thermometer } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const HelpSection: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Getting Started
            </h4>
            <p className="text-sm text-muted-foreground">
              Welcome to the Renewable Energy Savings Calculator! Here's how to get the most out of it:
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="space-y-2">
              <h5 className="text-sm font-medium">1. Add Your House</h5>
              <p className="text-xs text-muted-foreground">
                Start by adding your house details to get personalized calculations based on your location and property.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium">2. Configure Systems</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Calculator className="w-3 h-3 text-orange-500" />
                  <span>Solar Panels</span>
                </div>
                <div className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-blue-500" />
                  <span>Battery Storage</span>
                </div>
                <div className="flex items-center gap-1">
                  <Car className="w-3 h-3 text-green-500" />
                  <span>Electric Vehicle</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-red-500" />
                  <span>Heat Pump</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium">3. View Your Savings</h5>
              <p className="text-xs text-muted-foreground">
                Check the Dashboard tab to see comprehensive savings analysis, payback periods, and environmental impact.
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Tips for Accurate Calculations</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use your actual monthly energy bills for best results</li>
              <li>• Consider your roof size and orientation for solar</li>
              <li>• Factor in your daily driving habits for EV savings</li>
              <li>• Account for your current heating system type</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Pro Tip:</strong> Create an account to save your calculations and access them from any device!
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HelpSection;
