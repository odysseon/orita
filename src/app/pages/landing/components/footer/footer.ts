import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Divider } from 'ur-ui';

interface FooterLink {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, Divider],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  protected readonly links: readonly FooterLink[] = [
    {
      label: 'Explore',
      route: '/search',
    },
    {
      label: 'Create Business',
      route: '/business/create',
    },
    {
      label: 'About',
      route: '/about',
    },
    {
      label: 'Contact',
      route: '/contact',
    },
  ];

  protected readonly legalLinks: readonly FooterLink[] = [
    {
      label: 'Privacy Policy',
      route: '/legal/privacy',
    },
    {
      label: 'Terms of Service',
      route: '/legal/terms',
    },
    {
      label: 'Community Guidelines',
      route: '/legal/community',
    },
    {
      label: 'Cookie Policy',
      route: '/legal/cookies',
    },
  ];

  protected readonly year = new Date().getFullYear();
}
