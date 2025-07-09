import { useState, useEffect } from 'react';

interface ConnectionForm {
  apiKey: string;
}

export const useSmartMeterConnection = () => {
  const [connectionForm, setConnectionForm] = useState<ConnectionForm>({
    apiKey: ''
  });

  const updateApiKey = (apiKey: string) => {
    setConnectionForm(prev => ({ ...prev, apiKey }));
  };

  const clearConnection = () => {
    setConnectionForm({ apiKey: '' });
  };

  return {
    connectionForm,
    setConnectionForm,
    updateApiKey,
    clearConnection
  };
};