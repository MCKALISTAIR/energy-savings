
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
  enableCustomPricing: false,
  customEnergyPrices: {
    electricity: 0.30, // UK average £/kWh
    petrol: 1.45, // UK average £/litre
    gas: 0.06, // UK average £/kWh
    oil: 0.09, // UK average £/kWh
    lpg: 0.08, // UK average £/kWh
  },
  priceChangeMode: 'apply-now',
});
