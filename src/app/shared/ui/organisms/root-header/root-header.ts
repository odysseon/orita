import { Component, input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from 'ur-ui';
import { Avatar } from 'ur-ui';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-root-header',
  standalone: true,
  imports: [Header, HeaderStart, HeaderCenter, HeaderEnd, Avatar, RouterLink],
  template: `
    <ui-header [sticky]="sticky()" [uiScrollHide]="uiScrollHide()" [scrollHidePosition]="scrollHidePosition()">
      <ng-container uiHeaderStart>
        <a [routerLink]="profileLink()">
          <app-avatar 
            [guest]="!auth.token()"
            [src]="auth.currentUser()?.avatarUrl"
            size="sm">
          </app-avatar>
        </a>
      </ng-container>
      <ng-container uiHeaderCenter>
        <ng-content select="[rootHeaderCenter]"></ng-content>
      </ng-container>
      <ng-container uiHeaderEnd>
        <ng-content select="[rootHeaderEnd]"></ng-content>
      </ng-container>
    </ui-header>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    [rootHeaderCenter] { display: flex; align-items: center; justify-content: center; min-width: 0; max-width: 100%; }
  `]
})
export class RootHeader {
  auth = inject(AuthService);
  profileLink = input<string>('/profile');
  sticky = input<boolean>(false);
  uiScrollHide = input<boolean>(false);
  scrollHidePosition = input<'top' | 'bottom'>('top');
}
