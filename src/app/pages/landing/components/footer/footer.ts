import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
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

  protected readonly year = new Date().getFullYear();
}
