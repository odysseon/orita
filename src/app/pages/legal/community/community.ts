import { Component } from '@angular/core';
import { LegalHeader } from '../components/legal-header/legal-header';
import { LegalContact } from '../components/legal-contact/legal-contact';

@Component({
  selector: 'app-community-guidelines',
  standalone: true,
  imports: [LegalHeader, LegalContact],
  templateUrl: './community.html',
})
export class CommunityGuidelines {}
