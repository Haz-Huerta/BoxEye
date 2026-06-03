import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  private http = inject(HttpClient);

  private apiUrl =
    'http://localhost:3000/api/inventario';

  private getHeaders() {

    return {
  headers: new HttpHeaders({
    Authorization:
      `Bearer ${localStorage.getItem('token')}`
  })
    };

  }

  obtenerProductos() {

    return this.http.get<any[]>(
      this.apiUrl,
      this.getHeaders()
    );

  }

  crearProducto(data: any) {

    return this.http.post(
      this.apiUrl,
      data,
      this.getHeaders()
    );

  }

  actualizarProducto(
  id: number,
  data: any
) {

  return this.http.put(
    `${this.apiUrl}/${id}`,
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );

}

  eliminarProducto(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );

  }

}