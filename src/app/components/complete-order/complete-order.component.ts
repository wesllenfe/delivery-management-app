import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { Order } from '../../models/order.model';
import { CameraService } from '../../services/camera.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CompleteOrderComponent implements OnInit {
  @Input() order!: Order;
  deliveryProofImage: string = '';
  isLoading: boolean = false;

  constructor(
    private modalController: ModalController,
    private cameraService: CameraService,
    private orderService: OrderService
  ) {}

  ngOnInit() {}

  async takePicture() {
    try {
      const imageData = await this.cameraService.takePicture();
      if (imageData) {
        this.deliveryProofImage = imageData;
      }
    } catch (error) {
      console.error('Error taking picture', error);
    }
  }

  async completeOrder() {
    if (this.deliveryProofImage) {
      this.isLoading = true;
      await this.orderService.completeOrder(this.order.id, this.deliveryProofImage);
      this.isLoading = false;
      this.modalController.dismiss({
        completed: true
      });
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
