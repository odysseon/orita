import { Component, input, computed, booleanAttribute, ElementRef, inject, output, ViewEncapsulation } from '@angular/core';
import { LucideX } from '@lucide/angular';

export type ChipIntent = 'neutral' | 'primary' | 'error' | 'success' | 'warning' | 'info';

@Component({
  selector: 'button[app-chip], a[app-chip], app-chip',
  standalone: true,
  imports: [LucideX],
  templateUrl: './chip.html',
  styleUrl: './chip.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.disabled]': 'isButton() && disabled() ? true : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.type]': 'isButton() ? "button" : null',
    '[attr.aria-pressed]': 'isButton() ? (selected() ? "true" : "false") : null',
  },
})
export class Chip {
  private el = inject(ElementRef);
  
  intent = input<ChipIntent>('neutral');
  selected = input<boolean, unknown>(false, { transform: booleanAttribute });
  disabled = input<boolean, unknown>(false, { transform: booleanAttribute });
  removable = input<boolean, unknown>(false, { transform: booleanAttribute });

  remove = output<void>();

  isButton = computed(() => this.el.nativeElement.tagName.toLowerCase() === 'button');
  isAnchor = computed(() => this.el.nativeElement.tagName.toLowerCase() === 'a');
  isInteractiveRoot = computed(() => this.isButton() || this.isAnchor());

  classes = computed(() => {
    return [
      'chip',
      `intent-${this.intent()}`,
      this.selected() ? 'chip--selected' : '',
      this.isInteractiveRoot() ? 'chip--interactive' : '',
    ].filter(Boolean).join(' ');
  });

  onRemove(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.remove.emit();
  }
}
