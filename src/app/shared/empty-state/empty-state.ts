import { Component, input } from '@angular/core';
import { LucideIconInput, LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'ui-empty-state',
  imports: [LucideDynamicIcon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  icon = input<LucideIconInput | null>(null);
  title = input.required<string>();
  description = input<string>('');
}
