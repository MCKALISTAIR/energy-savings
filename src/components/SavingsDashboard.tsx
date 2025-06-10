import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, PoundSterling, Calendar, Leaf, Zap, Battery, Car } from 'lucide-react';
import { SavingsData } from '@/pages/Index';

interface SavingsDashboardProps {
  data: SavingsData;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ data }) => {
  const totalMonthlySavings = data.solar.monthlySavings + data.battery.monthlySavings + data.ev.totalMonthlySavings;
  const totalSystemCost = data.solar.systemCost + data.battery.systemCost + data.ev.vehicleCost;
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Data for charts
  const monthlySavingsData = [
    { name: 'Solar', value: data.solar.monthlySavings, color: '#f59e0b' },
    { name: 'Battery', value: data.battery.monthlySavings, color: '#3b82f6' },
    { name: 'Electric Vehicle', value: data.ev.totalMonthlySavings, color: '#10b981' },
  ];

  const investmentData = [
    { name: 'Solar System', cost: data.solar.systemCost, color: '#f59e0b' },
    { name: 'Battery System', cost: data.battery.systemCost, color: '#3b82f6' },
    { name: 'Electric Vehicle', cost: data.ev.vehicleCost, color: '#10b981' },
  ];

  const projectedSavingsData = Array.from({ length: 21 }, (_, year) => {
    const cumulativeSavings = totalAnnualSavings * year - totalSystemCost;
    return {
      year,
      savings: Math.max(0, cumulativeSavings),
      breakeven: year === 0 ? -totalSystemCost : (year * totalAnnualSavings - totalSystemCost)
    };
  });

  const formatCurrency = (value: number) => `£${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <PoundSterling className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  £{totalMonthlySavings.toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Savings</p>
                <p className="text-2xl font-bold text-blue-600">
                  £{(totalAnnualSavings).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold text-orange-600">
                  {(totalSystemCost / totalAnnualSavings).toFixed(1)}y
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">20-Year Impact</p>
                <p className="text-2xl font-bold text-green-600">
                  £{((totalAnnualSavings * 20) - totalSystemCost).toFixed(0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Savings Breakdown */}
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle>Monthly Savings Breakdown</CardTitle>
            <CardDescription>Savings by renewable technology</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={monthlySavingsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: £${value.toFixed(0)}`}
                >
                  {monthlySavingsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `£${Number(value).toFixed(0)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investment Breakdown */}
        <Card className="hover-scale">
          <CardHeader>
            <CardTitle>Initial Investment</CardTitle>
            <CardDescription>Upfront costs by technology</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="cost" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projected Savings Over Time */}
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle>20-Year Financial Projection</CardTitle>
          <CardDescription>Cumulative savings and break-even analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectedSavingsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="breakeven" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Net Position"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="savings" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Cumulative Savings"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Technology Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-scale border-l-4 border-l-yellow-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-yellow-500" />
              Solar Power
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monthly Savings</span>
              <span className="font-semibold">£{data.solar.monthlySavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payback Period</span>
              <span className="font-semibold">{data.solar.paybackPeriod.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">20-Year ROI</span>
              <span className="font-semibold text-green-600">
                {((data.solar.twentyYearSavings / data.solar.systemCost) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Battery className="w-5 h-5 text-blue-500" />
              Battery Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monthly Savings</span>
              <span className="font-semibold">£{data.battery.monthlySavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payback Period</span>
              <span className="font-semibold">{data.battery.paybackPeriod.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">20-Year ROI</span>
              <span className="font-semibold text-green-600">
                {((data.battery.twentyYearSavings / data.battery.systemCost) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="w-5 h-5 text-green-500" />
              Electric Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Monthly Savings</span>
              <span className="font-semibold">£{data.ev.totalMonthlySavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Payback Period</span>
              <span className="font-semibold">{data.ev.paybackPeriod.toFixed(1)} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">10-Year ROI</span>
              <span className="font-semibold text-green-600">
                {((data.ev.tenYearSavings / (data.ev.vehicleCost - 28000)) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact Summary */}
      <Card className="hover-scale bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" />
            Environmental Impact Summary
          </CardTitle>
          <CardDescription>Your contribution to a sustainable future</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {((data.solar.monthlySavings * 12 * 20 / 120) + 
                  (data.ev.fuelSavings * 20 / 2000)).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Tonnes of CO₂ prevented over 20 years</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {(data.solar.monthlySavings * 12 / 120 * 2500).toFixed(0)}
              </div>
              <p className="text-sm text-muted-foreground">Trees equivalent planted annually</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {((data.ev.fuelSavings / 1.45) * 2.3 / 1000).toFixed(1)}
              </div>
              <p className="text-sm text-muted-foreground">Cars removed from road equivalent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SavingsDashboard;
