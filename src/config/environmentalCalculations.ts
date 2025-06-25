
/**
 * Environmental Calculations Configuration
 * 
 * This file centralizes all environmental impact calculation factors
 * for renewable energy systems. Values are based on industry research
 * and can be easily updated as new data becomes available.
 */

export interface EnvironmentalFactors {
  solar: {
    // CO₂ prevented per kWh generated (kg CO₂/kWh)
    co2PreventedPerKwh: number;
    // Trees equivalent per annual kWh generation
    treesEquivalentPerAnnualKwh: number;
  };
  battery: {
    // CO₂ impact factor for battery storage efficiency
    efficiencyMultiplier: number;
    // Additional CO₂ savings from grid optimization (kg CO₂/kWh stored)
    gridOptimizationFactor: number;
  };
  ev: {
    // CO₂ prevented per mile driven vs petrol car (kg CO₂/mile)
    co2PreventedPerMile: number;
    // Conversion factor for car equivalent removal calculation
    carRemovalFactor: number;
  };
  heatPump: {
    // CO₂ prevented per kWh of heating vs gas boiler (kg CO₂/kWh)
    co2PreventedPerKwh: number;
    // Efficiency multiplier based on heat pump COP
    efficiencyMultiplier: number;
  };
  general: {
    // Conversion factors
    kgToTonnes: number;
    // Trees planted equivalent per tonne of CO₂
    treesPerTonneCo2: number;
    // Default calculation timeframes
    defaultTimeframe: number;
  };
}

/**
 * Default environmental calculation factors
 * Sources: UK Government carbon factors, industry averages
 */
export const DEFAULT_ENVIRONMENTAL_FACTORS: EnvironmentalFactors = {
  solar: {
    // Average UK grid carbon intensity: 0.2 kg CO₂/kWh
    co2PreventedPerKwh: 0.2,
    // One tree absorbs ~22kg CO₂/year, solar panel generates ~1000kWh/year per kW
    treesEquivalentPerAnnualKwh: 0.009, // 22kg / (1000kWh * 0.2kg) = 0.11 trees per kW capacity
  },
  battery: {
    // Battery storage increases solar efficiency by ~15%
    efficiencyMultiplier: 1.15,
    // Grid optimization savings
    gridOptimizationFactor: 0.05,
  },
  ev: {
    // Average petrol car: 0.18 kg CO₂/mile vs EV: 0.04 kg CO₂/mile (UK grid)
    co2PreventedPerMile: 0.14,
    // Cars removed equivalent calculation factor
    carRemovalFactor: 0.0001, // Conservative estimate
  },
  heatPump: {
    // Gas boiler: 0.18 kg CO₂/kWh vs heat pump: 0.06 kg CO₂/kWh (with COP 3)
    co2PreventedPerKwh: 0.12,
    // Heat pump efficiency multiplier
    efficiencyMultiplier: 3.0,
  },
  general: {
    kgToTonnes: 1000,
    treesPerTonneCo2: 45, // One tree absorbs ~22kg CO₂/year
    defaultTimeframe: 20,
  },
};

/**
 * Environmental calculation utilities
 */
export class EnvironmentalCalculator {
  constructor(private factors: EnvironmentalFactors = DEFAULT_ENVIRONMENTAL_FACTORS) {}

  /**
   * Calculate CO₂ prevented by solar system over time period
   */
  calculateSolarCO2Prevented(
    monthlySavings: number,
    timeframeYears: number
  ): number {
    // Estimate kWh generated from monthly savings (assuming £0.30/kWh)
    const monthlyKwh = monthlySavings / 0.30;
    const annualKwh = monthlyKwh * 12;
    const totalKwh = annualKwh * timeframeYears;
    
    const co2PreventedKg = totalKwh * this.factors.solar.co2PreventedPerKwh;
    return co2PreventedKg / this.factors.general.kgToTonnes;
  }

  /**
   * Calculate CO₂ prevented by EV over time period
   */
  calculateEVCO2Prevented(
    annualMileage: number,
    timeframeYears: number
  ): number {
    const totalMiles = annualMileage * timeframeYears;
    const co2PreventedKg = totalMiles * this.factors.ev.co2PreventedPerMile;
    return co2PreventedKg / this.factors.general.kgToTonnes;
  }

  /**
   * Calculate CO₂ prevented by heat pump over time period
   */
  calculateHeatPumpCO2Prevented(
    monthlySavings: number,
    timeframeYears: number
  ): number {
    // Estimate kWh heating from monthly savings
    const monthlyKwh = monthlySavings / 0.06; // Assuming gas cost savings
    const annualKwh = monthlyKwh * 12;
    const totalKwh = annualKwh * timeframeYears;
    
    const co2PreventedKg = totalKwh * this.factors.heatPump.co2PreventedPerKwh;
    return co2PreventedKg / this.factors.general.kgToTonnes;
  }

  /**
   * Calculate trees equivalent for CO₂ prevented
   */
  calculateTreesEquivalent(co2PreventedTonnes: number): number {
    return co2PreventedTonnes * this.factors.general.treesPerTonneCo2;
  }

  /**
   * Calculate cars removed equivalent for EV impact
   */
  calculateCarsRemovedEquivalent(annualMileage: number): number {
    return annualMileage * this.factors.ev.carRemovalFactor;
  }

  /**
   * Calculate total environmental impact across all systems
   */
  calculateTotalImpact(data: {
    solar: { monthlySavings: number };
    ev: { annualMileage?: number };
    heatPump: { monthlySavings: number };
  }, timeframeYears: number) {
    const solarCO2 = this.calculateSolarCO2Prevented(data.solar.monthlySavings, timeframeYears);
    const evCO2 = data.ev.annualMileage ? this.calculateEVCO2Prevented(data.ev.annualMileage, timeframeYears) : 0;
    const heatPumpCO2 = this.calculateHeatPumpCO2Prevented(data.heatPump.monthlySavings, timeframeYears);
    
    const totalCO2Prevented = solarCO2 + evCO2 + heatPumpCO2;
    const treesEquivalent = this.calculateTreesEquivalent(totalCO2Prevented);
    const carsRemovedEquivalent = data.ev.annualMileage ? this.calculateCarsRemovedEquivalent(data.ev.annualMileage) : 0;

    return {
      totalCO2Prevented,
      treesEquivalent,
      carsRemovedEquivalent,
      breakdown: {
        solar: solarCO2,
        ev: evCO2,
        heatPump: heatPumpCO2,
      },
    };
  }
}

/**
 * Default calculator instance
 */
export const environmentalCalculator = new EnvironmentalCalculator();
