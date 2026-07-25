import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { of } from 'rxjs';
import { AttachSheetComponent } from './attach-sheet';
import { ShareService } from '../../../../core/services/share.service';
import { DraftMessageService } from '../../../../core/services/draft-message.service';
import { SaveService } from '../../../../core/services/save.service';
import { FollowService } from '../../../../core/services/follow.service';

class MockShareService {
  getRecentShares() {
    return Promise.resolve([
      { targetId: 'b1', type: 'BUSINESS', title: 'Adelabu Supermarket', subtitle: 'Lagos Island' },
      { targetId: 'l1', type: 'LISTING', title: 'iPhone 15 Pro Max 256GB', subtitle: '₦1,850,000' },
    ]);
  }
  searchShareables(query: string) {
    return Promise.resolve([
      { targetId: 'l2', type: 'LISTING', title: 'Searched Listing Result', subtitle: 'In Stock' },
      { targetId: 'b2', type: 'BUSINESS', title: 'Searched Business', subtitle: 'Victoria Island' }
    ]);
  }
}

class MockSaveService {
  getSavedItems() {
    return of({
      items: [
        { id: 's1', listingId: 's1', listing: { title: 'Nike Air Max Retro (Size 43)', price: 110000, thumbnailUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' } }
      ]
    });
  }
}

class MockFollowService {
  getFollowing() {
    return of({
      items: [
        { id: 'f1', businessId: 'f1', business: { name: 'Odysseo Logistics & Tech' } }
      ]
    });
  }
}

class MockDraftMessageService {
  attachEmbed(cid: string, data: any) {
    console.log('Attached embed', cid, data);
  }
}

const meta: Meta<AttachSheetComponent> = {
  title: 'Organisms/AttachSheet',
  component: AttachSheetComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        { provide: ShareService, useClass: MockShareService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: FollowService, useClass: MockFollowService },
        { provide: DraftMessageService, useClass: MockDraftMessageService },
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="min-height: 500px; padding: 1rem; background: var(--surface-page);">
        <button type="button" class="btn" (click)="isOpen = true">Open Attach Sheet</button>
        <ui-attach-sheet
          [isOpen]="isOpen"
          [conversationId]="conversationId"
          (close)="isOpen = false"
        />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<AttachSheetComponent>;

export const OritaLibraryTab: Story = {
  args: {
    isOpen: true,
    conversationId: 'conv-101',
  }
};
