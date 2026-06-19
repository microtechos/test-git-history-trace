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
  readonly outOfStockProducts = computed(() => this.products().filter(p => !p.inStock));
  readonly totalValue = computed(() => this.products().reduce((sum, p) => sum + p.price, 0));
  readonly averageRating = computed(() => {
    const products = this.products();
    if (products.length === 0) return 0;
    return products.reduce((sum, p) => sum + p.rating, 0) / products.length;
  });
  readonly categories = computed(() => [...new Set(this.products().map(p => p.category))]);

  getProductsByCategory(category: Product['category']): Product[] {
    return this.products().filter(p => p.category === category);
  }

  getProductById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  addProduct(product: Omit<Product, 'id'>): void {
    const newProduct: Product = {
      ...product,
      id: Math.max(...this.products().map(p => p.id)) + 1,
    };
    this.products.update(products => [...products, newProduct]);
  }

  updatePrice(id: number, newPrice: number): void {
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, price: newPrice } : p)
    );
  }

  updateRating(id: number, newRating: number): void {
    const clampedRating = Math.max(0, Math.min(5, newRating));
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, rating: clampedRating } : p)
    );
  }

  removeProduct(id: number): void {
    this.products.update(products => products.filter(p => p.id !== id));
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

  sortByPrice(ascending = true): Product[] {
    return [...this.products()].sort((a, b) =>
      ascending ? a.price - b.price : b.price - a.price
    );
  }

  sortByRating(): Product[] {
    return [...this.products()].sort((a, b) => b.rating - a.rating);
  }

  getTopRated(limit = 3): Product[] {
    return [...this.products()]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  getPriceRange(): { min: number; max: number } {
    const prices = this.products().map(p => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }

  applyDiscount(id: number, percentOff: number): void {
    const discount = Math.max(0, Math.min(100, percentOff));
    this.products.update(products =>
      products.map(p => p.id === id ? { ...p, price: +(p.price * (1 - discount / 100)).toFixed(2) } : p)
    );
  }

  bulkUpdateStock(ids: number[], inStock: boolean): void {
    const idSet = new Set(ids);
    this.products.update(products =>
      products.map(p => idSet.has(p.id) ? { ...p, inStock } : p)
    );
  }
}
