import { Injectable, signal, computed, effect } from '@angular/core';
import { AppSettings } from '../../models/settings.model';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  itemsPerPage: 10,
  enableNotifications: true,
  enableAnimations: true,
  currency: 'USD',
  dateFormat: 'medium',
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private settings = signal<AppSettings>(this.loadFromStorage());

  readonly currentSettings = this.settings.asReadonly();
  readonly theme = computed(() => this.settings().theme);
  readonly isDarkMode = computed(() => this.settings().theme === 'dark');
  readonly currency = computed(() => this.settings().currency);

  constructor() {
    effect(() => {
      this.saveToStorage(this.settings());
    });
  }

  updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.settings.update(s => ({ ...s, [key]: value }));
  }

  updateMultiple(partial: Partial<AppSettings>): void {
    this.settings.update(s => ({ ...s, ...partial }));
  }

  resetToDefaults(): void {
    this.settings.set({ ...DEFAULT_SETTINGS });
  }

  private loadFromStorage(): AppSettings {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    const stored = localStorage.getItem('app-settings');
    if (!stored) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  }

  private saveToStorage(settings: AppSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }
}
