import { Component, input, output } from '@angular/core';
import { Button, ButtonAppearance } from '../../atoms/button/button';
import { LucideBookmark } from '@lucide/angular';

@Component({
  selector: 'ui-save-button',
  standalone: true,
  imports: [Button, LucideBookmark],
  template: `
    <button app-button 
      intent="secondary"
      [appearance]="appearance()"
      shape="circle" 
      size="icon"
      (click)="toggle.emit()">
      <svg lucideBookmark [class.is-saved]="isSaved()"></svg>
    </button>
  `,
  styles: [`
    :host {
      display: contents; /* Let button handle positioning */
    }
    .is-saved {
      fill: currentColor; /* Filled bookmark icon when saved */
    }
  `]
})
export class SaveButton {
  isSaved = input.required<boolean>();
  
  // Defaults to glass because it's most commonly used over media in cards.
  // Can be set to 'ghost' or 'soft' in standard UIs.
  appearance = input<ButtonAppearance>('glass');
  
  toggle = output<void>();
}
