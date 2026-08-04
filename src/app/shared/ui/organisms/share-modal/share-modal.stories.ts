import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ShareModalComponent } from './share-modal';
import { ShareService } from '../../../../core/services/share.service';
import { UserSearchService } from '../../../../core/services/user-search.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast';

class MockAuthService {
  token = signal('mock-jwt-token');
}

class MockShareService {
  getSuggestedRecipients() {
    return Promise.resolve([
      { userId: 'u1', username: 'tomiwa', displayName: 'Tomiwa', avatarUrl: 'https://i.pravatar.cc/150?u=1', relevanceScore: 1 },
      { userId: 'u2', username: 'janedoe', displayName: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=2', relevanceScore: 0.9 },
      { userId: 'u3', username: 'orita_official', displayName: 'Orita Support', avatarUrl: 'https://i.pravatar.cc/150?u=3', relevanceScore: 0.8 },
    ]);
  }
  shareInternal() {
    return Promise.resolve();
  }
}

class MockUserSearchService {
  search(query: string) {
    return of({
      items: [
        { id: 'u4', username: 'searched_user', displayName: 'Searched Friend', avatarUrl: 'https://i.pravatar.cc/150?u=4' },
      ],
      total: 1
    });
  }
}

const meta: Meta<ShareModalComponent> = {
  title: 'Organisms/ShareModal',
  component: ShareModalComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: ShareService, useClass: MockShareService },
        { provide: UserSearchService, useClass: MockUserSearchService },
        ToastService,
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="min-height: 31.25rem; padding: 1rem; background: var(--surface-page);">
        <button type="button" class="btn" (click)="isOpen = true">Open Share Modal</button>
        <ui-share-modal
          [isOpen]="isOpen"
          [embedType]="embedType"
          [targetId]="targetId"
          [title]="title"
          [subtitle]="subtitle"
          [imageUrl]="imageUrl"
          (close)="isOpen = false"
        />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<ShareModalComponent>;

export const DefaultSuggested: Story = {
  args: {
    isOpen: true,
    embedType: 'BUSINESS',
    targetId: 'b101',
    title: 'Vintage Leather Haven',
    subtitle: 'Lagos, Nigeria • 4.9★',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=200',
  }
};

export const ListingShare: Story = {
  args: {
    isOpen: true,
    embedType: 'LISTING',
    targetId: 'l202',
    title: 'Sony PlayStation 5 Console - Mint Condition',
    subtitle: '₦750,000 • In Stock',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=200',
  }
};
