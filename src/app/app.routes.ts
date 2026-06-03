import { Routes } from '@angular/router';

import { CatalogoComponent } from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { authGuard } from './components/core/auth.guard';
import { adminGuard } from './components/core/admin.guard';
import { InventarioComponent } from './components/inventario/inventario.component';

export const routes: Routes = [

  {
    path: '',
    component: CatalogoComponent
  },

  {
    path: 'carrito',
    component: CarritoComponent
  },

  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard]
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'registro',
    loadComponent: () =>
      import('./components/register/register.component')
        .then(m => m.RegisterComponent)
  },

  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/profile/profile.component')
        .then(m => m.ProfileComponent)
  },

  {
    path: 'historial',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/history/history.component')
        .then(m => m.HistoryComponent)
  },

  {

  path: 'inventario',
  component: InventarioComponent,
  canActivate: [adminGuard]

  },

  {
  path: 'recuperar-password',
  loadComponent: () =>
    import('./components/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
} ,

{
  path: 'reset-password/:token',
  loadComponent: () =>
    import('./components/reset-password/reset-password.component')
      .then(m => m.ResetPasswordComponent)
},

  {
    path: '**',
    redirectTo: ''
  }

];