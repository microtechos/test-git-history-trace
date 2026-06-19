export interface AppNotification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  read: boolean;
  autoDismiss: boolean;
}
