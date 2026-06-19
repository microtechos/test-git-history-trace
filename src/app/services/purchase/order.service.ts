import { Injectable, signal, computed } from '@angular/core';

interface PurchaseRecord {
  purchaseId: string;
  buyerEmail: string;
  productIds: number[];
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'crypto';
  grandTotal: number;
  tax: number;
  discount: number;
  purchaseDate: Date;
  fulfillmentStatus: 'awaiting_payment' | 'processing' | 'in_transit' | 'completed' | 'refunded';
  trackingNumber: string | null;
  notes: string;
}

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  private ledger = signal<PurchaseRecord[]>([
    {
      purchaseId: 'PUR-2025-0001', buyerEmail: 'john@example.com', productIds: [1, 5],
      paymentMethod: 'credit_card', grandTotal: 349.98, tax: 31.50, discount: 0,
      purchaseDate: new Date('2025-02-14'), fulfillmentStatus: 'completed',
      trackingNumber: 'TRK-889922', notes: 'Valentine gift bundle',
    },
    {
      purchaseId: 'PUR-2025-0002', buyerEmail: 'sarah@example.com', productIds: [3],
      paymentMethod: 'paypal', grandTotal: 24.99, tax: 2.25, discount: 5.00,
      purchaseDate: new Date('2025-04-01'), fulfillmentStatus: 'refunded',
      trackingNumber: null, notes: 'Refunded — damaged during shipping',
    },
    {
      purchaseId: 'PUR-2025-0003', buyerEmail: 'mike@example.com', productIds: [2, 4],
      paymentMethod: 'bank_transfer', grandTotal: 169.98, tax: 15.30, discount: 10.00,
      purchaseDate: new Date('2025-05-20'), fulfillmentStatus: 'in_transit',
      trackingNumber: 'TRK-112233', notes: '',
    },
  ]);

  readonly activePurchases = computed(() =>
    this.ledger().filter(p => p.fulfillmentStatus !== 'refunded')
  );

  readonly refundedPurchases = computed(() =>
    this.ledger().filter(p => p.fulfillmentStatus === 'refunded')
  );

  readonly grossRevenue = computed(() =>
    this.activePurchases().reduce((acc, p) => acc + p.grandTotal, 0)
  );

  readonly totalTaxCollected = computed(() =>
    this.activePurchases().reduce((acc, p) => acc + p.tax, 0)
  );

  readonly totalDiscountsGiven = computed(() =>
    this.ledger().reduce((acc, p) => acc + p.discount, 0)
  );

  readonly netRevenue = computed(() => this.grossRevenue() - this.totalDiscountsGiven());

  lookupByPurchaseId(purchaseId: string): PurchaseRecord | undefined {
    return this.ledger().find(p => p.purchaseId === purchaseId);
  }

  lookupByEmail(email: string): PurchaseRecord[] {
    return this.ledger().filter(p => p.buyerEmail.toLowerCase() === email.toLowerCase());
  }

  filterByPaymentMethod(method: PurchaseRecord['paymentMethod']): PurchaseRecord[] {
    return this.ledger().filter(p => p.paymentMethod === method);
  }

  filterByDateRange(from: Date, to: Date): PurchaseRecord[] {
    return this.ledger().filter(p => p.purchaseDate >= from && p.purchaseDate <= to);
  }

  generatePurchaseId(): string {
    const year = new Date().getFullYear();
    const seq = String(this.ledger().length + 1).padStart(4, '0');
    return `PUR-${year}-${seq}`;
  }

  recordPurchase(buyerEmail: string, productIds: number[], paymentMethod: PurchaseRecord['paymentMethod'], grandTotal: number, tax: number, discount: number): void {
    const record: PurchaseRecord = {
      purchaseId: this.generatePurchaseId(),
      buyerEmail,
      productIds,
      paymentMethod,
      grandTotal,
      tax,
      discount,
      purchaseDate: new Date(),
      fulfillmentStatus: 'awaiting_payment',
      trackingNumber: null,
      notes: '',
    };
    this.ledger.update(records => [...records, record]);
  }

  assignTracking(purchaseId: string, trackingNumber: string): void {
    this.ledger.update(records =>
      records.map(p => p.purchaseId === purchaseId
        ? { ...p, trackingNumber, fulfillmentStatus: 'in_transit' as const }
        : p
      )
    );
  }

  processRefund(purchaseId: string, reason: string): void {
    this.ledger.update(records =>
      records.map(p => p.purchaseId === purchaseId
        ? { ...p, fulfillmentStatus: 'refunded' as const, notes: `Refunded — ${reason}` }
        : p
      )
    );
  }

  markCompleted(purchaseId: string): void {
    this.ledger.update(records =>
      records.map(p => p.purchaseId === purchaseId
        ? { ...p, fulfillmentStatus: 'completed' as const }
        : p
      )
    );
  }

  getRevenueByPaymentMethod(): Record<string, number> {
    return this.activePurchases().reduce((acc, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.grandTotal;
      return acc;
    }, {} as Record<string, number>);
  }
}
