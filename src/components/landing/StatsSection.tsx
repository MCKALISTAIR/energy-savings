import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const stats = [
  {
    value: '£2,500',
    label: 'Average Annual Savings'
  },
  {
    value: '15+',
    label: 'Years System Lifespan'
  },
  {
    value: '3.5t',
    label: 'CO₂ Saved Annually'
  },
  {
    value: '95%',
    label: 'Customer Satisfaction'
  }
];

const StatsSection: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section className={`${isMobile ? 'py-8' : 'py-16'} bg-primary/5`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
            Real Impact, Real Savings
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-muted-foreground`}>
            See what renewable energy can achieve for you
          </p>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-6' : 'md:grid-cols-4 gap-8'} text-center`}>
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-primary`}>
                {stat.value}
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;