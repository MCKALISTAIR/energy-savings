
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface System {
  id: string;
  user_id: string;
  house_id: string;
  name: string;
  type: 'solar' | 'battery' | 'ev' | 'heat_pump';
  install_date: string;
  is_active: boolean;
  specifications: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const useSystems = (houseId?: string) => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSystems = async () => {
    if (!user) {
      setSystems([]);
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('systems').select('*');
      
      if (houseId) {
        query = query.eq('house_id', houseId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure compatibility with our System interface
      const typedSystems = (data || []).map(system => ({
        ...system,
        type: system.type as 'solar' | 'battery' | 'ev' | 'heat_pump',
        specifications: system.specifications as Record<string, any>
      }));
      
      setSystems(typedSystems);
    } catch (error) {
      console.error('Error fetching systems:', error);
    } finally {
      setLoading(false);
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
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('systems')
        .insert([{
          user_id: user.id,
          ...systemData
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const typedSystem = {
        ...data,
        type: data.type as 'solar' | 'battery' | 'ev' | 'heat_pump',
        specifications: data.specifications as Record<string, any>
      };
      
      setSystems(prev => [typedSystem, ...prev]);
      return typedSystem;
    } catch (error) {
      console.error('Error adding system:', error);
      throw error;
    }
  };

  const updateSystem = async (id: string, updates: Partial<System>) => {
    try {
      const { data, error } = await supabase
        .from('systems')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      const typedSystem = {
        ...data,
        type: data.type as 'solar' | 'battery' | 'ev' | 'heat_pump',
        specifications: data.specifications as Record<string, any>
      };
      
      setSystems(prev => prev.map(system => system.id === id ? typedSystem : system));
      return typedSystem;
    } catch (error) {
      console.error('Error updating system:', error);
      throw error;
    }
  };

  const deleteSystem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('systems')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSystems(prev => prev.filter(system => system.id !== id));
    } catch (error) {
      console.error('Error deleting system:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSystems();
  }, [user, houseId]);

  return {
    systems,
    loading,
    addSystem,
    updateSystem,
    deleteSystem,
    refetch: fetchSystems
  };
};
