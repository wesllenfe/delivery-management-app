import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  constructor() {}

  async takePicture(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || '';
    } catch (error) {
      console.error('Error taking picture', error);
      return '';
    }
  }
}
