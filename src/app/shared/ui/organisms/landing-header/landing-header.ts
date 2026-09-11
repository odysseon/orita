import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from 'ur-ui';
import { Button } from 'ur-ui';
import { Logo } from '../../atoms/logo/logo';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [Header, HeaderStart, HeaderCenter, HeaderEnd, Button, RouterLink, Logo],
  template: `
    <ui-header [sticky]="sticky()" [bordered]="false" [uiScrollHide]="uiScrollHide()" [scrollHidePosition]="scrollHidePosition()">
      <ng-container uiHeaderStart>
        <ui-logo variant="full" size="sm"></ui-logo>
      </ng-container>
      <ng-container uiHeaderCenter>
      </ng-container>
      <ng-container uiHeaderEnd>
        <ng-content select="[landingHeaderEnd]"></ng-content>
        <a [routerLink]="exploreLink()" app-button appearance="ghost" size="sm">Start Exploring</a>
        <a [routerLink]="registerLink()" app-button appearance="solid" size="sm">Get Started</a>
      </ng-container>
    </ui-header>
  `,
  styles: [':host { display: block; width: 100%; }']
})
export class LandingHeader {
  sticky = input<boolean>(true);
  uiScrollHide = input<boolean>(true);
  scrollHidePosition = input<'top' | 'bottom'>('top');
  layout = input<'default' | 'wide'>('wide');
  exploreLink = input<string>('/explore');
  registerLink = input<string>('/auth/register');
}
