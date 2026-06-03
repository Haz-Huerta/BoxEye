import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private userService = inject(UserService);

  public authService = inject(AuthService);

  usuario = signal<any>({
  nombre_usuario: '',
  correo: ''
});

  mensaje = signal('');

  editandoNombre = signal(false);
  editandoCorreo = signal(false);
  editandoPassword = signal(false);

  nuevoNombre = signal('');
  nuevoCorreo = signal('');

  passwordActual = signal('');
  nuevaPassword = signal('');
  confirmarPassword = signal('');

  ngOnInit(): void {

    this.userService.obtenerPerfil().subscribe({

      next: (data: any) => {

    this.usuario.set(data);

    this.nuevoNombre.set(data.nombre_usuario);

    this.nuevoCorreo.set(data.correo);

    },

      error: (err) => {

        console.error(err);

      }

    });

  }

  censurarCorreo(correo: string | undefined): string {

    if (!correo) return '';

    const partes = correo.split('@');

    const nombre = partes[0];

    const dominio = partes[1];

    if (nombre.length <= 2) {

      return '*@' + dominio;

    }

    return (
      nombre.substring(0, 2)
      + '*****@'
      + dominio
    );

  }

  guardarNombre() {

  this.userService.updateProfile({

    nombre_usuario: this.nuevoNombre(),
    correo: this.nuevoCorreo()

  }).subscribe({

    next: () => {

      this.usuario.update((u: any) => ({
        ...u,
        nombre_usuario: this.nuevoNombre()
      }));

      this.editandoNombre.set(false);

      this.mensaje.set(
        'Nombre actualizado'
      );

    }

  });

}

  guardarCorreo() {

  this.userService.updateProfile({

    nombre_usuario: this.nuevoNombre(),
    correo: this.nuevoCorreo()

  }).subscribe({

    next: () => {

      this.usuario.update((u: any) => ({
        ...u,
        correo: this.nuevoCorreo()
      }));

      this.editandoCorreo.set(false);

      this.mensaje.set(
        'Correo actualizado'
      );

    }

  });

}

guardarPassword() {

  if (
    this.nuevaPassword() !==
    this.confirmarPassword()
  ) {

    this.mensaje.set(
      'Las contraseñas no coinciden'
    );

    return;

  }

  this.userService.updatePassword({

    passwordActual:
      this.passwordActual(),

    nuevaPassword:
      this.nuevaPassword()

  }).subscribe({

    next: () => {

      this.mensaje.set(
        'Contraseña actualizada'
      );

      this.passwordActual.set('');
      this.nuevaPassword.set('');
      this.confirmarPassword.set('');

    },

    error: (err) => {

      this.mensaje.set(
        err.error.mensaje
      );

    }

  });

}

}