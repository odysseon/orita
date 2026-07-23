import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header, HeaderStart, HeaderCenter, HeaderEnd } from '../../layouts/header/header';
import { Avatar } from '../../atoms/avatar/avatar';
import { SearchBar } from '../../molecules/search-bar/search-bar';
import { InputDirective } from '../../atoms/forms/input';
import { Button } from '../../atoms/button/button';
import { LucideFilter } from '@lucide/angular';
import { FormsModule } from '@angular/forms';

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
      <div uiHeaderStart>
        <a [routerLink]="profileLink()">
          <app-avatar [src]="avatarSrc()" size="sm"></app-avatar>
        </a>
      </div>
      <div uiHeaderCenter class="search-container">
        <ui-search-bar>
          <input 
            app-input 
            [placeholder]="placeholder()"
            [value]="query()"
            (keydown.enter)="onSearch($event)"
          />
        </ui-search-bar>
      </div>
      <div uiHeaderEnd>
        <button app-button appearance="ghost" size="icon" shape="circle" aria-label="Filters" (click)="filter.emit()">
          <svg lucideFilter></svg>
        </button>
      </div>
    </ui-header>
  `,
  styles: [`
    .search-container {
      width: 100%;
      max-width: 600px;
    }
  `]
})
export class SearchHeader {
  avatarSrc = input<string>('');
  profileLink = input<string>('/profile');
  placeholder = input<string>('Search');
  query = input<string>('');
  sticky = input<boolean>(false);
  uiScrollHide = input<boolean>(false);
  scrollHidePosition = input<'top' | 'bottom'>('top');
  
  search = output<string>();
  filter = output<void>();

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.emit(value);
  }
}
