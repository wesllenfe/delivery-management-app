import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class OrderDetailsComponent implements OnInit {
  @Input() order!: Order;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
}
