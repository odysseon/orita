import { Component, computed, inject, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { form, FormField, required, email, pattern } from '@angular/forms/signals';
import { LucideLoaderCircle } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';

import { AppAuthCard } from '../../../shared/auth-card/auth-card';
import { AppFormField } from '../../../shared/form-field/form-field';
import { AppPasswordField } from '../../../shared/password-field/password-field';
import { AppGoogleSignIn } from '../../../shared/google-sign-in/google-sign-in';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormField, LucideLoaderCircle, AppAuthCard, AppFormField, AppPasswordField, AppGoogleSignIn],
  templateUrl: './login.html',
  styleUrls: ['../auth.css', './login.css'],
})
export class Login {
  #auth = inject(AuthService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  readonly loading = signal(false);

  readonly model = signal({
    email: '',
    password: '',
    remember: false,
  });

  readonly loginForm = form(this.model, (f) => {
    required(f.email, { message: 'Email is required' });
    email(f.email, { message: 'Enter a valid email address' });
    required(f.password, { message: 'Password is required' });
    pattern(f.password, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
      message:
        'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.',
    });
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
