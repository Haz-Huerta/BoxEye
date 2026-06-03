import { Component, computed, signal, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/producto.model';
import { ProductsService } from '../../services/productos.service';
import { ProductCard } from '../product-card/product-card';
import { CarritoService } from '../../services/carrito.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCard, CarritoComponent, CommonModule, FormsModule, RouterLink],
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
  productoSeleccionado = signal<Product | null>(null);

  constructor(
  public authService: AuthService,
  private router: Router
) {}

categorias = computed(() => {
  const cats = this.products().map(p => p.categoria);
  return ['Todas', ...new Set(cats)];
});

productosFiltrados = computed(() => {

  const texto = this.busqueda().toLowerCase().trim();

  const categoria = this.categoriaSeleccionada();

  return this.products().filter(producto => {

    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(texto);

    const coincideCategoria =
      categoria === 'Todas'
      || producto.categoria === categoria;

    return coincideBusqueda && coincideCategoria;

  });
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

  if ((producto.stock || 0) <= 0) {
    return;
  }

  this.carritoService.agregar(producto);

  this.add.emit(producto);

  this.productoSeleccionado.set(null);

  console.log(
    'Producto agregado al carrito:',
    producto
  );

}

  trackById(index: number, product: Product) {
    return product.id;
  }

  cambiarVista(vista: 'catalogo' | 'carrito') {
    this.vistaActiva.set(vista);
  }

  abrirDetalle(producto: Product) {
  this.productoSeleccionado.set(producto);
}

cerrarDetalle() {
  this.productoSeleccionado.set(null);
}

logout() {

  this.authService.logout();

  this.router.navigate(['/']);

}

isAdmin(): boolean {

  return this.authService.isAdmin();

}

}

