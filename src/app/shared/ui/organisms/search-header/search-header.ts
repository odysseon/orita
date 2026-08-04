import { Component, input, output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from '../../layouts/header/header';
import { Avatar } from '../../identity/avatar/avatar';

import { SearchBar } from '../../molecules/search-bar/search-bar';
import { InputDirective } from '../../atoms/forms/input';
import { Button } from '../../atoms/button/button';
import { LucideFilter } from '@lucide/angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-search-header',
  standalone: true,
  imports: [
    Header, 
    HeaderStart, 
    HeaderCenter, 
    HeaderEnd, 
    Avatar, 
    RouterLink, 
    SearchBar, 
    InputDirective,
    Button,
    LucideFilter,
    FormsModule
  ],
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
        <ng-content select="[searchHeaderStart]"></ng-content>
      </ng-container>
      <div uiHeaderCenter class="search-container">
        <ui-search-bar>
          <input 
            app-input 
            [placeholder]="placeholder()"
            [value]="query()"
            (input)="onInput($event)"
            (keydown.enter)="onSearch($event)"
          />
        </ui-search-bar>
      </div>
      <ng-container uiHeaderEnd>
        <button app-button appearance="ghost" size="icon" shape="circle" aria-label="Filters" (click)="filter.emit()">
          <svg lucideFilter></svg>
        </button>
        <ng-content select="[searchHeaderEnd]"></ng-content>
      </ng-container>
    </ui-header>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .search-container {
      width: 100%;
      max-width: 37.5rem;
    }
  `]
})
export class SearchHeader {
  auth = inject(AuthService);
  profileLink = input<string>('/profile');
  placeholder = input<string>('Search');
  query = input<string>('');
  sticky = input<boolean>(false);
  uiScrollHide = input<boolean>(false);
  scrollHidePosition = input<'top' | 'bottom'>('top');
  
  queryChange = output<string>();
  search = output<string>();
  filter = output<void>();

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.queryChange.emit(value);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
