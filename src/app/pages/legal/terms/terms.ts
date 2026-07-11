import { Component } from '@angular/core';
import { LegalHeader } from '../components/legal-header/legal-header';
import { LegalContact } from '../components/legal-contact/legal-contact';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [LegalHeader, LegalContact],
  templateUrl: './terms.html',
})
export class TermsOfService {}
