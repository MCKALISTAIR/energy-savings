
export interface House {
  id: string;
  name: string;
  address: string;
  createdAt: Date;
}

export interface SystemDetails {
  id: string;
  houseId: string;
  name: string;
  type: 'solar' | 'battery' | 'ev';
  installDate: Date;
  isActive: boolean;
  system_cost?: number;
  specifications: {
    [key: string]: any;
  };
}

export interface SolarSystem extends SystemDetails {
  type: 'solar';
  specifications: {
    capacity: number;
    panelCount: number;
    efficiency: number;
    orientation: string;
    tilt: number;
  };
}

export interface BatterySystem extends SystemDetails {
  type: 'battery';
  specifications: {
    capacity: number;
    brand: string;
    model: string;
    efficiency: number;
  };
}

export interface EVSystem extends SystemDetails {
  type: 'ev';
  specifications: {
    make: string;
    model: string;
    batteryCapacity: number;
    efficiency: number;
    annualMileage: number;
  };
}

export type SystemType = SolarSystem | BatterySystem | EVSystem;
