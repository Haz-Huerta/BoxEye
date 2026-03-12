import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/producto.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({required: true}) product!: Product;
  @Output() add = new EventEmitter<Product>();

  addToCart() {
    this.add.emit(this.product);
  }
}
