import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section',
  standalone: true,
  templateUrl: './section.html',
  styleUrl: './section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Section {
  readonly width = input<'sm' | 'md' | 'lg' | 'xl'>('lg');

  readonly centered = input(true);
}
