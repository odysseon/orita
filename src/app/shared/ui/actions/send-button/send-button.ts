import { Component, input, output } from '@angular/core';
import { Button, ButtonAppearance, ButtonShape, ButtonSize } from '../../atoms/button/button';
import { LucideSend } from '@lucide/angular';

@Component({
  selector: 'ui-send-button',
  imports: [Button, LucideSend],
  template: `
    <button app-button 
      [appearance]="appearance()"
      [shape]="shape()" 
      [size]="size()"
      [disabled]="disabled()"
      (click)="send.emit()"
      type="button"
      aria-label="Send">
      <svg lucideSend aria-hidden="true" style="width: 18px; height: 18px;"></svg>
    </button>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class SendButton {
  appearance = input<ButtonAppearance>('ghost');
  shape = input<ButtonShape>('circle');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  
  send = output<void>();
}
