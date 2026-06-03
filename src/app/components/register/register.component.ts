import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private authService = inject(AuthService);

  private router = inject(Router);

  nombre_usuario = signal('');

  correo = signal('');

  contrasena = signal('');

  mensaje = signal('');

  

  registrar() {

    // VALIDACIONES
  if (this.nombre_usuario().trim().length < 3) {

    this.mensaje.set('Nombre muy corto');
    return;

  }

  if (!this.correo().includes('@')) {

    this.mensaje.set('Correo inválido');
    return;

  }

  if (this.contrasena().length < 6) {

    this.mensaje.set(
      'La contraseña debe tener mínimo 6 caracteres'
    );

    return;

  }

    this.authService.register({

      nombre_usuario: this.nombre_usuario(),

      correo: this.correo(),

      contrasena: this.contrasena()

    }).subscribe({

      next: () => {

        this.router.navigate(['/login']);

      },

      error: () => {

        this.mensaje.set(
          'Error al registrar usuario'
        );

      }

    });

  }

}