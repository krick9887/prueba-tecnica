import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order'; 

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  selectedDestination: 'pickup' | 'dropoff' = 'pickup'; // 1. Switch state
  isPanelExpanded: boolean = false; // 4. Accordion state

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getAllOrders().subscribe((orders: any[]) => {
        this.order = orders.find(o => o.id == id) || orders[0];
      });
    }
  }

  // 1. Cambia entre Pickup y Dropoff
  selectDestination(type: 'pickup' | 'dropoff'): void {
    this.selectedDestination = type;
  }

  // 3. Botón Track Order solo activo si status >= 3
  isTrackEnabled(): boolean {
    return (this.order?.status_code || 0) >= 3;
  }

  onTrackOrder(): void {
    if (this.isTrackEnabled()) {
      console.log("Track Order");
    }
  }

  // 4. Conmutar panel desplegable
  togglePanel(): void {
    this.isPanelExpanded = !this.isPanelExpanded;
  }
}