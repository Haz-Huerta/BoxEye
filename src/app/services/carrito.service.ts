import {
  inject,
  Injectable,
  signal,
  PLATFORM_ID
} from '@angular/core';

import { Product } from '../models/producto.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private productosSignal = signal<Product[]>([]);
  private platformId = inject(PLATFORM_ID);

  productos = this.productosSignal.asReadonly();

  constructor() {

    if (isPlatformBrowser(this.platformId)) {

      const local = localStorage.getItem('carrito_boxeye');

      if (local) {
        this.productosSignal.set(JSON.parse(local));
      }

    }

  }

  agregar(producto: Product) {

    this.productosSignal.update(lista => {

      const index = lista.findIndex(p => p.id === producto.id);

      // Ya existe → aumentar cantidad
      if (index !== -1) {

        return lista.map((p, i) => {

          if (i === index) {

            return {
              ...p,
              cantidad: Math.min((p.cantidad || 1) + 1, 10)
            };

          }

          return p;

        });

      }

      // Nuevo producto
      return [
        ...lista,
        {
          ...producto,
          cantidad: 1
        }
      ];

    });

    this.guardarLocal();

  }

  aumentarCantidad(id: number) {

    this.productosSignal.update(lista =>
      lista.map(p => {

        if (p.id === id) {

          return {
            ...p,
            cantidad: Math.min((p.cantidad || 1) + 1, 10)
          };

        }

        return p;

      })
    );

    this.guardarLocal();

  }

  disminuirCantidad(id: number) {

    this.productosSignal.update(lista => {

      return lista
        .map(p => {

          if (p.id === id) {

            return {
              ...p,
              cantidad: (p.cantidad || 1) - 1
            };

          }

          return p;

        })
        .filter(p => (p.cantidad || 0) > 0);

    });

    this.guardarLocal();

  }

  quitar(index: number) {

    this.productosSignal.update(lista => {

      const copia = [...lista];
      copia.splice(index, 1);

      return copia;

    });

    this.guardarLocal();

  }

  vaciar() {

    this.productosSignal.set([]);
    this.guardarLocal();

  }

  total(): number {

    return this.productosSignal().reduce((acc, p) => {

      const precio =
        typeof p.precio === 'string'
          ? parseFloat(p.precio)
          : p.precio;

      return acc + (precio * (p.cantidad || 1));

    }, 0);

  }

  private guardarLocal() {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem(
        'carrito_boxeye',
        JSON.stringify(this.productosSignal())
      );

    }

  }

  exportarXML() {

  const productos = this.productosSignal();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<recibo>\n`;

  productos.forEach(p => {

    xml += `  <producto>\n`;
    xml += `    <id>${p.id}</id>\n`;
    xml += `    <nombre>${this.escapeXml(p.nombre)}</nombre>\n`;
    xml += `    <precio>${p.precio}</precio>\n`;
    xml += `    <cantidad>${p.cantidad || 1}</cantidad>\n`;

    if (p.descripcion) {
      xml += `    <descripcion>${this.escapeXml(p.descripcion)}</descripcion>\n`;
    }

    xml += `  </producto>\n`;

  });

  xml += `  <total>${this.total().toFixed(2)}</total>\n`;
  xml += `</recibo>`;

  const blob = new Blob([xml], {
    type: 'application/xml'
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;
  a.download = 'recibo.xml';
  a.click();

  URL.revokeObjectURL(url);

}
private escapeXml(value: string): string {

  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

}
}
