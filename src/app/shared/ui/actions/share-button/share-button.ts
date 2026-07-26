import { Component, input, output } from '@angular/core';
import { Button, ButtonAppearance, ButtonShape, ButtonSize } from '../../atoms/button/button';
import { LucideSend } from '@lucide/angular';

@Component({
  selector: 'ui-share-button',
  standalone: true,
  imports: [Button, LucideSend],
  template: `
    <button app-button 
      [appearance]="appearance()"
      [shape]="shape()" 
      [size]="size()"
      [disabled]="disabled()"
      (click)="share.emit()"
      type="button"
      aria-label="Share">
      <svg lucideSend aria-hidden="true"></svg>
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
