
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
}

export interface DashboardSettingsProps {
  config: DashboardConfig;
  onConfigChange: (config: DashboardConfig) => void;
}
