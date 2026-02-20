import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  {path: '**', redirectTo: ''},
];