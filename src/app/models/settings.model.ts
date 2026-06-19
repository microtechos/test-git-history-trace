export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  itemsPerPage: number;
  enableNotifications: boolean;
  enableAnimations: boolean;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  dateFormat: 'short' | 'medium' | 'long';
}
