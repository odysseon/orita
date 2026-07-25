import { Meta, StoryObj } from '@storybook/angular';
import { ChatHeader } from './chat-header';

const meta: Meta<ChatHeader> = {
  title: 'Molecules/Messaging/ChatHeader',
  component: ChatHeader,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    template: `
      <div style="max-width: 500px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; background: var(--surface-card);">
        <ui-chat-header [conversation]="conversation" (back)="onBack()" />
      </div>
    `,
  })
};

export default meta;
type Story = StoryObj<ChatHeader>;

export const StandardUser: Story = {
  args: {
    conversation: {
      id: 'c1',
      participants: [
        { participantId: 'p1', displayName: 'Tomiwa Adebe', avatarUrl: 'https://i.pravatar.cc/150?u=tom' }
      ]
    } as any
  }
};

export const BusinessParticipant: Story = {
  args: {
    conversation: {
      id: 'c2',
      participants: [
        { participantId: 'p2', displayName: 'Vintage Leathers & Crafts', avatarUrl: 'https://i.pravatar.cc/150?u=biz' }
      ]
    } as any
  }
};
