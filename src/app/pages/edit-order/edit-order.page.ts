import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { CepService } from '../../services/cep.service';
import { Order } from '../../models/order.model';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CompleteOrderComponent } from '../../components/complete-order/complete-order.component';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.page.html',
  styleUrls: ['./edit-order.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, CompleteOrderComponent]
})
export class EditOrderPage implements OnInit {
  orderForm: FormGroup;
  orderId: string = '';
  orderLoaded: boolean = false;
  originalOrder: Order | undefined;
  isLoadingAddress: boolean = false;
  isSubmitting: boolean = false;
  completeAfterSave: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private modalController: ModalController
  ) {
    this.orderForm = this.formBuilder.group({
      id: ['', Validators.required],
      recipientName: ['', Validators.required],
      zipCode: [''],
      address: this.formBuilder.group({
        street: ['', Validators.required],
        number: ['', Validators.required],
        neighborhood: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required]
      }),
      status: ['Pendente']
    });
  }

  async ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      await this.loadOrder();
    } else {
      this.router.navigate(['/orders']);
    }
  }

  async loadOrder() {
    try {
      const order = await this.orderService.getOrderById(this.orderId);
      if (order) {
        this.originalOrder = order;
        this.orderForm.patchValue({
          id: order.id,
          recipientName: order.recipientName,
          zipCode: order.address.zipCode || '',
          address: {
            street: order.address.street,
            number: order.address.number,
            neighborhood: order.address.neighborhood,
            city: order.address.city,
            state: order.address.state
          }
        });
        this.orderLoaded = true;
      } else {
        this.toastService.showToast('Pedido não encontrado');
        this.router.navigate(['/orders']);
      }
    } catch (error) {
      console.error('Error loading order', error);
      this.toastService.showToast('Erro ao carregar o pedido');
      this.router.navigate(['/orders']);
    }
  }

  searchCep() {
    const cep = this.orderForm.get('zipCode')?.value;
    if (cep && cep.length === 8) {
      this.isLoadingAddress = true;
      this.cepService.getAddressByCep(cep).subscribe(
        (data) => {
          this.orderForm.get('address')?.patchValue({
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          });
          this.isLoadingAddress = false;
        },
        (error) => {
          console.error('Error fetching CEP', error);
          this.toastService.showToast('CEP não encontrado');
          this.isLoadingAddress = false;
        }
      );
    }
  }

  async onSubmit() {
    if (this.orderForm.valid && this.originalOrder) {
      this.isSubmitting = true;
      const formValue = this.orderForm.value;

      const updatedOrder: Order = {
        ...this.originalOrder,
        recipientName: formValue.recipientName,
        address: {
          street: formValue.address.street,
          number: formValue.address.number,
          neighborhood: formValue.address.neighborhood,
          city: formValue.address.city,
          state: formValue.address.state,
          zipCode: formValue.zipCode
        }
      };

      await this.orderService.updateOrder(updatedOrder);
      this.isSubmitting = false;
      this.toastService.showToast('Pedido atualizado com sucesso!');

      if (this.completeAfterSave && updatedOrder.status === 'Pendente') {
        this.openCompleteOrderModal(updatedOrder);
      } else {
        this.router.navigate(['/orders']);
      }
    } else {
      this.orderForm.markAllAsTouched();
      this.toastService.showToast('Por favor, preencha todos os campos obrigatórios');
    }
  }

  async openCompleteOrderModal(order: Order) {
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
    }
    this.router.navigate(['/orders']);
  }

  onCompleteAfterSaveChange(event: any) {
    this.completeAfterSave = event.detail.checked;
  }
}
