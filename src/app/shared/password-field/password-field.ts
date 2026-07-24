import { Component, input, signal } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';
import { InputDirective } from '../ui/atoms/forms';
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { AppFormField } from '../ui/atoms/form-field/form-field';

@Component({
  selector: 'app-password-field',
  imports: [FormField, AppFormField, InputDirective, LucideEye, LucideEyeOff],
  templateUrl: './password-field.html',
  styleUrl: './password-field.css',
})
export class AppPasswordField {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly formField = input.required<Field<string, any>>();
  readonly touched = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errorMessage = input<string | undefined>();

  readonly showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
