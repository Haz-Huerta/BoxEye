import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { error } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private authService = inject(AuthService);

  private router = inject(Router);

  correo = signal('');

  contrasena = signal('');

  mensaje = signal('');

  

  login() {

     if (!this.correo().includes('@')) {

    this.mensaje.set('Correo inválido');
    return;

  }

  if (this.contrasena().length < 6) {

    this.mensaje.set('La contraseña debe tener mínimo 6 caracteres');
    return;

  }

    this.authService.login({

      correo: this.correo(),

      contrasena: this.contrasena()

    }).subscribe({

      next: (res) => {

        console.log(res);

        this.authService.saveToken(
          res.token
        );

        this.mensaje.set(
        'Login correcto'
      );

      console.log(
      localStorage.getItem('token')
    );

        this.authService.saveUser(res.usuario);

        this.router.navigate(['/']);

        

      },

      error: () => {

        alert('ERROR');

        this.mensaje.set(
          'Correo o contraseña incorrectos'
        );

      }

    });

  }

  

}