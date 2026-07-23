import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from '../../layouts/header/header';
import { Avatar } from '../../atoms/avatar/avatar';

@Component({
  selector: 'app-root-header',
  standalone: true,
  imports: [Header, HeaderStart, HeaderCenter, HeaderEnd, Avatar, RouterLink],
  template: `
    <ui-header [sticky]="sticky()">
      <div uiHeaderStart>
        <a [routerLink]="profileLink()">
          <app-avatar [src]="avatarSrc()" size="sm"></app-avatar>
        </a>
      </div>
      <div uiHeaderCenter>
        <ng-content select="[rootHeaderCenter]"></ng-content>
      </div>
      <div uiHeaderEnd>
        <ng-content select="[rootHeaderEnd]"></ng-content>
      </div>
    </ui-header>
  `,
})
export class RootHeader {
  avatarSrc = input<string>();
  profileLink = input<string>('/profile');
  sticky = input<boolean>(true);
}
