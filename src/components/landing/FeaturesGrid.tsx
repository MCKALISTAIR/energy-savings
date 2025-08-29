import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Sun, Battery, Car, Thermometer } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const features = [
  {
    icon: Sun,
    title: 'Solar Panel Calculator',
    description: 'Calculate potential savings from solar panel installations based on your location and usage'
  },
  {
    icon: Battery,
    title: 'Battery Storage Analysis',
    description: 'Determine the optimal battery storage solution for your energy needs'
  },
  {
    icon: Car,
    title: 'Electric Vehicle Planning',
    description: 'Compare EV costs and savings against traditional fuel vehicles'
  },
  {
    icon: Thermometer,
    title: 'Heat Pump Calculator',
    description: 'Analyze heat pump efficiency and savings compared to traditional heating'
  }
];

const FeaturesGrid: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-3">
              Comprehensive Energy Planning
            </h2>
            <p className="text-sm text-muted-foreground">
              All the tools you need in one place
            </p>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {features.map((feature, index) => (
                <CarouselItem key={index} className="basis-4/5">
                  <Card className="h-full">
                    <CardContent className="p-4">
                      <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-2 mb-3">
                        <feature.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Comprehensive Energy Planning Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to make informed decisions about your renewable energy future
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;