import { Component, input } from '@angular/core';

@Component({
  selector: 'app-legal-header',
  standalone: true,
  templateUrl: './legal-header.html',
  styleUrl: './legal-header.css',
})
export class LegalHeader {
  title = input.required<string>();
  effectiveDate = input.required<string>();
  lastUpdated = input.required<string>();
  version = input.required<string>();
  description = input.required<string>();
}
