
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface House {
  id: string;
  user_id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export const useHouses = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const createTestData = async () => {
    if (!user) return;
    
    console.log('Creating test house and systems for dev mode...');
    
    // Create test house
    const { data: testHouse, error: houseError } = await supabase
      .from('houses')
      .insert([{
        user_id: user.id,
        name: 'Test Development House',
        address: '123 Developer Street, Test City, TC1 2TD, United Kingdom'
      }])
      .select()
      .single();

    if (houseError) {
      console.error('Error creating test house:', houseError);
      return;
    }

    // Create test systems
    const testSystems = [
      {
        user_id: user.id,
        house_id: testHouse.id,
        name: 'Test Solar Panel System',
        type: 'solar',
        install_date: '2023-06-01',
        is_active: true,
        specifications: {
          capacity: 5.5,
          panelCount: 16,
          efficiency: 20.5,
          orientation: 'South',
          tilt: 35
        }
      },
      {
        user_id: user.id,
        house_id: testHouse.id,
        name: 'Test Battery Storage',
        type: 'battery',
        install_date: '2023-06-15',
        is_active: true,
        specifications: {
          capacity: 10.5,
          efficiency: 95,
          brand: 'Tesla',
          model: 'Powerwall 2'
        }
      },
      {
        user_id: user.id,
        house_id: testHouse.id,
        name: 'Test Electric Vehicle',
        type: 'ev',
        install_date: '2023-07-10',
        is_active: true,
        specifications: {
          make: 'Tesla',
          model: 'Model 3',
          batteryCapacity: 75,
          efficiency: 4.2,
          annualMileage: 12000
        }
      },
      {
        user_id: user.id,
        house_id: testHouse.id,
        name: 'Test Heat Pump System',
        type: 'heat_pump',
        install_date: '2023-08-20',
        is_active: true,
        specifications: {
          heatPumpType: 'air-source',
          cop: 3.2,
          heatingCapacity: 8500,
          coolingCapacity: 7200,
          brand: 'Mitsubishi',
          model: 'Ecodan'
        }
      }
    ];

    const { error: systemsError } = await supabase
      .from('systems')
      .insert(testSystems);

    if (systemsError) {
      console.error('Error creating test systems:', systemsError);
    } else {
      console.log('Test data created successfully!');
    }
  };

  const fetchHouses = async () => {
    if (!user) {
      setHouses([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const housesData = data || [];
      setHouses(housesData);
      
      // Check if we're in dev mode and no houses exist
      const devBypass = localStorage.getItem('devBypass') === 'true';
      if (devBypass && housesData.length === 0) {
        await createTestData();
        // Refetch after creating test data
        const { data: newData, error: newError } = await supabase
          .from('houses')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!newError) {
          setHouses(newData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHouse = async (houseData: { name: string; address: string }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('houses')
        .insert([{
          user_id: user.id,
          name: houseData.name,
          address: houseData.address
        }])
        .select()
        .single();

      if (error) throw error;
      setHouses(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding house:', error);
      throw error;
    }
  };

  const updateHouse = async (id: string, updates: { name?: string; address?: string }) => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setHouses(prev => prev.map(house => house.id === id ? data : house));
      return data;
    } catch (error) {
      console.error('Error updating house:', error);
      throw error;
    }
  };

  const deleteHouse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('houses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHouses(prev => prev.filter(house => house.id !== id));
    } catch (error) {
      console.error('Error deleting house:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchHouses();
  }, [user]);

  return {
    houses,
    loading,
    addHouse,
    updateHouse,
    deleteHouse,
    refetch: fetchHouses
  };
};
