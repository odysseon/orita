import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { LucideMapPin, LucideEye, LucideEyeOff, LucideLoaderCircle } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { IRegister } from './register.interface';

@Component({
  selector: 'app-register',
  imports: [FormField, LucideMapPin, LucideEye, LucideEyeOff, LucideLoaderCircle],
  templateUrl: './register.html',
  styleUrls: ['../auth.css', './register.css'],
  encapsulation: ViewEncapsulation.None,
})
export class Register {
  #auth = inject(AuthService);

  readonly loading = signal(false);
  readonly showPassword = signal(false);

  readonly model = signal<IRegister>({
    username: '',
    email: '',
    password: '',
  });

  readonly registerForm = form(this.model, (f) => {
    required(f.username, { message: 'Username is required' });
    minLength(f.username, 2, { message: 'Username must be at least 2 characters' });
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email address' });
    required(f.password, { message: 'Password is required' });
    minLength(f.password, 8, { message: 'Password must be at least 8 characters' });
  });

  readonly isFormInvalid = computed(() => this.registerForm().invalid());

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.registerForm().invalid()) return;
    this.loading.set(true);
    await this.#auth.register(this.model());
    this.loading.set(false);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
