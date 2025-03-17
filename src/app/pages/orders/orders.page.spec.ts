import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { OrdersPage } from './orders.page';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('OrdersPage', () => {
  let component: OrdersPage;
  let fixture: ComponentFixture<OrdersPage>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const orderSpy = jasmine.createSpyObj('OrderService', ['getOrders', 'deleteOrder']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showToast']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const modalSpy = jasmine.createSpyObj('ModalController', ['create']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        FormsModule,
        RouterTestingModule,
        OrdersPage
      ],
      providers: [
        { provide: OrderService, useValue: orderSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: ModalController, useValue: modalSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const mockOrders: Order[] = [
      {
        id: '1',
        recipientName: 'Test User',
        address: {
          street: 'Test Street',
          number: '123',
          neighborhood: 'Test Neighborhood',
          city: 'Test City',
          state: 'TS'
        },
        status: 'Pendente',
        createdAt: new Date()
      }
    ];

    orderServiceSpy.getOrders.and.returnValue(of(mockOrders));

    fixture = TestBed.createComponent(OrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(orderServiceSpy.getOrders).toHaveBeenCalled();
    expect(component.orders.length).toBe(1);
    expect(component.filteredOrders.length).toBe(1);
  });

  it('should filter orders by status', () => {
    component.selectedFilter = 'pending';
    component.filterOrders();
    expect(component.filteredOrders.length).toBe(1);

    component.selectedFilter = 'delivered';
    component.filterOrders();
    expect(component.filteredOrders.length).toBe(0);

    component.selectedFilter = 'all';
    component.filterOrders();
    expect(component.filteredOrders.length).toBe(1);
  });

  it('should search orders by term', () => {
    component.searchTerm = 'Test';
    component.searchOrders();
    expect(component.filteredOrders.length).toBe(1);

    component.searchTerm = 'NonExistent';
    component.searchOrders();
    expect(component.filteredOrders.length).toBe(0);

    component.searchTerm = '';
    component.searchOrders();
    expect(component.filteredOrders.length).toBe(1);
  });

  it('should navigate to add order page', () => {
    component.navigateToAddOrder();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/add-order');
  });
});
