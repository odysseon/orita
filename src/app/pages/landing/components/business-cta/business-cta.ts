import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Section } from '../section/section';
import { LucideCheck } from '@lucide/angular';

@Component({
  selector: 'app-business-cta',
  standalone: true,
  imports: [Section, RouterLink, LucideCheck],
  templateUrl: './business-cta.html',
  styleUrl: './business-cta.css',
  
})
export class BusinessCta {
  protected readonly benefits = [
    'Create your business profile',
    'Showcase products and services',
    'Receive calls and WhatsApp enquiries',
    'Build trust with Store Tours',
  ] as const;
}
