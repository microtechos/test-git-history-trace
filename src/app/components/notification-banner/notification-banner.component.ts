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

  onDismiss(id: number): void {
    this.notificationService.dismiss(id);
  }

  onMarkAsRead(id: number): void {
    this.notificationService.markAsRead(id);
  }

  onClearAll(): void {
    this.notificationService.clearAll();
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
}
