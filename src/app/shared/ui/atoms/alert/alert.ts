import { Component, input, computed, booleanAttribute, output, ViewEncapsulation } from '@angular/core';
import { LucideInfo, LucideCheckCircle, LucideAlertTriangle, LucideAlertCircle, LucideX } from '@lucide/angular';

export type AlertIntent = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [LucideInfo, LucideCheckCircle, LucideAlertTriangle, LucideAlertCircle, LucideX],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.role]': 'role()',
  }
})
export class Alert {
  intent = input<AlertIntent>('info');
  title = input<string>();
  dismissible = input<boolean, unknown>(false, { transform: booleanAttribute });
  actionLabel = input<string>();

  dismiss = output<void>();
  action = output<void>();

  classes = computed(() => `alert intent-${this.intent()}`);

  role = computed(() => {
    const int = this.intent();
    return int === 'warning' || int === 'error' ? 'alert' : 'status';
  });

  onDismiss() {
    this.dismiss.emit();
  }

  onAction() {
    this.action.emit();
  }
}
