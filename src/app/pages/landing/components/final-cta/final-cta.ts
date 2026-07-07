import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Section } from '../../../../shared/marketing/section/section';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [Section, RouterLink],
  templateUrl: './final-cta.html',
  styleUrl: './final-cta.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinalCta {}
