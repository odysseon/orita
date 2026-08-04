import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { signal } from '@angular/core';
import { MessageComposer } from './message-composer';
import { DraftMessageService } from '../../../../../core/services/draft-message.service';
import { AttachmentPreviewService } from '../../../../../core/services/attachment-preview.service';
import { AttachmentValidatorService } from '../../../../../core/services/attachment-validator.service';
import { ShareService } from '../../../../../core/services/share.service';
import { SaveService } from '../../../../../core/services/save.service';
import { FollowService } from '../../../../../core/services/follow.service';
import { of } from 'rxjs';

class MockDraftService {
  draftsChange = signal<void>(undefined);
  getDraft(cid: string) {
    if (cid === 'with-embed') {
      return { embeds: [{ embedType: 'LISTING', targetId: 'l101' }] };
    }
    return null;
  }
  removeEmbed() {}
  clearDraft() {}
}

class MockPreviewService {
  createPreview(id: string) { return 'mock-preview-url'; }
  revokePreview(id: string) {}
}

class MockValidatorService {
  validateAttachments() { return { valid: true }; }
}

class MockShareService {
  getRecentShares() { return Promise.resolve([]); }
  searchShareables() { return Promise.resolve([]); }
}

class MockSaveService {
  getSavedItems() { return of({ items: [] }); }
}

class MockFollowService {
  getFollowing() { return of({ items: [] }); }
}

const meta: Meta<MessageComposer> = {
  title: 'Molecules/Messaging/MessageComposer',
  component: MessageComposer,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        { provide: DraftMessageService, useClass: MockDraftService },
        { provide: AttachmentPreviewService, useClass: MockPreviewService },
        { provide: AttachmentValidatorService, useClass: MockValidatorService },
        { provide: ShareService, useClass: MockShareService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: FollowService, useClass: MockFollowService },
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 550px; padding: 1rem; border-top: var(--size-1) solid var(--border-subtle); background: var(--surface-card);">
        <ui-message-composer [conversationId]="conversationId" />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<MessageComposer>;

export const EmptyState: Story = {
  args: {
    conversationId: 'empty-conv',
  }
};

export const WithDraftEmbed: Story = {
  args: {
    conversationId: 'with-embed',
  }
};
