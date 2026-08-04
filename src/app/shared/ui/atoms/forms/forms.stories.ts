import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { InputDirective, TextareaDirective, CheckboxDirective, RadioDirective, SwitchDirective, SelectDirective } from './index';
import { AppFormField } from '../form-field/form-field';

@Component({
  selector: 'app-forms-story',
  standalone: true,
  imports: [
    InputDirective, TextareaDirective, CheckboxDirective, 
    RadioDirective, SwitchDirective, SelectDirective, 
    AppFormField
  ],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page); font-family: sans-serif; max-width: 600px;">
      
      <section>
        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">1. Text Input</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <app-form-field label="Username" fieldId="username-input" hint="This is a standard input">
            <input type="text" id="username-input" app-input placeholder="Enter username..." />
          </app-form-field>

          <app-form-field label="Disabled Input" fieldId="disabled-input" [disabled]="true">
            <input type="text" id="disabled-input" app-input disabled value="Cannot edit me" />
          </app-form-field>

          <app-form-field label="Error Input" fieldId="error-input" [invalid]="true" errorMessage="This field is required.">
            <input type="text" id="error-input" app-input [attr.aria-invalid]="true" />
          </app-form-field>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">2. Textarea (Auto-resizing)</h3>
        <app-form-field label="Bio" fieldId="bio-textarea" hint="Try typing multiple lines. It auto-resizes!">
          <textarea id="bio-textarea" app-textarea placeholder="Tell us about yourself..." [value]="bioValue()" (input)="bioValue.set($any($event.target).value)"></textarea>
        </app-form-field>
        <button (click)="bioValue.set('Programmatic update!\nSecond line.\nThird line.')" style="margin-top: 1rem; padding: 0.5rem; cursor: pointer;">
          Trigger Programmatic Update
        </button>
      </section>

      <section>
        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">3. Select</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <app-form-field label="Country" fieldId="country-select">
            <select id="country-select" app-select>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="mx">Mexico</option>
            </select>
          </app-form-field>

          <app-form-field label="Disabled Select" fieldId="disabled-select" [disabled]="true">
            <select id="disabled-select" app-select disabled>
              <option>Cannot select</option>
            </select>
          </app-form-field>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">4. Checkbox & Radio (Custom CSS, Native Inputs)</h3>
        
        <div style="display: flex; gap: 3rem; margin-bottom: 2rem;">
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
              <input type="checkbox" app-checkbox /> Default Checkbox
            </label>
            
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
              <input type="checkbox" app-checkbox checked /> Checked Checkbox
            </label>

            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
              <input type="checkbox" app-checkbox [indeterminate]="true" /> Indeterminate
            </label>
            
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: not-allowed; opacity: 0.7;">
              <input type="checkbox" app-checkbox disabled checked /> Disabled Checked
            </label>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
              <input type="radio" name="demo-radio" app-radio /> Option 1
            </label>
            
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
              <input type="radio" name="demo-radio" app-radio checked /> Option 2
            </label>
            
            <label style="display: flex; align-items: center; gap: 0.75rem; cursor: not-allowed; opacity: 0.7;">
              <input type="radio" name="demo-radio2" app-radio disabled checked /> Disabled Radio
            </label>
          </div>
        </div>

        <h4 style="margin-bottom: 1rem; color: var(--text-secondary);">Checkbox Regression Grid: Shapes & Appearances</h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; background: var(--surface-card); padding: 1.5rem; border: var(--size-1) solid var(--border-subtle); border-radius: var(--radius-lg);">
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <span style="font-size: 0.85rem; font-weight: bold; color: var(--text-muted);">Solid (Default)</span>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox size="sm" checked /> Small Square
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox size="md" checked /> Medium Square
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox size="lg" checked /> Large Square
            </label>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <span style="font-size: 0.85rem; font-weight: bold; color: var(--text-muted);">Circular Shape (Ghost & Plain)</span>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox shape="circle" appearance="ghost" size="sm" checked /> Ghost Circle (sm)
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox shape="circle" appearance="ghost" size="md" checked /> Ghost Circle (md)
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox shape="circle" appearance="plain" size="lg" /> Plain Circle Unchecked (lg)
            </label>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <span style="font-size: 0.85rem; font-weight: bold; color: var(--text-muted);">States & Variations</span>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox shape="circle" appearance="solid" [indeterminate]="true" /> Circular Indeterminate
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: not-allowed; opacity: 0.5;">
              <input type="checkbox" app-checkbox shape="circle" appearance="ghost" checked disabled /> Disabled Circle
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input type="checkbox" app-checkbox shape="circle" [attr.aria-invalid]="true" /> Error Circle
            </label>
          </div>
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1.5rem; color: var(--text-primary);">5. Switch</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
            <input type="checkbox" app-switch /> Airplane Mode
          </label>
          
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
            <input type="checkbox" app-switch checked /> Wi-Fi
          </label>
          
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: not-allowed; opacity: 0.7;">
            <input type="checkbox" app-switch disabled checked /> Disabled Switch
          </label>
        </div>
      </section>

    </div>
  `
})
class FormsStoryComponent {
  bioValue = signal('');
}

const meta: Meta<FormsStoryComponent> = {
  title: 'Atoms/Forms',
  component: FormsStoryComponent,
};
export default meta;

export const Showcase: StoryObj<FormsStoryComponent> = {
  render: () => ({
    moduleMetadata: {
      imports: [FormsStoryComponent],
    },
    template: `<app-forms-story />`,
  }),
};
