
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
    gasStandingCharge: 0.30, // UK average £/day
    oil: 0.09, // UK average £/kWh
    lpg: 0.08, // UK average £/kWh
    publicCharging: 0.79, // UK average for public rapid charging £/kWh
  },
  priceChangeMode: 'apply-now',
  enableAnnualPriceRise: false,
  annualPriceRisePercentage: 3.0, // Default 3% annual increase
  priceRiseDate: '01-01', // January 1st (DD-MM format)
  highPriceWarningThreshold: 2.0, // £/kWh - warn for electricity and gas above this
  useRealTimeVehiclePricing: false, // Default to static pricing
});
