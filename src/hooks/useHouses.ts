
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
      
      setHouses(data || []);
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
