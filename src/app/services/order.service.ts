import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Order } from '../models/order.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor(private storageService: StorageService) {
    this.loadOrders();
  }

  async loadOrders() {
    const orders = await this.storageService.get('orders') || [];
    this.orders = orders;
    this.ordersSubject.next(this.orders);
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    await this.loadOrders();
    return this.orders.find(order => order.id === id);
  }

  async addOrder(order: Order): Promise<void> {
    this.orders.push({
      ...order,
      createdAt: new Date()
    });
    await this.saveOrders();
  }

  async updateOrder(updatedOrder: Order): Promise<void> {
    const index = this.orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
      await this.saveOrders();
    }
  }

  async completeOrder(id: string, deliveryProofImage: string): Promise<void> {
    const index = this.orders.findIndex(order => order.id === id);
    if (index !== -1 && this.orders[index].status === 'Pendente') {
      this.orders[index] = {
        ...this.orders[index],
        status: 'Entregue',
        deliveredAt: new Date(),
        deliveryProofImage
      };
      await this.saveOrders();
    }
  }

  async deleteOrder(id: string): Promise<void> {
    this.orders = this.orders.filter(order => order.id !== id);
    await this.saveOrders();
  }

  private async saveOrders(): Promise<void> {
    await this.storageService.set('orders', this.orders);
    this.ordersSubject.next(this.orders);
  }
}
