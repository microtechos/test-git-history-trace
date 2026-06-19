import { Component, inject } from '@angular/core';
import { OrderService } from '../../services/order/order.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-summary',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss',
})
export class OrderSummaryComponent {
  private orderService = inject(OrderService);

  orders = this.orderService.allOrders;
  pendingOrders = this.orderService.pendingOrders;
  orderCount = this.orderService.orderCount;

  onUpdateStatus(orderId: number, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'): void {
    this.orderService.updateStatus(orderId, status);
  }

  onCancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId);
  }

  getStatusBadgeClass(status: string): string {
    return `badge-${status}`;
  }
}
