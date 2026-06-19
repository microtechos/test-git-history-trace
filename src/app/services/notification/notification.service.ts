import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = signal<AppNotification[]>([]);
  private nextId = 1;

  readonly allNotifications = this.notifications.asReadonly();
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);
  readonly hasUnread = computed(() => this.unreadCount() > 0);

  push(type: AppNotification['type'], message: string, autoDismiss = true): void {
    const notification: AppNotification = {
      id: this.nextId++,
      type,
      message,
      timestamp: new Date(),
      read: false,
      autoDismiss,
    };
    this.notifications.update(list => [notification, ...list]);

    if (autoDismiss) {
      setTimeout(() => this.dismiss(notification.id), 5000);
    }
  }

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message, false);
  }

  warning(message: string): void {
    this.push('warning', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  markAsRead(id: number): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  markAllAsRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  dismiss(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}
