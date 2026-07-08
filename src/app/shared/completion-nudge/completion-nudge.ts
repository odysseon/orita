import { Component, input, output } from '@angular/core';
import { LucideChevronRight, LucideAlertCircle } from '@lucide/angular';

@Component({
  selector: 'app-completion-nudge',
  imports: [LucideChevronRight, LucideAlertCircle],
  templateUrl: './completion-nudge.html',
  styleUrl: './completion-nudge.css'
})
export class CompletionNudge {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly actionLabel = input<string>('Complete profile');
  
  readonly action = output<void>();

  onAction() {
    this.action.emit();
  }
}
