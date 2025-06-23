import React, { createContext, useContext, useState, ReactNode } from 'react';
import { House, SystemType } from '@/types';

interface SystemContextType {
  houses: House[];
  systems: SystemType[];
  currentHouse: House | null;
  addHouse: (house: Omit<House, 'id' | 'createdAt'>) => void;
  updateHouse: (id: string, house: Partial<House>) => void;
  deleteHouse: (id: string) => void;
  setCurrentHouse: (house: House | null) => void;
  addSystem: (system: Omit<SystemType, 'id'>) => void;
  updateSystem: (id: string, system: Partial<SystemType>) => void;
  deleteSystem: (id: string) => void;
  getSystemsByHouse: (houseId: string) => SystemType[];
  getCurrentHouseSystems: () => SystemType[];
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const [systems, setSystems] = useState<SystemType[]>([]);
  const [currentHouse, setCurrentHouse] = useState<House | null>(null);

  const addHouse = (houseData: Omit<House, 'id' | 'createdAt'>) => {
    const newHouse: House = {
      id: Date.now().toString(),
      ...houseData,
      createdAt: new Date(),
    };
    setHouses(prev => [...prev, newHouse]);
    
    // Set as current house if it's the first one added
    if (houses.length === 0) {
      setCurrentHouse(newHouse);
    }
  };

  const updateHouse = (id: string, houseData: Partial<House>) => {
    setHouses(prev => prev.map(house => 
      house.id === id ? { ...house, ...houseData } : house
    ));
    if (currentHouse?.id === id) {
      setCurrentHouse(prev => prev ? { ...prev, ...houseData } : null);
    }
  };

  const deleteHouse = (id: string) => {
    setHouses(prev => prev.filter(house => house.id !== id));
    setSystems(prev => prev.filter(system => system.houseId !== id));
    if (currentHouse?.id === id) {
      const remainingHouses = houses.filter(house => house.id !== id);
      setCurrentHouse(remainingHouses.length > 0 ? remainingHouses[0] : null);
    }
  };

  const addSystem = (systemData: Omit<SystemType, 'id'>) => {
    const newSystem = {
      id: Date.now().toString(),
      ...systemData,
    } as SystemType;
    setSystems(prev => [...prev, newSystem]);
  };

  const updateSystem = (id: string, systemData: Partial<SystemType>) => {
    setSystems(prev => prev.map(system => 
      system.id === id ? { ...system, ...systemData } as SystemType : system
    ));
  };

  const deleteSystem = (id: string) => {
    setSystems(prev => prev.filter(system => system.id !== id));
  };

  const getSystemsByHouse = (houseId: string) => {
    return systems.filter(system => system.houseId === houseId && system.isActive);
  };

  const getCurrentHouseSystems = () => {
    return currentHouse ? getSystemsByHouse(currentHouse.id) : [];
  };

  return (
    <SystemContext.Provider value={{
      houses,
      systems,
      currentHouse,
      addHouse,
      updateHouse,
      deleteHouse,
      setCurrentHouse,
      addSystem,
      updateSystem,
      deleteSystem,
      getSystemsByHouse,
      getCurrentHouseSystems,
    }}>
      {children}
    </SystemContext.Provider>
  );
};
