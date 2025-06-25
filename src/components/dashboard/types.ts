
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
}

export interface DashboardSettingsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}
