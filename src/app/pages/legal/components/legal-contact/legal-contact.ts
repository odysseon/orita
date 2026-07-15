import { Component, input } from '@angular/core';

@Component({
  selector: 'app-legal-contact',
  standalone: true,
  templateUrl: './legal-contact.html',
  styleUrl: './legal-contact.css',
})
export class LegalContact {
  showPrivacy = input<boolean>(true);
  showLegal = input<boolean>(true);
}
