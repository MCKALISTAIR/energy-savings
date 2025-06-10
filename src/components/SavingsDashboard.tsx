
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
}

const SavingsDashboard: React.FC<SavingsDashboardProps> = ({ data }) => {
  const [config, setConfig] = useState<DashboardConfig>({
    impactTimeframe: 20,
    solarROIPeriod: 20,
    batteryROIPeriod: 20,
    evROIPeriod: 10,
    showSummaryCards: true,
    showSavingsChart: true,
    showInvestmentChart: true,
    showProjectionChart: true,
    showTechnologyComparison: true,
    showEnvironmentalImpact: true,
  });

  const totalMonthlySavings = data.solar.monthlySavings + data.battery.monthlySavings + data.ev.totalMonthlySavings + data.heatPump.monthlySavings;
  const totalSystemCost = data.solar.systemCost + data.battery.systemCost + data.ev.vehicleCost + data.heatPump.systemCost;
  const totalAnnualSavings = totalMonthlySavings * 12;

  return (
    <div className="space-y-6">
      {/* Header with Settings */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Savings Dashboard</h2>
          <p className="text-muted-foreground">Overview of your renewable energy investments</p>
        </div>
        <DashboardSettings config={config} onConfigChange={setConfig} />
      </div>

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
