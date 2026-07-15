import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.html',
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
