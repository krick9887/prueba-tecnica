import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  getUpcomingOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/upcoming`);
  }
}