
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/currency';

interface SavingsBreakdownChartProps {
  data: {
    solar: { monthlySavings: number };
    battery: { monthlySavings: number };
    ev: { totalMonthlySavings: number };
    heatPump: { monthlySavings: number };
  };
}

const SavingsBreakdownChart: React.FC<SavingsBreakdownChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Solar', value: data.solar.monthlySavings, color: '#f59e0b' },
    { name: 'Battery', value: data.battery.monthlySavings, color: '#3b82f6' },
    { name: 'Electric Vehicle', value: data.ev.totalMonthlySavings, color: '#10b981' },
    { name: 'Heat Pump', value: data.heatPump.monthlySavings, color: '#8b5cf6' },
  ];

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle>Monthly Savings Breakdown</CardTitle>
        <CardDescription>Savings by renewable technology</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SavingsBreakdownChart;
