
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Battery, Car, Thermometer } from 'lucide-react';

const FeaturesGrid: React.FC = () => {
  const features = [
    {
      icon: <Calculator className="w-8 h-8 text-yellow-500" />,
      title: "Solar Potential Calculator",
      description: "Discover how much you could save with solar panels based on your home size, location, and energy usage."
    },
    {
      icon: <Battery className="w-8 h-8 text-blue-500" />,
      title: "Battery Storage Analysis",
      description: "Calculate the benefits of home battery storage and how it can maximize your solar investment."
    },
    {
      icon: <Car className="w-8 h-8 text-green-500" />,
      title: "Electric Vehicle Savings",
      description: "Compare EV running costs vs traditional vehicles and find your potential annual savings."
    },
    {
      icon: <Thermometer className="w-8 h-8 text-red-500" />,
      title: "Heat Pump Analysis",
      description: "Explore heat pump efficiency and cost savings compared to traditional heating systems."
    }
  ];

  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeaturesGrid;
