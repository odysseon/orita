import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../../core/services/toast';
import { environment } from '../../../../environments/environment';
import { LucideArrowLeft } from '@lucide/angular';

import { Button } from '../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideArrowLeft, Button],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email = signal('');
  loading = signal(false);
  success = signal(false);

  #http = inject(HttpClient);
  #toast = inject(ToastService);

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.email()) return;

    this.loading.set(true);
    try {
      await this.#http.post(`${environment.apiUrl}/auth/forgot-password`, { email: this.email() }).toPromise();
      this.success.set(true);
      this.#toast.success('Check your email', 'We have sent a password reset link to your email address.');
    } catch (err) {
      const msg = err instanceof HttpErrorResponse ? err.error?.message : 'Something went wrong';
      // In many secure systems, forgot-password always returns 200 to prevent user enumeration
      // We will assume success visually even if not found to prevent enumeration if the backend returns 404
      this.success.set(true);
      this.#toast.success('Check your email', 'We have sent a password reset link to your email address.');
    } finally {
      this.loading.set(false);
    }
  }
}
