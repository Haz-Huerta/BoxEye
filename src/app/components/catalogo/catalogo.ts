import { Component, computed, signal, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/productos.service';
import { ProductCard } from '../product-card/product-card';
import { CarritoService } from '../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCard, CarritoComponent, CommonModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class CatalogoComponent implements OnInit {

  private productsService = inject(ProductsService);
  public carritoService = inject(CarritoService);

  products = signal<Product[]>([]);
  inStockCount = computed(() => this.products().filter(p => p.stock).length);
  vistaActiva = signal<'catalogo' | 'carrito'>('catalogo');
  busqueda = signal('');
  mostrarPreview = signal(false);
  categoriaSeleccionada = signal('Todas');

categorias = computed(() => {
  const cats = this.products().map(p => p.categoria);
  return ['Todas', ...new Set(cats)];
});

productosFiltrados = computed(() => {

  if (this.categoriaSeleccionada() === 'Todas') {
    return this.products();
  }

  return this.products().filter(
    p => p.categoria === this.categoriaSeleccionada()
  );
});


  @Output() add = new EventEmitter<Product>();

  ngOnInit(): void {
    this.productsService.getProductos().subscribe({
      next: (data) => {
        this.products.set(data); // ✅ correcto
        console.log('Productos cargados:', data);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
      },
    });
  }

  toggleCartPreview() {
  this.mostrarPreview.update(v => !v);
  }

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

