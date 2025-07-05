
export interface EnvironmentalConfig {
  // Custom calculation factors (optional overrides)
  customFactors?: {
    solarCO2Factor?: number;
    evCO2Factor?: number;
    heatPumpCO2Factor?: number;
    treesPerTonneCO2?: number;
  };
  // Display preferences
  showBreakdown?: boolean;
  showTreesEquivalent?: boolean;
  showCarsEquivalent?: boolean;
}

export interface EnergyPricesConfig {
  electricity: number; // £/kWh
  petrol: number; // £/litre
  gas: number; // £/kWh
  gasStandingCharge: number; // £/day
  oil: number; // £/kWh
  lpg: number; // £/kWh
}

export interface DashboardConfig {
  impactTimeframe: number;
  solarROIPeriod: number;
  batteryROIPeriod: number;
  evROIPeriod: number;
  showSummaryCards: boolean;
  showSavingsChart: boolean;
  showInvestmentChart: boolean;
  showProjectionChart: boolean;
  showTechnologyComparison: boolean;
  showEnvironmentalImpact: boolean;
  // New environmental configuration
  environmentalConfig: EnvironmentalConfig;
  // Energy pricing configuration
  enableCustomPricing: boolean;
  customEnergyPrices: EnergyPricesConfig;
  priceChangeMode: 'apply-now' | 'historical-adjustment';
  // Annual price rise configuration
  enableAnnualPriceRise: boolean;
  annualPriceRisePercentage: number; // Can be negative for price drops
  priceRiseDate: string; // Format: "MM-DD" e.g., "01-01" for January 1st
}

export interface DashboardSettingsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}
