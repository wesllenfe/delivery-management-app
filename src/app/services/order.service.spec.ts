import { TestBed } from '@angular/core/testing';
import { OrderService } from './order.service';
import { StorageService } from './storage.service';
import { Order } from '../models/order.model';

describe('OrderService', () => {
  let service: OrderService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [
        OrderService,
        { provide: StorageService, useValue: spy }
      ]
    });

    service = TestBed.inject(OrderService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load orders from storage', async () => {
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

    storageServiceSpy.get.and.returnValue(Promise.resolve(mockOrders));

    await service.loadOrders();

    expect(storageServiceSpy.get).toHaveBeenCalledWith('orders');

    service.getOrders().subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });
  });

  it('should add a new order', async () => {
    const mockOrders: Order[] = [];
    storageServiceSpy.get.and.returnValue(Promise.resolve(mockOrders));

    const newOrder: Order = {
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
    };

    await service.loadOrders();
    await service.addOrder(newOrder);

    expect(storageServiceSpy.set).toHaveBeenCalled();

    service.getOrders().subscribe(orders => {
      expect(orders.length).toBe(1);
      expect(orders[0].id).toBe('1');
    });
  });

  it('should complete an order', async () => {
    const mockOrder: Order = {
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
    };

    storageServiceSpy.get.and.returnValue(Promise.resolve([mockOrder]));

    await service.loadOrders();
    await service.completeOrder('1', 'data:image/jpeg;base64,test');

    expect(storageServiceSpy.set).toHaveBeenCalled();

    service.getOrders().subscribe(orders => {
      expect(orders[0].status).toBe('Entregue');
      expect(orders[0].deliveryProofImage).toBe('data:image/jpeg;base64,test');
      expect(orders[0].deliveredAt).toBeDefined();
    });
  });
});
