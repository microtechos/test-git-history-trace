import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();
  toggleFavorite = output<number>();

  isFavorited = false;

  get ratingStars(): string {
    const full = Math.floor(this.product().rating);
    const half = this.product().rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }

  get discountedPrice(): number | null {
    const product = this.product();
    if (!product.inStock) return null;
    return product.price > 100 ? product.price * 0.9 : null;
  }

  get formattedCategory(): string {
    return this.product().category.charAt(0).toUpperCase() + this.product().category.slice(1);
  }

  onAddToCart(): void {
    if (this.product().inStock) {
      this.addToCart.emit(this.product());
    }
  }

  onToggleFavorite(): void {
    this.isFavorited = !this.isFavorited;
    this.toggleFavorite.emit(this.product().id);
  }
}
