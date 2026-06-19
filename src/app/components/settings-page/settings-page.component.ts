import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';
import { AppPreferences } from '../../models/preferences.model';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  private settingsService = inject(SettingsService);

  settings = this.settingsService.currentSettings;
  isDarkMode = this.settingsService.isDarkMode;
  canUndo = this.settingsService.canUndo;

  showExportDialog = false;
  importJson = '';
  importError = '';

  onThemeChange(theme: 'light' | 'dark' | 'auto'): void {
    this.settingsService.updateSetting('theme', theme);
  }

  onCurrencyChange(currency: AppPreferences['currency']): void {
    this.settingsService.updateSetting('currency', currency);
  }

  onLanguageChange(language: string): void {
    this.settingsService.updateSetting('language', language);
  }

  onDateFormatChange(format: AppPreferences['dateFormat']): void {
    this.settingsService.updateSetting('dateFormat', format);
  }

  onItemsPerPageChange(count: number): void {
    this.settingsService.updateSetting('itemsPerPage', count);
  }

  onToggleNotifications(): void {
    this.settingsService.updateSetting('enableNotifications', !this.settings().enableNotifications);
  }

  onToggleAnimations(): void {
    this.settingsService.updateSetting('enableAnimations', !this.settings().enableAnimations);
  }

  onUndo(): void {
    this.settingsService.undo();
  }

  onResetDefaults(): void {
    this.settingsService.resetToDefaults();
  }

  onExport(): void {
    this.showExportDialog = true;
  }

  getExportedJson(): string {
    return this.settingsService.exportSettings();
  }

  onImport(): void {
    const success = this.settingsService.importSettings(this.importJson);
    if (success) {
      this.importJson = '';
      this.importError = '';
    } else {
      this.importError = 'Invalid JSON format';
    }
  }
}
