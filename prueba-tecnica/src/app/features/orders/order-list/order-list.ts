import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html'
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchTerm: string = '';
  activeTab: string = 'upcoming'; // 'upcoming' | 'completed' | 'past'
  timerInterval: any;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOrders();
    // Actualiza la cuenta regresiva cada segundo
    this.timerInterval = setInterval(() => this.updateTimers(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  fetchOrders(): void {
    const request = this.activeTab === 'upcoming' 
      ? this.orderService.getUpcomingOrders() 
      : this.orderService.getAllOrders();

    request.subscribe({
      next: (data: any) => {
        this.orders = data;
        this.applyFilter();
      },
      error: (err) => console.error(err)
    });
  }

  // 1.- Filtro por número de orden
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }
    this.filteredOrders = this.orders.filter(order => 
      (order.order_number || order.id || '')
        .toString()
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  // 2.- Comparación de start_date con tiempo actual
  isPickupReady(startDateStr: string): boolean {
    if (!startDateStr) return true;
    return new Date().getTime() >= new Date(startDateStr).getTime();
  }

  getRemainingTime(startDateStr: string): string {
    if (!startDateStr) return '0:00:00';
    const diff = new Date(startDateStr).getTime() - new Date().getTime();
    if (diff <= 0) return '0:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  onStartPickup(order: any): void {
    if (this.isPickupReady(order.start_date)) {
      console.log("Navegar");
    }
  }

  // 3.- Ir al detalle
  goToDetails(orderId: string | number): void {
    this.router.navigate(['/orders', orderId]);
  }

  updateTimers(): void {
    // Forzar detección de cambios para los contadores si es necesario
  }
}