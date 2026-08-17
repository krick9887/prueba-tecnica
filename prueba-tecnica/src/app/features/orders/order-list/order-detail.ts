import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.html'
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  selectedDestinationIndex: number = 0; // 0 = Pickup, 1 = Dropoff
  isPanelExpanded: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef, // 1. Inyectamos ChangeDetectorRef
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      this.fetchOrderDetail(orderId);
    });
  }

  fetchOrderDetail(orderId: string | null): void {
    if (!orderId) {
      this.isLoading = false;
      this.order = null;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    forkJoin({
      all: this.orderService.getAllOrders(),
      upcoming: this.orderService.getUpcomingOrders()
    }).subscribe({
      next: ({ all, upcoming }) => {
        const allOrders = [
          ...this.normalizeOrders(all),
          ...this.normalizeOrders(upcoming)
        ];

        const uniqueOrders = allOrders.filter((order, index, array) => {
          const firstMatchIndex = array.findIndex((item) => {
            const sameId = item?._id && order?._id && String(item._id) === String(order._id);
            const sameNumber = item?.order_number && order?.order_number && String(item.order_number) === String(order.order_number);
            return sameId || sameNumber;
          });

          return firstMatchIndex === index;
        });

        this.order = uniqueOrders.find((o) => {
          const matchesId = o?._id && String(o._id) === String(orderId);
          const matchesOrderNumber = o?.order_number && String(o.order_number) === String(orderId);
          return matchesId || matchesOrderNumber;
        }) ?? null;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando el detalle:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private normalizeOrders(response: any): any[] {
    if (Array.isArray(response?.result)) {
      return response.result;
    }

    if (Array.isArray(response)) {
      return response;
    }

    if (response?.result && typeof response.result === 'object') {
      return [response.result];
    }

    if (response && typeof response === 'object') {
      return [response];
    }

    return [];
  }

  selectDestination(index: number): void {
    this.selectedDestinationIndex = index;
  }

  get currentDestination(): any {
    return this.order?.destinations?.[this.selectedDestinationIndex] || null;
  }

  isTrackEnabled(): boolean {
    return (this.order?.status || 0) >= 3;
  }

  onTrackOrder(): void {
    if (this.isTrackEnabled()) {
      console.log("Track Order clickeado");
    }
  }

  togglePanel(): void {
    this.isPanelExpanded = !this.isPanelExpanded;
  }
  onBack(): void {
    this.orderService.getUpcomingOrders().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}