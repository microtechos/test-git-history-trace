import { Injectable, signal, computed, effect } from '@angular/core';
import { AppPreferences } from '../../models/preferences.model';

const DEFAULT_SETTINGS: AppPreferences = {
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
  private settings = signal<AppPreferences>(this.loadFromStorage());

  private settingsHistory = signal<AppPreferences[]>([]);

  readonly currentSettings = this.settings.asReadonly();
  readonly theme = computed(() => this.settings().theme);
  readonly isDarkMode = computed(() => this.settings().theme === 'dark');
  readonly currency = computed(() => this.settings().currency);
  readonly language = computed(() => this.settings().language);
  readonly canUndo = computed(() => this.settingsHistory().length > 0);

  constructor() {
    effect(() => {
      this.saveToStorage(this.settings());
    });
  }

  updateSetting<K extends keyof AppPreferences>(key: K, value: AppPreferences[K]): void {
    this.settingsHistory.update(h => [...h, { ...this.settings() }]);
    this.settings.update(s => ({ ...s, [key]: value }));
  }

  updateMultiple(partial: Partial<AppPreferences>): void {
    this.settingsHistory.update(h => [...h, { ...this.settings() }]);
    this.settings.update(s => ({ ...s, ...partial }));
  }

  undo(): void {
    const history = this.settingsHistory();
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    this.settingsHistory.update(h => h.slice(0, -1));
    this.settings.set(previous);
  }

  resetToDefaults(): void {
    this.settingsHistory.update(h => [...h, { ...this.settings() }]);
    this.settings.set({ ...DEFAULT_SETTINGS });
  }

  exportSettings(): string {
    return JSON.stringify(this.settings(), null, 2);
  }

  importSettings(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      this.settingsHistory.update(h => [...h, { ...this.settings() }]);
      this.settings.set({ ...DEFAULT_SETTINGS, ...parsed });
      return true;
    } catch {
      return false;
    }
  }

  private loadFromStorage(): AppPreferences {
    if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS };
    const stored = localStorage.getItem('app-settings');
    if (!stored) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  }

  private saveToStorage(settings: AppPreferences): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }
}
