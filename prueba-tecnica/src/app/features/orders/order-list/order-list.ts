import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
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
  private routerSub: any;

  constructor(
    private orderService: OrderService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.timerInterval = setInterval(() => {
      this.cdr.markForCheck();
    }, 1000);
    this.routerSub = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects || event.url;
        if (currentUrl === '/') {
          this.fetchOrders();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.routerSub) this.routerSub.unsubscribe();
  }

  fetchOrders(): void {
    const request = this.activeTab === 'upcoming' 
      ? this.orderService.getUpcomingOrders() 
      : this.orderService.getAllOrders();

    request.subscribe({
      next: (response: any) => {
        let ordersData: any[] = [];
        if (Array.isArray(response?.result)) {
          ordersData = response.result;
        } else if (Array.isArray(response)) {
          ordersData = response;
        } else if (response?.result && typeof response.result === 'object' && !Array.isArray(response.result)) {
          ordersData = [response.result];
        }
        this.orders = ordersData;
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error al obtener las órdenes:', err);
        this.orders = [];
        this.filteredOrders = [];
      }
    });
  }
  applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredOrders = [...this.orders];
      return;
    }
    this.filteredOrders = this.orders.filter(order => 
      order.order_number.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
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
  goToDetails(orderId: string): void {
    if (!orderId) {
      return;
    }

    this.router.navigate(['/orders', orderId]);
  }
}