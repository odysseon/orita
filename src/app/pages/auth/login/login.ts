import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { form, FormField, required, email, pattern } from '@angular/forms/signals';
import { LucideLoaderCircle } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';

import { AppAuthCard } from '../../../shared/auth-card/auth-card';
import { AppFormField } from '../../../shared/form-field/form-field';
import { AppPasswordField } from '../../../shared/password-field/password-field';
import { AppGoogleSignIn } from '../../../shared/google-sign-in/google-sign-in';
import { ValidationService } from '../../../core/services/validation.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormField,
    LucideLoaderCircle,
    AppAuthCard,
    AppFormField,
    AppPasswordField,
    AppGoogleSignIn,
  ],
  templateUrl: './login.html',
  styleUrls: ['../auth.css', './login.css'],
})
export class Login {
  #auth = inject(AuthService);
  #route = inject(ActivatedRoute);
  #validation = inject(ValidationService);

  readonly loading = signal(false);

  readonly model = signal({
    email: '',
    password: '',
    remember: false,
  });

  readonly loginForm = form(this.model, (f) => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email address' });
    this.#validation.validatePassword(f.password);
  });

  readonly isFormInvalid = computed(() => this.loginForm().invalid());

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.loginForm().invalid()) return;
    this.loading.set(true);
    const returnUrl = this.#route.snapshot.queryParams['returnUrl'] || '/home';
    await this.#auth.login(this.model(), returnUrl);
    this.loading.set(false);
  }
}
