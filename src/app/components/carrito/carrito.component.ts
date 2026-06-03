
import { Component, computed, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { Product } from '../../models/producto.model';
import { Signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe], 
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent {
  @Output() volver = new EventEmitter<void>();
  carrito: Signal<Product[]>;
  total = computed(() => this.carritoService.total());
  private router = inject(Router);

  constructor(private carritoService: CarritoService) {
    this.carrito = this.carritoService.productos;
  }

  quitar(id: number) {
    this.carritoService.quitar(id);
  }

  vaciar() {
    this.carritoService.vaciar();
  }

  exportarXML() {
    this.carritoService.exportarXML();
  }

  aumentar(id: number) {
  this.carritoService.aumentarCantidad(id);
}

disminuir(id: number) {
  this.carritoService.disminuirCantidad(id);
}

  regresar() {
    this.volver.emit();
  }

  irAPagar() {
    this.router.navigate(['/checkout']);
  }
}



