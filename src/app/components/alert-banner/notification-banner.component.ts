import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-banner',
  imports: [DatePipe],
  templateUrl: './notification-banner.component.html',
  styleUrl: './notification-banner.component.scss',
})
export class NotificationBannerComponent {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.allNotifications;
  unreadCount = this.notificationService.unreadCount;
  errorCount = this.notificationService.errorCount;
  hasUnread = this.notificationService.hasUnread;

  filterType: 'all' | 'success' | 'error' | 'warning' | 'info' = 'all';
  isExpanded = true;

  get filteredNotifications() {
    if (this.filterType === 'all') return this.notifications();
    return this.notificationService.getByType(this.filterType);
  }

  onDismiss(id: number): void {
    this.notificationService.dismiss(id);
  }

  onMarkAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  onMarkAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  onClearAll(): void {
    this.notificationService.clearAll();
  }

  onClearByType(type: 'success' | 'error' | 'warning' | 'info'): void {
    this.notificationService.clearByType(type);
  }

  toggleExpanded(): void {
    this.isExpanded = !this.isExpanded;
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  }

  getColorForType(type: string): string {
    switch (type) {
      case 'success': return '#34a853';
      case 'error': return '#ea4335';
      case 'warning': return '#fbbc04';
      case 'info': return '#4285f4';
      default: return '#666';
    }
  }
}
