import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Section } from '../section/section';

@Component({
  selector: 'app-business-cta',
  standalone: true,
  imports: [Section, RouterLink],
  templateUrl: './business-cta.html',
  styleUrl: './business-cta.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessCta {
  protected readonly benefits = [
    'Create your business profile',
    'Showcase products and services',
    'Receive calls and WhatsApp enquiries',
    'Build trust with Store Tours',
  ] as const;
}
