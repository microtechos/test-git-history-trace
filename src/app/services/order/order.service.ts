import { Injectable, signal, computed } from '@angular/core';
import { Order, OrderItem } from '../../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders = signal<Order[]>([
    {
      id: 1001, customerId: 1, status: 'delivered', totalAmount: 329.98, createdAt: new Date('2025-01-10'), updatedAt: new Date('2025-01-15'),
      items: [
        { productId: 1, productName: 'Wireless Headphones', quantity: 1, unitPrice: 199.99 },
        { productId: 2, productName: 'Running Shoes', quantity: 1, unitPrice: 129.99 },
      ],
    },
    {
      id: 1002, customerId: 2, status: 'shipped', totalAmount: 64.98, createdAt: new Date('2025-03-05'), updatedAt: new Date('2025-03-07'),
      items: [
        { productId: 3, productName: 'Organic Coffee Beans', quantity: 1, unitPrice: 24.99 },
        { productId: 4, productName: 'TypeScript Handbook', quantity: 1, unitPrice: 39.99 },
      ],
    },
    {
      id: 1003, customerId: 3, status: 'pending', totalAmount: 149.99, createdAt: new Date('2025-06-01'), updatedAt: new Date('2025-06-01'),
      items: [
        { productId: 5, productName: 'Mechanical Keyboard', quantity: 1, unitPrice: 149.99 },
      ],
    },
  ]);

  readonly allOrders = this.orders.asReadonly();
  readonly pendingOrders = computed(() => this.orders().filter(o => o.status === 'pending'));
  readonly shippedOrders = computed(() => this.orders().filter(o => o.status === 'shipped'));
  readonly deliveredOrders = computed(() => this.orders().filter(o => o.status === 'delivered'));
  readonly orderCount = computed(() => this.orders().length);
  readonly totalRevenue = computed(() =>
    this.orders()
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0)
  );

  getOrderById(id: number): Order | undefined {
    return this.orders().find(o => o.id === id);
  }

  getOrdersByCustomer(customerId: number): Order[] {
    return this.orders().filter(o => o.customerId === customerId);
  }

  getOrdersByStatus(status: Order['status']): Order[] {
    return this.orders().filter(o => o.status === status);
  }

  getOrdersByDateRange(start: Date, end: Date): Order[] {
    return this.orders().filter(o => o.createdAt >= start && o.createdAt <= end);
  }

  addItemToOrder(orderId: number, item: OrderItem): void {
    this.orders.update(orders =>
      orders.map(o => {
        if (o.id !== orderId || o.status !== 'pending') return o;
        const updatedItems = [...o.items, item];
        const totalAmount = updatedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        return { ...o, items: updatedItems, totalAmount, updatedAt: new Date() };
      })
    );
  }

  removeItemFromOrder(orderId: number, productId: number): void {
    this.orders.update(orders =>
      orders.map(o => {
        if (o.id !== orderId || o.status !== 'pending') return o;
        const updatedItems = o.items.filter(i => i.productId !== productId);
        const totalAmount = updatedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        return { ...o, items: updatedItems, totalAmount, updatedAt: new Date() };
      })
    );
  }

  createOrder(customerId: number, items: OrderItem[]): void {
    const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const now = new Date();
    const newOrder: Order = {
      id: Math.max(...this.orders().map(o => o.id)) + 1,
      customerId,
      items,
      status: 'pending',
      totalAmount,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.update(orders => [...orders, newOrder]);
  }

  updateStatus(orderId: number, status: Order['status']): void {
    this.orders.update(orders =>
      orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date() } : o)
    );
  }

  cancelOrder(orderId: number): void {
    this.updateStatus(orderId, 'cancelled');
  }
}
