import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
    private cdr: ChangeDetectorRef // 1. Inyectamos ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // 2. Nos suscribimos a los parámetros de la ruta para reaccionar al cambio
    this.route.params.subscribe(() => {
      this.fetchOrderDetail();
    });
  }

  fetchOrderDetail(): void {
    this.isLoading = true;
    
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        // Asignamos la respuesta
        this.order = response?.result || response;
        this.isLoading = false;
        
        // 3. Forzamos la detección de cambios para renderizar el HTML de inmediato
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando el detalle:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
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
}