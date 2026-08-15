import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { OrderDetailComponent } from './order-detail';
import { OrderService } from '../../../core/services/order';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: 'order-123' })),
          },
        },
        {
          provide: OrderService,
          useValue: {
            getAllOrders: () =>
              of([
                {
                  _id: 'order-123',
                  order_number: 'A-100',
                  destinations: [],
                  status_list: { pickup: [], dropoff: [] },
                },
              ]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load the order when the route id matches the order _id', () => {
    expect(component.order).toBeTruthy();
    expect(component.order._id).toBe('order-123');
  });
});
