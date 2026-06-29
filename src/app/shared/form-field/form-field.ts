import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  imports: [],
  template: `
    <div class="field">
      <label class="field__label" [for]="fieldId()">
        {{ label() }}
        @if (hint()) {
          <span class="field__label-hint">{{ hint() }}</span>
        }
      </label>
      <ng-content />
      @if (touched() && invalid() && errorMessage()) {
        <p class="field__error" role="alert">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styleUrl: './form-field.css',
})
export class AppFormField {
  readonly label = input.required<string>();
  readonly fieldId = input.required<string>();
  readonly hint = input<string>();
  readonly touched = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errorMessage = input<string | undefined>();
}
