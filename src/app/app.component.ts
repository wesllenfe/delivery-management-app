import { Component } from '@angular/core';
import { StorageService } from './services/storage.service';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class AppComponent {
  constructor(private storageService: StorageService) {
    this.initializeApp();
  }

  async initializeApp() {
    // Initialize PWA elements for camera
    defineCustomElements(window);
    // Initialize storage
    await this.storageService.init();
  }
}
