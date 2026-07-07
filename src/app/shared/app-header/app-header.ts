import { Component, input } from '@angular/core';
import { Logo } from '../logo/logo';

@Component({
  selector: 'ui-app-header',
  imports: [Logo],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
  host: {
    '[class.layout-wide]': 'layout() === "wide"'
  }
})
export class AppHeader {
  readonly showLogo = input<boolean>(true);
  readonly layout = input<'default' | 'wide'>('default');
}
