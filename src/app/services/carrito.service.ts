import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { Product } from '../models/producto.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  // Lista reactiva del carrito
  private productosSignal = signal<Product[]>([]);
  private platformId = inject(PLATFORM_ID);
  // Exponer como readonly
  productos = this.productosSignal.asReadonly();

  constructor() {
    // Solo intentamos leer si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const local = localStorage.getItem('carrito_boxeye');
      if (local) {
        this.productosSignal.set(JSON.parse(local));
      }
    }
  }
  
  agregar(producto: Product) {
    this.productosSignal.update(lista => [...lista, producto]);
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
    // Convertimos p.precio a número antes de sumar
    const precioNumerico = typeof p.precio === 'string' ? parseFloat(p.precio) : p.precio;
    return acc + (precioNumerico || 0);
  }, 0);
}
  exportarXML() {
    const productos = this.productosSignal();

    // Estructura XML manual
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<recibo>\n`;

    for (const p of productos) {
      xml += `  <producto>\n`;
      xml += `    <id>${p.id}</id>\n`;
      xml += `    <nombre>${this.escapeXml(p.nombre)}</nombre>\n`;
      xml += `    <precio>${p.precio}</precio>\n`;
      if (p.descripcion) {
        xml += `    <descripcion>${this.escapeXml(p.descripcion)}</descripcion>\n`;
      }
      xml += `  </producto>\n`;
    }

    xml += `  <total>${this.total().toFixed(2)}</total>\n`;
    xml += `</recibo>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    a.click();

    URL.revokeObjectURL(url);
  }

  private guardarLocal() {
    // Solo intentamos guardar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('carrito_boxeye', JSON.stringify(this.productosSignal()));
    }
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

