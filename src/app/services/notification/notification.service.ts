import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = signal<AppNotification[]>([]);
  private nextId = 1;

  private maxNotifications = 50;
  private dismissTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

  readonly allNotifications = this.notifications.asReadonly();
  readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);
  readonly hasUnread = computed(() => this.unreadCount() > 0);
  readonly errorCount = computed(() => this.notifications().filter(n => n.type === 'error').length);
  readonly recentNotifications = computed(() => this.notifications().slice(0, 10));

  getByType(type: AppNotification['type']): AppNotification[] {
    return this.notifications().filter(n => n.type === type);
  }

  push(type: AppNotification['type'], message: string, autoDismiss = true): void {
    const notification: AppNotification = {
      id: this.nextId++,
      type,
      message,
      timestamp: new Date(),
      read: false,
      autoDismiss,
    };
    this.notifications.update(list => {
      const updated = [notification, ...list];
      return updated.length > this.maxNotifications
        ? updated.slice(0, this.maxNotifications)
        : updated;
    });

    if (autoDismiss) {
      const timeout = setTimeout(() => this.dismiss(notification.id), 5000);
      this.dismissTimeouts.set(notification.id, timeout);
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
    const timeout = this.dismissTimeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.dismissTimeouts.delete(id);
    }
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  clearAll(): void {
    this.dismissTimeouts.forEach(timeout => clearTimeout(timeout));
    this.dismissTimeouts.clear();
    this.notifications.set([]);
  }

  clearByType(type: AppNotification['type']): void {
    const toClear = this.notifications().filter(n => n.type === type);
    toClear.forEach(n => {
      const timeout = this.dismissTimeouts.get(n.id);
      if (timeout) {
        clearTimeout(timeout);
        this.dismissTimeouts.delete(n.id);
      }
    });
    this.notifications.update(list => list.filter(n => n.type !== type));
  }
}
