
import { DashboardConfig } from './types';

export const getDefaultConfig = (): DashboardConfig => ({
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
  environmentalConfig: {
    showBreakdown: true,
    showTreesEquivalent: true,
    showCarsEquivalent: true,
  },
});
