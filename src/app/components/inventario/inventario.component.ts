import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';
import {
  InventarioService
} from '../../services/inventario.service';

import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './inventario.component.html',

  styleUrls:
    ['./inventario.component.css']
})

export class InventarioComponent
implements OnInit {

  private inventarioService =
    inject(InventarioService);

private cdr = inject(ChangeDetectorRef);

  productos: any[] = [];

  editandoId: number | null = null;

  producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    categoria: 'BlindBox',
    stock: 0
  };

  ngOnInit(): void {

    this.cargarProductos();

  }

  cargarProductos() {

  this.inventarioService
    .obtenerProductos()
    .subscribe({

      next: (res: any) => {

        console.log(res);

        this.productos = [...res];

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

      }

    });

}

  guardarProducto() {

  if (this.editandoId !== null) {

    this.inventarioService
      .actualizarProducto(
        this.editandoId,
        this.producto
      )
      .subscribe({

        next: () => {

          this.resetForm();

          this.cargarProductos();

        },

        error: (err) => {

          console.error(err);

        }

      });

  } else {

    this.inventarioService
      .crearProducto(this.producto)
      .subscribe({

        next: () => {

          this.resetForm();

          this.cargarProductos();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

}

  editarProducto(producto: any) {

  this.producto = {

    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    imagen: producto.imagen,
    categoria: producto.categoria,
    stock: producto.stock

  };

  this.editandoId = producto.id;

}

  eliminarProducto(id: number) {

    if (!confirm('¿Eliminar producto?')) {
      return;
    }

    this.inventarioService
      .eliminarProducto(id)
      .subscribe(() => {

        this.cargarProductos();

      });

  }

  resetForm() {

    this.editandoId = null;

    this.producto = {

      nombre: '',
      descripcion: '',
      precio: 0,
      imagen: '',
      categoria: 'BlindBox',
      stock: 0

    };


  }


calcularTotalInventario(): string {

  const total = this.productos.reduce(
    (acc, p) => acc + Number(p.precio),
    0
  );

  return total.toFixed(2);

}

}