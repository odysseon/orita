import { Component, input } from '@angular/core';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [LucideMapPin],
  template: `
    <div class="flex items-center gap-2" [class]="className()">
      <div
        class="grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-ink)] text-[var(--text-on-dark)]"
      >
        <svg lucideMapPin class="h-5 w-5" />
      </div>
      <span class="font-display text-xl font-semibold tracking-tight text-[var(--surface-ink)]">
        Oríta
      </span>
    </div>
  `,
})
export class LogoComponent {
  readonly className = input<string>('');
}
