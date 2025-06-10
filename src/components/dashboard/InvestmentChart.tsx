
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InvestmentChartProps {
  data: {
    solar: { systemCost: number };
    battery: { systemCost: number };
    ev: { vehicleCost: number };
  };
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Solar System', cost: data.solar.systemCost, color: '#f59e0b' },
    { name: 'Battery System', cost: data.battery.systemCost, color: '#3b82f6' },
    { name: 'Electric Vehicle', cost: data.ev.vehicleCost, color: '#10b981' },
  ];

  const formatCurrency = (value: number) => `£${value.toLocaleString()}`;

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle>Initial Investment</CardTitle>
        <CardDescription>Upfront costs by technology</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvestmentChart;
