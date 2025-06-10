
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';

interface InvestmentChartProps {
  data: {
    solar: { systemCost: number };
    battery: { systemCost: number };
    ev: { vehicleCost: number };
    heatPump: { systemCost: number };
  };
}

const InvestmentChart: React.FC<InvestmentChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Solar System', cost: data.solar.systemCost, color: '#f59e0b' },
    { name: 'Battery System', cost: data.battery.systemCost, color: '#3b82f6' },
    { name: 'Electric Vehicle', cost: data.ev.vehicleCost, color: '#10b981' },
    { name: 'Heat Pump', cost: data.heatPump.systemCost, color: '#8b5cf6' },
  ];

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
            <YAxis tickFormatter={(value) => formatCurrency(value / 1000) + 'k'} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvestmentChart;
