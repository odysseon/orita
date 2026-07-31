import { Component, input, inject } from '@angular/core';
import { Button, ButtonAppearance, ButtonIntent, ButtonSize, ButtonShape } from '../../atoms/button/button';
import { LucideMessageCircle } from '@lucide/angular';
import { MessagingFacade } from '../../../../core/services/messaging.facade';

@Component({
  selector: 'ui-message-button',
  standalone: true,
  imports: [Button, LucideMessageCircle],
  template: `
    <button app-button 
      [intent]="intent()"
      [appearance]="appearance()"
      [size]="size()"
      [shape]="shape()"
      [fullWidth]="fullWidth()"
      [disabled]="disabled() || !businessId()"
      (click)="$event.stopPropagation(); $event.preventDefault(); onMessage()"
      type="button"
      aria-label="Message">
      @if (showIcon()) {
        <svg lucideMessageCircle [style.margin-right]="showLabel() ? 'var(--size-4)' : '0'" aria-hidden="true"></svg>
      }
      @if (showLabel()) {
        {{ label() }}
      }
    </button>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class MessageButton {
  #messagingFacade = inject(MessagingFacade);

  businessId = input.required<string>();
  embedType = input<'LISTING' | 'BUSINESS' | 'TOUR' | undefined>(undefined);
  targetId = input<string | undefined>(undefined);

  intent = input<ButtonIntent>('secondary');
  appearance = input<ButtonAppearance>('outline');
  size = input<ButtonSize>('sm');
  shape = input<ButtonShape>('default');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  
  showIcon = input<boolean>(true);
  showLabel = input<boolean>(true);
  label = input<string>('Message');

  onMessage(): void {
    const bizId = this.businessId();
    if (!bizId) return;

    const embedType = this.embedType();
    const targetId = this.targetId();

    if (embedType && targetId) {
      this.#messagingFacade.messageBusiness(bizId, {
        embedType,
        targetId
      });
    } else {
      this.#messagingFacade.messageBusiness(bizId);
    }
  }
}
