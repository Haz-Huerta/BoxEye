import { Component, computed, signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/productos.service';
import { ProductCard } from '../product-card/product-card';
import { CarritoService } from '../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCard, CarritoComponent, CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent {
  products = signal<Product[]>([]);
  inStockCount = computed(() => this.products().filter(p => p.inStock).length);
  vistaActiva = signal<'catalogo' | 'carrito'>('catalogo');

  constructor(
    public productsService: ProductsService,
    public carritoService: CarritoService
  ) {
    this.productsService.getAll().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error cargando XML:', err),
    });
  }
  @Output() add = new EventEmitter<Product>();

  agregar(producto: Product) {
    this.carritoService.agregar(producto);
    this.add.emit(producto);
    console.log('Producto agregado al carrito:', producto);
  }

  trackById(index: number, product: Product) {
  return product.id;
  }

  cambiarVista(vista: 'catalogo' | 'carrito') {
    this.vistaActiva.set(vista);
  }
}





