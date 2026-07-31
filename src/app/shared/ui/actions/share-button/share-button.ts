import { Component, input, output } from '@angular/core';
import { Button, ButtonAppearance, ButtonShape, ButtonSize } from '../../atoms/button/button';
import { LucideShare2 } from '@lucide/angular';

@Component({
  selector: 'ui-share-button',
  standalone: true,
  imports: [Button, LucideShare2],
  template: `
    <button app-button 
      [appearance]="appearance()"
      [shape]="shape()" 
      [size]="size()"
      [disabled]="disabled()"
      (click)="share.emit()"
      type="button"
      aria-label="Share">
      <svg lucideShare2 aria-hidden="true" style="width: 18px; height: 18px;"></svg>
    </button>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class ShareButton {
  appearance = input<ButtonAppearance>('ghost');
  shape = input<ButtonShape>('circle');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  
  share = output<void>();
}
