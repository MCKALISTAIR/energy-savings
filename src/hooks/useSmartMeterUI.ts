import { useState } from 'react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useAuth } from '@/contexts/AuthContext';

export const useSmartMeterUI = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isReverseTransitioning, setIsReverseTransitioning] = useState(false);
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const { user } = useAuth();
  const { 
    selectedSupplier: savedSupplier, 
    saveSelectedSupplier, 
    clearSelectedSupplier 
  } = useUserPreferences();

  const handleSupplierSelect = async (supplierId: string) => {
    setIsTransitioning(true);
    // Extended delay to allow full transition animation to complete
    setTimeout(async () => {
      setSelectedSupplier(supplierId);
      setIsTransitioning(false);
      
      // Save to user preferences if authenticated, show guest prompt if not
      if (user) {
        await saveSelectedSupplier(supplierId);
      } else {
        setShowGuestPrompt(true);
      }
    }, 900);
  };

  const handleBackToSuppliers = async () => {
    setIsReverseTransitioning(true);
    // Clear saved preference if user is authenticated
    if (user) {
      await clearSelectedSupplier();
    }
    // Show reverse animation first
    setTimeout(() => {
      setSelectedSupplier(null);
      setIsReverseTransitioning(false);
      setShowGuestPrompt(false);
    }, 900);
  };

  const handleDismissGuestPrompt = () => {
    setShowGuestPrompt(false);
  };

  // Load saved supplier preference when available
  const initializeSupplier = () => {
    if (savedSupplier && !selectedSupplier) {
      setSelectedSupplier(savedSupplier);
    }
  };

  return {
    selectedSupplier,
    setSelectedSupplier,
    isTransitioning,
    isReverseTransitioning,
    showGuestPrompt,
    handleSupplierSelect,
    handleBackToSuppliers,
    handleDismissGuestPrompt,
    initializeSupplier
  };
};