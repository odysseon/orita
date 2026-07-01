import { Component, inject } from '@angular/core';
import {
  LucideSun,
  LucideMoon,
  LucideMonitor,
  LucideDynamicIcon,
  LucideIconInput,
} from '@lucide/angular';
import { ThemeService, ThemePreference } from '../../../core/services/theme.service';

interface ThemeOption {
  value: ThemePreference;
  label: string;
  description: string;
  icon: LucideIconInput;
}

@Component({
  selector: 'app-appearance',
  imports: [LucideDynamicIcon],
  templateUrl: './appearance.html',
  styleUrl: './appearance.css',
})
export class Appearance {
  readonly theme = inject(ThemeService);

  readonly options: ThemeOption[] = [
    {
      value: 'system',
      label: 'System',
      description: 'Follows your device setting',
      icon: LucideMonitor,
    },
    {
      value: 'light',
      label: 'Light',
      description: 'Always light',
      icon: LucideSun,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Always dark',
      icon: LucideMoon,
    },
  ];

  select(value: ThemePreference): void {
    this.theme.set(value);
  }
}
