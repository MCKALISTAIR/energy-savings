
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProjectionChartProps {
  totalAnnualSavings: number;
  totalSystemCost: number;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ totalAnnualSavings, totalSystemCost }) => {
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
  );
};

export default ProjectionChart;
