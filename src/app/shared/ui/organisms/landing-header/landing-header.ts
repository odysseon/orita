import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from '../../layouts/header/header';
import { Button } from '../../atoms/button/button';
import { Logo } from '../../atoms/logo/logo';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [Header, HeaderStart, HeaderCenter, HeaderEnd, Button, RouterLink, Logo],
  template: `
    <ui-header [sticky]="sticky()">
      <div uiHeaderStart>
        <ui-logo variant="full" size="sm"></ui-logo>
      </div>
      <div uiHeaderCenter>
      </div>
      <div uiHeaderEnd>
        <a [routerLink]="exploreLink()" app-button appearance="ghost" size="sm">Start Exploring</a>
        <a [routerLink]="registerLink()" app-button appearance="solid" size="sm">Get Started</a>
      </div>
    </ui-header>
  `,
})
export class LandingHeader {
  sticky = input<boolean>(true);
  layout = input<'default' | 'wide'>('wide');
  exploreLink = input<string>('/explore');
  registerLink = input<string>('/auth/register');
}
