import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';
import { LucideLoaderCircle } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { IRegister } from './register.interface';

import { AppAuthCard } from '../../../shared/auth-card/auth-card';
import { AppFormField } from '../../../shared/ui/atoms/form-field/form-field';
import { AppPasswordField } from '../../../shared/password-field/password-field';
import { AppGoogleSignIn } from '../../../shared/google-sign-in/google-sign-in';
import { ValidationService } from '../../../core/services/validation.service';

import { Button } from '../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-register',
  imports: [FormField, 
    AppFormField,
    LucideLoaderCircle,
    AppAuthCard,
    AppFormField,
    AppPasswordField,
    AppGoogleSignIn,
    Button,
  ],
  templateUrl: './register.html',
  styleUrls: ['../auth.css'],
})
export class Register {
  #auth = inject(AuthService);
  #validation = inject(ValidationService);

  readonly loading = signal(false);

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
    this.#validation.validatePassword(f.password);
  });

  readonly isFormInvalid = computed(() => this.registerForm().invalid());

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.registerForm().invalid()) {
      this.registerForm().markAsTouched();
      return;
    }
    this.loading.set(true);
    await this.#auth.register(this.model());
    this.loading.set(false);
  }
}
