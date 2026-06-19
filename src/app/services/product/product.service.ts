import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products = signal<Product[]>([
    { id: 1, name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones', price: 199.99, category: 'electronics', inStock: true, imageUrl: '/assets/headphones.png', rating: 4.5 },
    { id: 2, name: 'Running Shoes', description: 'Lightweight marathon running shoes', price: 129.99, category: 'clothing', inStock: true, imageUrl: '/assets/shoes.png', rating: 4.2 },
    { id: 3, name: 'Organic Coffee Beans', description: 'Single-origin Arabica beans, 1kg bag', price: 24.99, category: 'food', inStock: false, imageUrl: '/assets/coffee.png', rating: 4.8 },
    { id: 4, name: 'TypeScript Handbook', description: 'Complete guide to TypeScript programming', price: 39.99, category: 'books', inStock: true, imageUrl: '/assets/ts-book.png', rating: 4.6 },
    { id: 5, name: 'Mechanical Keyboard', description: 'Cherry MX Blue switches, RGB backlit', price: 149.99, category: 'electronics', inStock: true, imageUrl: '/assets/keyboard.png', rating: 4.3 },
  ]);

  readonly allProducts = this.products.asReadonly();
  readonly inStockProducts = computed(() => this.products().filter(p => p.inStock));
  readonly totalValue = computed(() => this.products().reduce((sum, p) => sum + p.price, 0));

  getProductsByCategory(category: Product['category']): Product[] {
    return this.products().filter(p => p.category === category);
  }

  getProductById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  updatePrice(id: number, newPrice: number): void {
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, price: newPrice } : p)
    );
  }

  toggleStock(id: number): void {
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, inStock: !p.inStock } : p)
    );
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products().filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    );
  }
}
