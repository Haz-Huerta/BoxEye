import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  correo = '';

  mensaje = '';

  constructor(
    private http: HttpClient
  ) {}

  enviarCorreo() {

    this.http.post(

      'http://localhost:3000/api/auth/forgot-password',

      {
        correo: this.correo
      }

    ).subscribe({

      next: () => {

        this.mensaje =
          'Correo enviado correctamente';

      },

      error: () => {

        this.mensaje =
          'Error enviando correo';

      }

    });

  }

}