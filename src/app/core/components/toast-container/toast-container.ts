import { Component, inject } from '@angular/core';
import {
  LucideCircleCheck,
  LucideCircleX,
  LucideInfo,
  LucideTriangleAlert,
  LucideX,
} from '@lucide/angular';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast-container',
  imports: [LucideCircleCheck, LucideCircleX, LucideInfo, LucideTriangleAlert, LucideX],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  readonly toastService = inject(ToastService);

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
