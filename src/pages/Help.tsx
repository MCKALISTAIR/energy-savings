
import React, { useState } from 'react';
import { ArrowLeft, Calculator, Battery, Car, Thermometer, Lightbulb, Home, BarChart3, Settings, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FeedbackModal from '@/components/FeedbackModal';

const Help: React.FC = () => {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/calculator">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground">Everything you need to know about the Renewable Energy Savings Calculator</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Add Your House</h3>
                  <p className="text-muted-foreground">
                    Start by adding your house details to get personalized calculations. Click "Add Your First House" 
                    and provide your address, property type, and basic energy usage information. This helps us calculate 
                    accurate savings based on your location's solar potential and energy rates.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. Configure Your Systems</h3>
                  <p className="text-muted-foreground">
                    Use the tabs to configure different renewable energy systems. Each system has specific parameters 
                    that affect your potential savings.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. View Your Results</h3>
                  <p className="text-muted-foreground">
                    Check the Dashboard tab to see comprehensive analysis including savings breakdowns, payback periods, 
                    environmental impact, and long-term projections.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Guides */}
          <Card>
            <CardHeader>
              <CardTitle>System Configuration Guides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold">Solar Panels</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Enter your roof size in square meters</li>
                    <li>• Consider roof orientation (south-facing is best)</li>
                    <li>• Account for shading from trees or buildings</li>
                    <li>• Use your monthly electricity bill for usage</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Battery className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">Battery Storage</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Size battery based on daily usage patterns</li>
                    <li>• Consider time-of-use electricity rates</li>
                    <li>• Factor in backup power requirements</li>
                    <li>• Combine with solar for maximum benefit</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold">Electric Vehicle</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Enter your daily/weekly driving distance</li>
                    <li>• Consider your current fuel costs</li>
                    <li>• Factor in charging at home vs. public</li>
                    <li>• Account for vehicle efficiency (kWh/100km)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-red-500" />
                    <h3 className="font-semibold">Heat Pump</h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Compare with your current heating system</li>
                    <li>• Consider your home's insulation quality</li>
                    <li>• Factor in climate and seasonal variations</li>
                    <li>• Include both heating and cooling needs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for Accurate Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Data Collection</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Gather 12 months of energy bills</li>
                    <li>• Note seasonal usage variations</li>
                    <li>• Measure available roof space accurately</li>
                    <li>• Research local energy rates and incentives</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">System Sizing</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Don't oversize systems beyond your needs</li>
                    <li>• Consider future usage changes</li>
                    <li>• Account for system efficiency losses</li>
                    <li>• Factor in local building regulations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Understanding Your Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-2">Savings Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Shows monthly and annual savings across all configured systems. Green indicates positive savings.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Payback Period</h3>
                  <p className="text-sm text-muted-foreground">
                    Time needed to recover your initial investment through energy savings. Shorter periods indicate better ROI.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Environmental Impact</h3>
                  <p className="text-sm text-muted-foreground">
                    CO2 emissions reduced annually and trees equivalent planted. Helps quantify environmental benefits.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">25-Year Projection</h3>
                  <p className="text-sm text-muted-foreground">
                    Long-term savings forecast accounting for inflation, system degradation, and maintenance costs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Benefits */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Create an Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Creating an account unlocks additional features and helps you get the most out of the calculator:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Save multiple house configurations</li>
                <li>• Access your calculations from any device</li>
                <li>• Compare different system combinations</li>
                <li>• Export detailed reports</li>
                <li>• Receive updates on incentives and rebates</li>
              </ul>
              <div className="mt-4">
                <Link to="/auth">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How accurate are the calculations?</h3>
                  <p className="text-sm text-muted-foreground">
                    Our calculations use industry-standard formulas and real-world data. Results are estimates and actual 
                    savings may vary based on specific conditions, installation quality, and usage patterns.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Can I use this for commercial properties?</h3>
                  <p className="text-sm text-muted-foreground">
                    The calculator is designed for residential properties. Commercial installations have different 
                    considerations and should be evaluated by qualified professionals.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Are government incentives included?</h3>
                  <p className="text-sm text-muted-foreground">
                    Basic incentives are factored into cost calculations where available. Check with local authorities 
                    for current rebates and incentives in your area.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">What if I have multiple properties?</h3>
                  <p className="text-sm text-muted-foreground">
                    You can add multiple houses to your account and configure different systems for each property. 
                    Switch between properties using the house selector.
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Feedback Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Have feedback or feature requests?</h3>
                  <p className="text-muted-foreground mb-4">
                    Help us improve the calculator by sharing your thoughts, suggestions, or reporting any issues you've encountered.
                  </p>
                  <Button 
                    onClick={() => setFeedbackModalOpen(true)}
                    className="gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <FeedbackModal 
            open={feedbackModalOpen} 
            onOpenChange={setFeedbackModalOpen}
          />
        </div>

        {/* Back to Calculator */}
        <div className="text-center mt-12">
          <Link to="/calculator">
            <Button size="lg" className="gap-2">
              <Calculator className="w-4 h-4" />
              Back to Calculator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
