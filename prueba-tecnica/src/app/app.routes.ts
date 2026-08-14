import { Routes } from '@angular/router';
import { OrderListComponent } from './features/orders/order-list/order-list';
import { OrderDetailComponent } from './features/orders/order-list/order-detail';

export const routes: Routes = [
  { path: '', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: '**', redirectTo: '' }
];