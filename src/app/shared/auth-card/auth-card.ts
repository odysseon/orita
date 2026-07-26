import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Logo } from '../ui/atoms/logo/logo';

@Component({
  selector: 'app-auth-card',
  imports: [RouterLink, Logo],
  templateUrl: './auth-card.html',
  styleUrl: './auth-card.css',
})
export class AppAuthCard {
  readonly subtitle = input.required<string>();
  readonly footerText = input.required<string>();
  readonly footerLinkLabel = input.required<string>();
  readonly footerLinkRoute = input.required<string>();
}
