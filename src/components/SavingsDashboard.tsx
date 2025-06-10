
import React from 'react';
import { SavingsData } from '@/pages/Index';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SavingsBreakdownChart from '@/components/dashboard/SavingsBreakdownChart';
import InvestmentChart from '@/components/dashboard/InvestmentChart';
import ProjectionChart from '@/components/dashboard/ProjectionChart';
import TechnologyComparison from '@/components/dashboard/TechnologyComparison';
import EnvironmentalImpact from '@/components/dashboard/EnvironmentalImpact';

interface SavingsDashboardProps {
  data: SavingsData;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ data }) => {
  const totalMonthlySavings = data.solar.monthlySavings + data.battery.monthlySavings + data.ev.totalMonthlySavings;
  const totalSystemCost = data.solar.systemCost + data.battery.systemCost + data.ev.vehicleCost;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards 
        totalMonthlySavings={totalMonthlySavings}
        totalAnnualSavings={totalAnnualSavings}
        totalSystemCost={totalSystemCost}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SavingsBreakdownChart data={data} />
        <InvestmentChart data={data} />
      </div>

      {/* Projected Savings Over Time */}
      <ProjectionChart 
        totalAnnualSavings={totalAnnualSavings}
        totalSystemCost={totalSystemCost}
      />

      {/* Technology Comparison */}
      <TechnologyComparison data={data} />

      {/* Environmental Impact Summary */}
      <EnvironmentalImpact data={data} />
    </div>
  );
};

export default SavingsDashboard;
