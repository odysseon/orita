import { Component, input, signal } from '@angular/core';
import { Field } from '@angular/forms/signals';
import { FormField } from '@angular/forms/signals';
import { LucideEye, LucideEyeOff } from '@lucide/angular';
import { AppFormField } from '../form-field/form-field';

@Component({
  selector: 'app-password-field',
  imports: [AppFormField, FormField, LucideEye, LucideEyeOff],
  template: `
    <app-form-field
      [label]="label()"
      [fieldId]="fieldId()"
      [touched]="touched()"
      [invalid]="invalid()"
      [errorMessage]="errorMessage()"
    >
      <div class="field__input-wrap">
        <input
          [id]="fieldId()"
          class="field__input field__input--padded"
          [type]="showPassword() ? 'text' : 'password'"
          [formField]="formField()"
          [class.field__input--error]="touched() && invalid()"
        />
        <button
          class="field__toggle"
          type="button"
          [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
          (click)="togglePassword()"
        >
          @if (showPassword()) {
            <svg lucideEyeOff aria-hidden="true"></svg>
          } @else {
            <svg lucideEye aria-hidden="true"></svg>
          }
        </button>
      </div>
    </app-form-field>
  `,
  styles: [':host { display: contents; }'],
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
