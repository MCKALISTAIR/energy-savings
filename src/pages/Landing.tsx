
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Battery, Car, Thermometer, Calculator, TrendingUp, PoundSterling, Leaf, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserActions from '@/components/UserActions';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check for development bypass flag
  const devBypass = localStorage.getItem('devBypass') === 'true';

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Hero Section with integrated header */}
      <div className="container mx-auto px-4 py-16 relative">
        {/* Login/User Actions in top right */}
        <div className="absolute top-6 right-4">
          {user ? (
            <UserActions />
          ) : (
            <Button 
              size="icon"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="bg-white/70 backdrop-blur-sm hover:bg-white/90"
            >
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Discover Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600"> Renewable Energy </span>
            Savings
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Make informed decisions about your sustainable energy future. Calculate potential savings from solar panels, 
            battery storage, electric vehicles, and heat pumps with our comprehensive planning tool.
          </p>
          <div className="flex justify-center">
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/calculator')}
                className="text-lg px-8 py-6"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Go to Calculator
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Calculating Savings
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
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

        {/* Benefits Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-16">
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

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
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

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Plan Your Energy Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of homeowners making informed decisions about renewable energy
          </p>
          {user ? (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/calculator')}
              className="text-lg px-8 py-6"
            >
              Go to Calculator
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
