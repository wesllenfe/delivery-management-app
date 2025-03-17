import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { CepService } from '../../services/cep.service';
import { Order } from '../../models/order.model';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AddOrderPage implements OnInit {
  orderForm: FormGroup;
  isLoadingAddress: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private toastService: ToastService,
    private router: Router,
    private cepService: CepService
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

  ngOnInit() {}

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
    if (this.orderForm.valid) {
      this.isSubmitting = true;
      const formValue = this.orderForm.value;

      const order: Order = {
        id: formValue.id,
        recipientName: formValue.recipientName,
        address: {
          street: formValue.address.street,
          number: formValue.address.number,
          neighborhood: formValue.address.neighborhood,
          city: formValue.address.city,
          state: formValue.address.state,
          zipCode: formValue.zipCode
        },
        status: 'Pendente',
        createdAt: new Date()
      };

      await this.orderService.addOrder(order);
      this.isSubmitting = false;
      this.toastService.showToast('Pedido adicionado com sucesso!');
      this.router.navigate(['/orders']);
    } else {
      this.orderForm.markAllAsTouched();
      this.toastService.showToast('Por favor, preencha todos os campos obrigatórios');
    }
  }
}
