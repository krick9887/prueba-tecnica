import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders';

  constructor() {}

  private fetchJson<T>(url: string): Promise<T> {
    return fetch(url).then(res => {
      if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
      return res.json();
    });
  }

  getAllOrders(): Observable<Order[]> {
    return from(this.fetchJson<Order[]>(this.baseUrl));
  }
  

  getUpcomingOrders(): Observable<Order[]> {
    return from(this.fetchJson<Order[]>(`${this.baseUrl}/upcoming`));
  }
}