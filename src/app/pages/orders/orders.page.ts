import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Router, RouterModule } from '@angular/router';
import { OrderDetailsComponent } from '../../components/order-details/order-details.component';
import { CompleteOrderComponent } from '../../components/complete-order/complete-order.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    OrderDetailsComponent,
    CompleteOrderComponent
  ]
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedFilter: string = 'all';
  searchTerm: string = '';

  // Stats
  totalOrders: number = 0;
  pendingOrders: number = 0;
  deliveredOrders: number = 0;
  isLoading: boolean = true;

  constructor(
    private orderService: OrderService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  ionViewWillEnter() {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.filterOrders();
      this.updateStats();
      this.isLoading = false;
    });
  }

  filterOrders() {
    switch (this.selectedFilter) {
      case 'pending':
        this.filteredOrders = this.orders.filter(order => order.status === 'Pendente');
        break;
      case 'delivered':
        this.filteredOrders = this.orders.filter(order => order.status === 'Entregue');
        break;
      default:
        this.filteredOrders = [...this.orders];
        break;
    }

    // Apply search if there's a search term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.searchOrders();
    }
  }

  searchOrders() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filterOrders();
      return;
    }

    const term = this.searchTerm.toLowerCase();
    // Start with the filtered orders based on status
    const statusFiltered = [...this.filteredOrders];

    this.filteredOrders = statusFiltered.filter(order =>
      order.recipientName.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term) ||
      order.address.street.toLowerCase().includes(term) ||
      order.address.city.toLowerCase().includes(term) ||
      order.address.neighborhood.toLowerCase().includes(term)
    );
  }

  updateStats() {
    this.totalOrders = this.orders.length;
    this.pendingOrders = this.orders.filter(order => order.status === 'Pendente').length;
    this.deliveredOrders = this.orders.filter(order => order.status === 'Entregue').length;
  }

  editOrder(order: Order) {
    this.router.navigate(['/edit-order', order.id]);
  }

  async completeOrder(order: Order) {
    const modal = await this.modalController.create({
      component: CompleteOrderComponent,
      componentProps: {
        order
      },
      cssClass: 'modern-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data && data.completed) {
      this.toastService.showToast('Pedido concluído com sucesso!');
      this.loadOrders();
    }
  }

  async deleteOrder(order: Order) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: `Tem certeza que deseja excluir o pedido para ${order.recipientName}?`,
      cssClass: 'modern-alert',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Excluir',
          cssClass: 'delete-button',
          handler: async () => {
            await this.orderService.deleteOrder(order.id);
            this.toastService.showToast('Pedido excluído com sucesso!');
            this.loadOrders();
          }
        }
      ]
    });

    await alert.present();
  }

  async showOrderDetails(order: Order) {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: {
        order
      },
      cssClass: 'modern-modal'
    });

    await modal.present();
  }

  navigateToAddOrder() {
    this.router.navigateByUrl('/add-order');
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterOrders();
  }
}
