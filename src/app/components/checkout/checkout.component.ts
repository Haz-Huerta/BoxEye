import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { CurrencyPipe } from '@angular/common';
import { afterNextRender } from '@angular/core';

declare const paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements AfterViewInit {

  @ViewChild('paypalButtonContainer', { static: false })
  paypalButtonContainer!: ElementRef<HTMLDivElement>;

  private carritoService = inject(CarritoService);
  private paypalService = inject(PaypalService);

  carrito = this.carritoService.productos;
  total = () => this.carritoService.total();

  mensaje = '';

  constructor() {
    // Espera a que Angular renderice y el carrito esté cargado
    afterNextRender(() => {
      if (this.carrito().length > 0) {
        this.renderPaypalButton();
      } else {
        this.mensaje = 'El carrito está vacío.';
      }
    });
  }

  ngAfterViewInit(): void {
    // Seguridad extra por si el ViewChild aún no estaba listo
    if (this.carrito().length > 0) {
      this.renderPaypalButton();
    }
  }

  private renderPaypalButton(): void {

    console.log('PayPal SDK:', typeof paypal);
    // Validaciones básicas
    if (!this.paypalButtonContainer) return;

    const container = this.paypalButtonContainer.nativeElement;

    // Evita duplicar botones
    if (container.innerHTML.trim() !== '') return;

    if (this.carrito().length === 0) {
      this.mensaje = 'El carrito está vacío, no se puede procesar el pago.';
      return;
    }

    if (typeof paypal === 'undefined') {
      this.mensaje = 'No se cargó el SDK de PayPal.';
      return;
    }

    console.log('Carrito en checkout:', this.carrito());
    console.log('Total:', this.total());

    // Limpia contenedor
    container.innerHTML = '';

paypal.Buttons({
  style: {
    layout: 'vertical',
    color: 'gold',
    shape: 'rect',
    label: 'paypal'
  },

  createOrder: async () => {
  try {
    const carrito = this.carrito();

    console.log('Carrito enviado:', carrito);
    console.log('Total enviado:', this.total());

    const response = await fetch('http://localhost:3000/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  items: this.carrito().map(p => ({
    nombre: p.nombre,
    precio: Number(p.precio),
    cantidad: 1
  })),
  total: Number(this.total().toFixed(2))
})
    });

    const order = await response.json();

    console.log('Respuesta backend:', order);

    return order.id;

  } catch (error) {
    console.error("Error al crear la orden:", error);
  }
},

  onApprove: async (data: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/paypal/capture-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderId: data.orderID })
    });

      const result = await response.json();

      if (result.status === 'COMPLETED') {
        this.generarYDescargarXML(result);

    await fetch('http://localhost:3000/api/pedido', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productos: this.carritoService.productos(),
    total: this.carritoService.total()
  })
});

        this.carritoService.vaciar();
        this.mensaje = 'Pago completado con éxito.';
      }

    } catch (error) {
      console.error("Error capturando pago:", error);
    }
  },

  onError: (err: any) => {
    console.error("Error de PayPal:", err);
  }

}).render(container);
  }

  private generarYDescargarXML(datosPago: any): void {

    const fecha = new Date().toISOString();

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<recibo>
  <tienda>Boxeye Store</tienda>
  <fecha>${fecha}</fecha>
  <transaccion_id>${datosPago.id}</transaccion_id>
  <productos>`;

    this.carrito().forEach(p => {
      const precio = typeof p.precio === 'string'
        ? parseFloat(p.precio)
        : p.precio;

      xmlContent += `
    <producto>
      <nombre>${this.escapeXml(p.nombre)}</nombre>
      <precio>${precio}</precio>
    </producto>`;
    });

    xmlContent += `
  </productos>
  <total>${this.total().toFixed(2)}</total>
  <estado>PAGADO</estado>
</recibo>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_Boxeye_${datosPago.id}.xml`;
    link.click();

    window.URL.revokeObjectURL(url);
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