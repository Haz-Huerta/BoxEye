import { Component, computed, inject} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../services/productos.service';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class CatalogoComponent {
  // Signal con el arreglo de productos (valor inicial: [])
  
  private productsService = inject(ProductsService);
  products = toSignal(this.productsService.getAll(), { initialValue: [] });
  constructor() {}
}

