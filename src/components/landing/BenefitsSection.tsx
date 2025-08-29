import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Zap, TrendingUp, Shield } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const benefits = [
  {
    icon: Leaf,
    title: 'Environmental Impact',
    description: 'Reduce your carbon footprint with clean, renewable energy solutions'
  },
  {
    icon: Zap,
    title: 'Energy Independence',
    description: 'Generate your own power and reduce reliance on the grid'
  },
  {
    icon: TrendingUp,
    title: 'Long-term Savings',
    description: 'Save thousands over the lifetime of your renewable energy systems'
  },
  {
    icon: Shield,
    title: 'Future-proof Investment',
    description: 'Protect against rising energy costs with stable renewable power'
  }
];

const BenefitsSection: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <section className={`${isMobile ? 'py-8' : 'py-16'} bg-muted/30`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
            Why Choose Renewable Energy?
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-muted-foreground max-w-2xl mx-auto`}>
            Discover the lasting benefits of investing in sustainable energy solutions
          </p>
        </div>
        
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                <div className={`inline-flex items-center justify-center rounded-lg bg-primary/10 ${isMobile ? 'p-2 mb-3' : 'p-3 mb-4'}`}>
                  <benefit.icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-primary`} />
                </div>
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-2`}>
                  {benefit.title}
                </h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;