import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IProfile } from '../../../pages/profile/profile.interface';
import { Avatar } from '../../ui/avatar/avatar';
import { LucideMapPin } from '@lucide/angular';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink, Avatar, LucideMapPin],
  template: `
    <a [routerLink]="['/users', user().username]" class="user-card-link">
      <div class="user-card">
        <ui-avatar
          [src]="user().avatarUrl"
          [name]="user().username"
          size="lg"
        />
        <div class="user-info">
          <h3 class="user-name">{{ user().username }}</h3>
          @if (user().location?.name) {
            <p class="user-location">
              <svg lucideMapPin class="icon-sm"></svg>
              {{ user().location?.name }}
            </p>
          }
        </div>
      </div>
    </a>
  `,
  styles: [`
    .user-card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .user-card {
      display: flex;
      align-items: center;
      gap: var(--size-16);
      padding: var(--size-8) 0;
      border-radius: var(--radius-xl);
      transition: all 0.2s ease;
    }
    
    .user-card:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      gap: var(--size-4);
    }
    
    .user-name {
      margin: 0;
      font-size: var(--size-16);
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .user-location {
      margin: 0;
      font-size: var(--size-14);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: var(--size-4);
    }
    
    .icon-sm {
      width: 14px;
      height: 14px;
    }
  `]
})
export class AppUserCard {
  user = input.required<IProfile>();
}
