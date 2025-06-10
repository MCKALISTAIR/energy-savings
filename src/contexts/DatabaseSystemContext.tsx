
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useHouses, House } from '@/hooks/useHouses';
import { useSystems, System } from '@/hooks/useSystems';

interface DatabaseSystemContextType {
  houses: House[];
  systems: System[];
  currentHouse: House | null;
  housesLoading: boolean;
  systemsLoading: boolean;
  setCurrentHouse: (house: House | null) => void;
  addHouse: (house: { name: string; address: string }) => Promise<House | undefined>;
  updateHouse: (id: string, house: { name?: string; address?: string }) => Promise<House | undefined>;
  deleteHouse: (id: string) => Promise<void>;
  addSystem: (system: {
    house_id: string;
    name: string;
    type: 'solar' | 'battery' | 'ev' | 'heat_pump';
    install_date: string;
    is_active: boolean;
    specifications: Record<string, any>;
  }) => Promise<System | undefined>;
  updateSystem: (id: string, system: Partial<System>) => Promise<System | undefined>;
  deleteSystem: (id: string) => Promise<void>;
  getSystemsByHouse: (houseId: string) => System[];
  getCurrentHouseSystems: () => System[];
}

const DatabaseSystemContext = createContext<DatabaseSystemContextType | undefined>(undefined);

export const useDatabaseSystem = () => {
  const context = useContext(DatabaseSystemContext);
  if (!context) {
    throw new Error('useDatabaseSystem must be used within a DatabaseSystemProvider');
  }
  return context;
};

interface DatabaseSystemProviderProps {
  children: ReactNode;
}

export const DatabaseSystemProvider: React.FC<DatabaseSystemProviderProps> = ({ children }) => {
  const [currentHouse, setCurrentHouse] = useState<House | null>(null);
  
  const { 
    houses, 
    loading: housesLoading, 
    addHouse: addHouseHook, 
    updateHouse: updateHouseHook, 
    deleteHouse: deleteHouseHook 
  } = useHouses();
  
  const { 
    systems, 
    loading: systemsLoading, 
    addSystem: addSystemHook, 
    updateSystem: updateSystemHook, 
    deleteSystem: deleteSystemHook 
  } = useSystems();

  // Set the first house as current when houses load
  React.useEffect(() => {
    if (houses.length > 0 && !currentHouse) {
      setCurrentHouse(houses[0]);
    }
  }, [houses, currentHouse]);

  const addHouse = async (houseData: { name: string; address: string }) => {
    const newHouse = await addHouseHook(houseData);
    if (newHouse && !currentHouse) {
      setCurrentHouse(newHouse);
    }
    return newHouse;
  };

  const updateHouse = async (id: string, updates: { name?: string; address?: string }) => {
    const updatedHouse = await updateHouseHook(id, updates);
    if (updatedHouse && currentHouse?.id === id) {
      setCurrentHouse(updatedHouse);
    }
    return updatedHouse;
  };

  const deleteHouse = async (id: string) => {
    await deleteHouseHook(id);
    if (currentHouse?.id === id) {
      const remainingHouses = houses.filter(house => house.id !== id);
      setCurrentHouse(remainingHouses.length > 0 ? remainingHouses[0] : null);
    }
  };

  const addSystem = async (systemData: {
    house_id: string;
    name: string;
    type: 'solar' | 'battery' | 'ev' | 'heat_pump';
    install_date: string;
    is_active: boolean;
    specifications: Record<string, any>;
  }) => {
    return await addSystemHook(systemData);
  };

  const updateSystem = async (id: string, updates: Partial<System>) => {
    return await updateSystemHook(id, updates);
  };

  const deleteSystem = async (id: string) => {
    await deleteSystemHook(id);
  };

  const getSystemsByHouse = (houseId: string) => {
    return systems.filter(system => system.house_id === houseId && system.is_active);
  };

  const getCurrentHouseSystems = () => {
    return currentHouse ? getSystemsByHouse(currentHouse.id) : [];
  };

  return (
    <DatabaseSystemContext.Provider value={{
      houses,
      systems,
      currentHouse,
      housesLoading,
      systemsLoading,
      setCurrentHouse,
      addHouse,
      updateHouse,
      deleteHouse,
      addSystem,
      updateSystem,
      deleteSystem,
      getSystemsByHouse,
      getCurrentHouseSystems,
    }}>
      {children}
    </DatabaseSystemContext.Provider>
  );
};
