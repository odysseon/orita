import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MessageList } from './message-list';
import { AttachmentPreviewService } from '../../../../../core/services/attachment-preview.service';

class MockAttachmentPreviewService {
  resolvePreviewUrl(localId: string, remoteUrl?: string) {
    return Promise.resolve(remoteUrl || '');
  }
}

const meta: Meta<MessageList> = {
  title: 'Organisms/Messaging/MessageList',
  component: MessageList,
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
      <div style="height: 500px; max-width: 500px; border: 1px solid var(--border-subtle); background: var(--surface-page); display: flex; flex-direction: column;">
        <ui-message-list [messages]="messages" [viewerParticipantId]="viewerParticipantId" style="flex: 1; overflow-y: auto;" />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<MessageList>;

export const ActiveConversationThread: Story = {
  args: {
    viewerParticipantId: 'p-me',
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        participantId: 'p-them',
        senderName: 'Jane Doe',
        senderAvatarUrl: 'https://i.pravatar.cc/150?u=jane',
        content: 'Good morning! Can I check if you do custom sizing for the leather boots?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        participantId: 'p-me',
        content: 'Hi Jane! Absolutely, we craft custom fit boots upon measurements.',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        readAt: new Date(Date.now() - 1500000).toISOString(),
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        participantId: 'p-them',
        senderName: 'Jane Doe',
        senderAvatarUrl: 'https://i.pravatar.cc/150?u=jane',
        content: 'That sounds amazing. How many days will fabrication take?',
        createdAt: new Date(Date.now() - 300000).toISOString(),
      }
    ] as any
  }
};

export const EmptyThread: Story = {
  args: {
    viewerParticipantId: 'p-me',
    messages: []
  }
};
