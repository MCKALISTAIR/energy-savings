
export const getCurrencySymbol = (currency: string = 'GBP'): string => {
  const symbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$'
  };
  return symbols[currency] || '£';
};

export const getPreferredCurrency = (): string => {
  return localStorage.getItem('preferredCurrency') || 'GBP';
};

export const formatCurrency = (amount: number, currency?: string): string => {
  const currencyCode = currency || getPreferredCurrency();
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${amount.toLocaleString()}`;
};
