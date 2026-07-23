import { Component, input, computed, booleanAttribute, ViewEncapsulation } from '@angular/core';

export type FormFieldOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-invalid]': 'invalid() ? "true" : null',
    '[attr.data-disabled]': 'disabled() ? "true" : null'
  }
})
export class FormField {
  label = input.required<string>();
  fieldId = input.required<string>();
  
  description = input<string>();
  hint = input<string>();
  errorMessage = input<string>();
  
  orientation = input<FormFieldOrientation>('vertical');
  
  required = input<boolean, unknown>(false, { transform: booleanAttribute });
  optional = input<boolean, unknown>(false, { transform: booleanAttribute });
  disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  invalid = input<boolean, unknown>(false, { transform: booleanAttribute });
  hideLabel = input<boolean, unknown>(false, { transform: booleanAttribute });

  classes = computed(() => {
    const classList = ['form-field', `form-field--${this.orientation()}`];
    
    if (this.disabled()) classList.push('is-disabled');
    if (this.invalid()) classList.push('is-invalid');
    
    return classList.join(' ');
  });
}
