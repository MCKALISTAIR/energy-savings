
import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mb-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">£2,500+</div>
          <div className="text-lg text-muted-foreground">Average Annual Savings</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">8-12</div>
          <div className="text-lg text-muted-foreground">Years Payback Period</div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-emerald-600 mb-2">3.5 tonnes</div>
          <div className="text-lg text-muted-foreground">CO₂ Saved Annually</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
