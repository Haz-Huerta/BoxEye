import {  AfterViewInit,  Component,  ElementRef,  ViewChild,  inject} from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { afterNextRender } from '@angular/core';
declare const paypal: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements AfterViewInit {
  @ViewChild('paypalButtonContainer')
  paypalButtonContainer!: ElementRef<HTMLDivElement>;

  private carritoService = inject(CarritoService);
  private paypalService = inject(PaypalService);

  carrito = this.carritoService.productos;
  total = () => this.carritoService.total();

  mensaje = '';

  constructor() {
    afterNextRender(() => {
    // Esto SOLO se ejecuta en el navegador, después de que el CarritoService
    // haya recuperado los datos del localStorage.
    if (this.carrito().length > 0) {
      this.renderPaypalButton();
    }
  });
  }

  ngAfterViewInit(): void {
    
  }

  private renderPaypalButton(): void {

    if (!this.paypalButtonContainer || this.paypalButtonContainer.nativeElement.innerHTML !== '') {
      return; // Evita duplicados
    }
    console.log('Contenido del carrito al cargar checkout:', this.carrito());

    if (this.carrito().length === 0) {
    this.mensaje = 'El carrito está vacío, no se puede procesar el pago.';
    return; 
  }

    if (typeof paypal === 'undefined') {
      this.mensaje = 'No se cargó el SDK de PayPal.';
      return;
    }

    if (!this.paypalButtonContainer) {
      return;
    }

    this.paypalButtonContainer.nativeElement.innerHTML = '';

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: this.total().toString(), // Aquí le pasas tu total calculadov
            currency_code: 'MXN'
          },
          description: 'Compra en Boxeye'
        }]
      });
    },

    onApprove: async (data: any, actions: any) => {
  try {
    // Forzamos la captura inmediata
    const details = await actions.order.capture();
    
    if (details.status === 'COMPLETED') {
      console.log('Pago exitoso para Boxeye');
      this.generarYDescargarXML(details); // Pasa todo el objeto details
    }
  } catch (err) {
    console.error('Error en la captura final:', err);
    // Si aquí sigue saliendo 403, es porque tu cuenta personal de Sandbox no es de México
  }
},

    onCancel: (data: any) => {
      console.log('El usuario canceló el pago');
    },

    onError: (err: any) => {
      console.error('Error en PayPal:', err);
    }
    
    }).render(this.paypalButtonContainer.nativeElement);
  }
    private generarYDescargarXML(datosPago: any): void {
    // Estructura básica del XML con los datos de tu carrito y el ID de pago
    const fecha = new Date().toISOString();
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<recibo>
  <tienda>Boxeye Store</tienda>
  <fecha>${fecha}</fecha>
  <transaccion_id>${datosPago.id}</transaccion_id>
  <productos>`;

    this.carrito().forEach(p => {
      xmlContent += `
    <producto>
      <nombre>${p.nombre}</nombre>
      <precio>${p.precio}</precio>
    </producto>`;
    });

    xmlContent += `
  </productos>
  <total>${this.total()}</total>
  <estado>PAGADO</estado>
</recibo>`;

    // Crear el archivo y descargarlo
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_Boxeye_${datosPago.id}.xml`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

