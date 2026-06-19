import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings/settings.service';
import { AppSettings } from '../../models/settings.model';

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

  onThemeChange(theme: 'light' | 'dark' | 'auto'): void {
    this.settingsService.updateSetting('theme', theme);
  }

  onCurrencyChange(currency: AppSettings['currency']): void {
    this.settingsService.updateSetting('currency', currency);
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

  onResetDefaults(): void {
    this.settingsService.resetToDefaults();
  }
}
