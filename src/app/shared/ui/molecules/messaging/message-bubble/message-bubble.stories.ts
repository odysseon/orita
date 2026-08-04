import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MessageBubble } from './message-bubble';
import { AttachmentPreviewService } from '../../../../../core/services/attachment-preview.service';

class MockAttachmentPreviewService {
  resolvePreviewUrl(localId: string, remoteUrl?: string) {
    return Promise.resolve(remoteUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300');
  }
}

const meta: Meta<MessageBubble> = {
  title: 'Molecules/Messaging/MessageBubble',
  component: MessageBubble,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AttachmentPreviewService, useClass: MockAttachmentPreviewService }
      ]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 31.25rem; padding: 1.5rem; background: var(--surface-page);">
        <ui-message-bubble [message]="message" [isMine]="isMine" />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<MessageBubble>;

export const IncomingMessage: Story = {
  args: {
    isMine: false,
    message: {
      id: 'm1',
      conversationId: 'c1',
      participantId: 'p2',
      senderName: 'Tomiwa',
      senderAvatarUrl: 'https://i.pravatar.cc/150?u=tom',
      content: 'Hello! Is this vintage leather jacket still available for quick delivery?',
      createdAt: new Date().toISOString(),
    } as any
  }
};

export const OutgoingMessageRead: Story = {
  args: {
    isMine: true,
    message: {
      id: 'm2',
      conversationId: 'c1',
      participantId: 'me',
      content: 'Yes! It is in stock and we can arrange same-day dispatch.',
      createdAt: new Date().toISOString(),
      readAt: new Date().toISOString(),
    } as any
  }
};

export const OutgoingOptimisticQueue: Story = {
  args: {
    isMine: true,
    message: {
      id: 'm3',
      conversationId: 'c1',
      participantId: 'me',
      content: 'Sending delivery coordinate invoice right now...',
      createdAt: new Date().toISOString(),
      syncState: 'SENDING',
    } as any
  }
};
