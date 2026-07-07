import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  readonly label: string;
  readonly route: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation {
  protected readonly open = signal(false);

  protected readonly links: readonly NavItem[] = [
    {
      label: 'Explore',
      route: '/search',
    },
    {
      label: 'Businesses',
      route: '/businesses',
    },
    {
      label: 'About',
      route: '/about',
    },
  ];

  protected toggleMenu(): void {
    this.open.update((open) => !open);
  }

  protected closeMenu(): void {
    this.open.set(false);
  }
}
