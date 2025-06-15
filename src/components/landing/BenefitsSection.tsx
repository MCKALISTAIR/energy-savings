
import React from 'react';
import { PoundSterling, TrendingUp, Leaf } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <PoundSterling className="w-6 h-6 text-green-600" />,
      title: "Calculate Real Savings",
      description: "Get accurate estimates of your potential monthly and yearly savings"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Track Your Progress",
      description: "Monitor your actual savings and environmental impact over time"
    },
    {
      icon: <Leaf className="w-6 h-6 text-emerald-600" />,
      title: "Environmental Impact",
      description: "See how your renewable energy choices help reduce carbon emissions"
    }
  ];

  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Planning Tool?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're considering renewable energy investments or already have systems installed, 
            our tool helps you maximize your savings and track your progress.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-accent/20 p-3 rounded-full">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
