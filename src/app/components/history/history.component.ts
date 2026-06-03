import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import {
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {

  pedidos: any[] = [];

  constructor(
  private userService: UserService,
  private cdr: ChangeDetectorRef
) {

  this.cargarHistorial();

}

  cargarHistorial() {

  this.userService.obtenerHistorial().subscribe({

    next: (res: any) => {

      console.log('Historial:', res);

      this.pedidos = res;

      this.cdr.detectChanges();

    },

    error: (err) => {

      console.error(err);

    }

  });

}

}