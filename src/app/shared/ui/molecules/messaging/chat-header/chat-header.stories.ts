import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChatHeader } from './chat-header';

const meta: Meta<ChatHeader> = {
  title: 'Molecules/Messaging/ChatHeader',
  component: ChatHeader,
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {}, queryParams: {} },
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    })
  ],
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
      title: 'Tomiwa Adebe',
      status: 'online',
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
      title: 'Vintage Leathers & Crafts',
      status: 'online',
      participants: [
        { participantId: 'p2', displayName: 'Vintage Leathers & Crafts', avatarUrl: 'https://i.pravatar.cc/150?u=biz' }
      ]
    } as any
  }
};
