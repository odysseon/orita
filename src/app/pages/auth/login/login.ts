import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';
import { LucideMapPin, LucideEye, LucideEyeOff, LucideLoaderCircle } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormField, LucideMapPin, LucideEye, LucideEyeOff, LucideLoaderCircle],
  templateUrl: './login.html',
  styleUrls: ['../auth.css', './login.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Login {
  #auth = inject(AuthService);

  readonly loading = signal(false);
  readonly showPassword = signal(false);

  readonly model = signal({
    email: '',
    password: '',
    remember: false,
  });

  readonly loginForm = form(this.model, (f) => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email address' });
    required(f.password, { message: 'Password is required' });
  });

  readonly isFormInvalid = computed(() => this.loginForm().invalid());

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
    this.loading.set(true);
    await this.#auth.login(this.model());
    this.loading.set(false);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
