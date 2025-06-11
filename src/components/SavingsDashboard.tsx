
import React, { useState } from 'react';
import { SavingsData } from '@/pages/Index';
import SummaryCards from '@/components/dashboard/SummaryCards';
import SavingsBreakdownChart from '@/components/dashboard/SavingsBreakdownChart';
import InvestmentChart from '@/components/dashboard/InvestmentChart';
import ProjectionChart from '@/components/dashboard/ProjectionChart';
import TechnologyComparison from '@/components/dashboard/TechnologyComparison';
import EnvironmentalImpact from '@/components/dashboard/EnvironmentalImpact';
import DashboardSettings from '@/components/dashboard/DashboardSettings';
import { DashboardConfig } from '@/components/dashboard/types';

interface SavingsDashboardProps {
  data: SavingsData;
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ data, config, onConfigChange }) => {
  const totalMonthlySavings = data.solar.monthlySavings + data.battery.monthlySavings + data.ev.totalMonthlySavings + data.heatPump.monthlySavings;
  const totalSystemCost = data.solar.systemCost + data.battery.systemCost + data.ev.vehicleCost + data.heatPump.systemCost;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {config.showSummaryCards && (
        <SummaryCards 
          totalMonthlySavings={totalMonthlySavings}
          totalAnnualSavings={totalAnnualSavings}
          totalSystemCost={totalSystemCost}
          impactTimeframe={config.impactTimeframe}
        />
      )}

      {/* Charts Row */}
      {(config.showSavingsChart || config.showInvestmentChart) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {config.showSavingsChart && <SavingsBreakdownChart data={data} />}
          {config.showInvestmentChart && <InvestmentChart data={data} />}
        </div>
      )}

      {/* Projected Savings Over Time */}
      {config.showProjectionChart && (
        <ProjectionChart 
          totalAnnualSavings={totalAnnualSavings}
          totalSystemCost={totalSystemCost}
          timeframe={config.impactTimeframe}
        />
      )}

      {/* Technology Comparison */}
      {config.showTechnologyComparison && (
        <TechnologyComparison 
          data={data} 
          config={config}
        />
      )}

      {/* Environmental Impact Summary */}
      {config.showEnvironmentalImpact && (
        <EnvironmentalImpact 
          data={data} 
          timeframe={config.impactTimeframe}
        />
      )}
    </div>
  );
};

export default SavingsDashboard;
