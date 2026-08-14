import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.html'
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  activeTab: string = 'upcoming';
  timerInterval: any;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
    // Re-evalúa el contador cada segundo
    this.timerInterval = setInterval(() => {}, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  fetchOrders(): void {
    const request = this.activeTab === 'upcoming' 
      ? this.orderService.getUpcomingOrders() 
      : this.orderService.getAllOrders();

    request.subscribe({
      next: (response: any) => {
        // Obtenemos el arreglo desde response.result
        this.orders = response?.result || [];
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error al obtener las órdenes:', err);
        this.orders = [];
        this.filteredOrders = [];
      }
    });
  }

  // 1. Filtro por order_number
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }
    this.filteredOrders = this.orders.filter(order => 
      order.order_number.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // 2. Lógica de comparación de start_date con tiempo actual
  isPickupReady(startDateTimestamp: number): boolean {
    if (!startDateTimestamp) return true;
    return Date.now() >= startDateTimestamp;
  }

  getRemainingTime(startDateTimestamp: number): string {
    if (!startDateTimestamp) return '0:00:00';
    const diff = startDateTimestamp - Date.now();
    if (diff <= 0) return '0:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onStartPickup(order: Order): void {
    if (this.isPickupReady(order.start_date)) {
      console.log("Navegar");
    }
  }

  // 3. Ir al detalle
  goToDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }
}