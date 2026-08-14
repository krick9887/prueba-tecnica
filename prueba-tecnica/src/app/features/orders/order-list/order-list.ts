import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order'; 
import { Order } from '../../../core/models/order';
import { AvatarComponent } from '../../../shared/components/avatar/avatar';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, AvatarComponent],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  upcomingOrders: Order[] = [];
  isLoading: boolean = true;
  errorMsg: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    
    // Carga de todos los pedidos
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.errorMsg = 'No se pudieron cargar los pedidos.';
        this.isLoading = false;
      }
    });

    // Carga de pedidos próximos
    this.orderService.getUpcomingOrders().subscribe({
      next: (data) => {
        this.upcomingOrders = data;
      },
      error: (err) => console.error('Error cargando pedidos próximos:', err)
    });
  }
}