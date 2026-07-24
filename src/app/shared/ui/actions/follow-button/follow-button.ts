import { Component, input, output, computed } from '@angular/core';
import { Button, ButtonSize, ButtonLayout } from '../../atoms/button/button';
import { LucideUserPlus, LucideUserCheck } from '@lucide/angular';

@Component({
  selector: 'ui-follow-button',
  standalone: true,
  imports: [Button, LucideUserPlus, LucideUserCheck],
  template: `
    <button app-button 
      [intent]="intent()" 
      [appearance]="appearance()" 
      [size]="size()" 
      [layout]="layout()"
      [fullWidth]="fullWidth()"
      [shape]="display() === 'icon' ? 'square' : 'default'"
      (click)="toggle.emit()">
      
      @if (display() !== 'text') {
        @if (isFollowed()) {
          <svg lucideUserCheck></svg>
        } @else {
          <svg lucideUserPlus></svg>
        }
      }

      @if (display() !== 'icon') {
        <span>{{ isFollowed() ? 'Following' : 'Follow' }}</span>
      }
    </button>
  `,
  styles: [`
    :host {
      display: contents; /* Let button handle positioning */
    }
  `]
})
export class FollowButton {
  isFollowed = input.required<boolean>();
  size = input<ButtonSize>('md');
  display = input<'text' | 'icon' | 'icon-text'>('text');
  layout = input<ButtonLayout>('horizontal');
  fullWidth = input<boolean>(false);
  
  toggle = output<void>();

  // Use primary solid when not following, and secondary outline when following
  intent = computed(() => this.isFollowed() ? 'secondary' : 'primary');
  appearance = computed(() => this.isFollowed() ? 'outline' : 'solid');
}
