export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food' | 'books';
  inStock: boolean;
  imageUrl: string;
  rating: number;
}
