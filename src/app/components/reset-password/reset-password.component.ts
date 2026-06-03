import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  token =
    this.route.snapshot.paramMap.get('token');

  nuevaContrasena = signal('');

  mensaje = signal('');
  esError = signal(false);

  cambiarPassword() {

    this.http.post(
      'http://localhost:3000/api/auth/reset-password',
      {
        token: this.token,
        nuevaContrasena:
          this.nuevaContrasena()
      }
    )
    .subscribe({

      next: () => {

        this.mensaje.set(
          'Contraseña actualizada'
        );

        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 2000);

      },

      error: () => {

        this.mensaje.set(
          'Token inválido'
        );

      }

    });

  }

}