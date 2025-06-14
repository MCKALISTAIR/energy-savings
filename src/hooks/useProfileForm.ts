
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useProfileForm = () => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initial values to track changes
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [initialCurrency, setInitialCurrency] = useState('GBP');

  // Check if user is using Google OAuth
  const isGoogleUser = user?.app_metadata?.provider === 'google';

  // Function to validate name input (letters and hyphens only)
  const validateNameInput = (value: string): string => {
    return value.replace(/[^a-zA-Z-]/g, '');
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNameInput(e.target.value);
    setFirstName(validatedValue);
    setHasUnsavedChanges(true);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateNameInput(e.target.value);
    setLastName(validatedValue);
    setHasUnsavedChanges(true);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    setHasUnsavedChanges(true);
  };

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      firstName !== initialFirstName ||
      lastName !== initialLastName ||
      currency !== initialCurrency ||
      newPassword !== '' ||
      confirmPassword !== '';
    
    setHasUnsavedChanges(hasChanges);
  }, [firstName, lastName, currency, newPassword, confirmPassword, initialFirstName, initialLastName, initialCurrency]);

  const loadUserData = (isOpen: boolean) => {
    if (user && isOpen) {
      // Load user metadata if available
      const metadata = user.user_metadata || {};
      const userFirstName = metadata.first_name || '';
      const userLastName = metadata.last_name || '';
      
      setFirstName(userFirstName);
      setLastName(userLastName);
      setInitialFirstName(userFirstName);
      setInitialLastName(userLastName);
      
      // Load currency preference from localStorage or default to GBP
      const savedCurrency = localStorage.getItem('preferredCurrency') || 'GBP';
      setCurrency(savedCurrency);
      setInitialCurrency(savedCurrency);
      
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      });

      if (updateError) throw updateError;

      // Save currency preference to localStorage
      localStorage.setItem('preferredCurrency', currency);

      // Update initial values after successful save
      setInitialFirstName(firstName);
      setInitialLastName(lastName);
      setInitialCurrency(currency);
      setHasUnsavedChanges(false);

      setSuccess('Profile updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setHasUnsavedChanges(false);
      setSuccess('Password updated successfully');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setSuccess(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setHasUnsavedChanges(false);
    
    // Reset to initial values
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setCurrency(initialCurrency);
  };

  return {
    user,
    firstName,
    lastName,
    currency,
    currentPassword,
    newPassword,
    confirmPassword,
    loading,
    error,
    success,
    isGoogleUser,
    hasUnsavedChanges,
    handleFirstNameChange,
    handleLastNameChange,
    setCurrency: handleCurrencyChange,
    setNewPassword,
    setConfirmPassword,
    loadUserData,
    handleSaveProfile,
    handleChangePassword,
    resetForm,
  };
};
