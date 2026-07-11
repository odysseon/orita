import { Component } from '@angular/core';
import { LegalHeader } from '../components/legal-header/legal-header';
import { LegalContact } from '../components/legal-contact/legal-contact';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [LegalHeader, LegalContact],
  templateUrl: './cookies.html',
})
export class CookiePolicy {}
