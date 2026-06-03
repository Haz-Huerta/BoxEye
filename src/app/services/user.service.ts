import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api/user';

  constructor() {}

  obtenerPerfil() {

    return this.http.get(
      `${this.apiUrl}/profile`
    );

  }

  obtenerHistorial() {

  return this.http.get(
    `${this.apiUrl}/orders`
  );

}

  updateProfile(data: any) {

  return this.http.put(
    `${this.apiUrl}/profile`,
    data
  );

}

updatePassword(data: any) {

  return this.http.put(
    `${this.apiUrl}/password`,
    data
  );
}

}