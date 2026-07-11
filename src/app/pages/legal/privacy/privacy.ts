import { Component } from '@angular/core';
import { LegalHeader } from '../components/legal-header/legal-header';
import { LegalContact } from '../components/legal-contact/legal-contact';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [LegalHeader, LegalContact],
  templateUrl: './privacy.html',
})
export class PrivacyPolicy {}
