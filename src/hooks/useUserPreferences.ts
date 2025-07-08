import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserPreferences {
  id?: string;
  user_id: string;
  selected_energy_supplier?: string;
  created_at?: string;
  updated_at?: string;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user preferences when user is available
  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(null);
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading preferences:', error);
        return;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSelectedSupplier = async (supplierId: string) => {
    if (!user) return false;

    try {
      const preferenceData = {
        user_id: user.id,
        selected_energy_supplier: supplierId,
      };

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(preferenceData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving supplier preference:', error);
        toast({
          title: "Error",
          description: "Failed to save your supplier selection",
          variant: "destructive"
        });
        return false;
      }

      setPreferences(data);
      toast({
        title: "Saved!",
        description: "Your energy supplier selection has been saved to your account",
      });
      return true;
    } catch (error) {
      console.error('Error saving supplier preference:', error);
      return false;
    }
  };

  const clearSelectedSupplier = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ selected_energy_supplier: null })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing supplier preference:', error);
        return false;
      }

      setPreferences(prev => prev ? { ...prev, selected_energy_supplier: undefined } : null);
      return true;
    } catch (error) {
      console.error('Error clearing supplier preference:', error);
      return false;
    }
  };

  return {
    preferences,
    loading,
    saveSelectedSupplier,
    clearSelectedSupplier,
    selectedSupplier: preferences?.selected_energy_supplier || null,
  };
};