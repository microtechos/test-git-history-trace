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
  shippedOrders = this.orderService.shippedOrders;
  deliveredOrders = this.orderService.deliveredOrders;
  orderCount = this.orderService.orderCount;
  totalRevenue = this.orderService.totalRevenue;

  statusFilter: 'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' = 'all';
  sortBy: 'date' | 'amount' = 'date';

  get filteredOrders() {
    let result = this.statusFilter === 'all'
      ? this.orders()
      : this.orderService.getOrdersByStatus(this.statusFilter);

    if (this.sortBy === 'amount') {
      result = [...result].sort((a, b) => b.totalAmount - a.totalAmount);
    } else {
      result = [...result].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return result;
  }

  onUpdateStatus(orderId: number, status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'): void {
    this.orderService.updateStatus(orderId, status);
  }

  onCancelOrder(orderId: number): void {
    this.orderService.cancelOrder(orderId);
  }

  getStatusBadgeClass(status: string): string {
    return `badge-${status}`;
  }

  getItemCount(orderId: number): number {
    const order = this.orderService.getOrderById(orderId);
    return order ? order.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  }
}
