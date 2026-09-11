import { Meta, StoryObj } from '@storybook/angular';
import { ConversationListItem } from './conversation-list-item';
import { List } from '@odysseon/ur-ui';

const meta: Meta<ConversationListItem> = {
  title: 'Organisms/ListItems/ConversationListItem',
  component: ConversationListItem,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [List],
    },
    template: `
      <div style="max-width: 25rem; height: calc(var(--size-10) * 50); background: var(--surface-default); border-radius: var(--radius-xl); overflow: hidden; border: var(--size-1) solid var(--border-subtle);">
        <div style="padding: var(--size-16); font-weight: var(--font-weight-semibold); font-size: var(--font-size-lg); border-bottom: var(--size-1) solid var(--border-subtle);">Chats</div>
        <!-- Inbox Style List: No outer border, no radius, just dividers -->
        <ui-list [bordered]="false" [radius]="false" [dividers]="true">
          <ui-conversation-list-item [conversation]="conversationUnread"></ui-conversation-list-item>
          <ui-conversation-list-item [conversation]="conversationRead"></ui-conversation-list-item>
          <ui-conversation-list-item [conversation]="conversationGroup"></ui-conversation-list-item>
        </ui-list>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<ConversationListItem>;

const now = new Date();
const fiveMinsAgo = new Date(now.getTime() - 5 * 60000);
const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
const yesterday = new Date(now.getTime() - 24 * 3600000);

export const Default: Story = {
  args: {
    // We pass these as extra args to be used in the template
    // @ts-ignore
    conversationUnread: {
      id: 'c1',
      participant: {
        id: 'u1',
        name: 'Sarah Johnson',
        avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
      },
      lastMessageSnippet: 'Are we still meeting up for coffee later?',
      lastMessageAt: fiveMinsAgo,
      unreadCount: 3
    },
    // @ts-ignore
    conversationRead: {
      id: 'c2',
      participant: {
        id: 'b1',
        name: 'Vintage Leathers',
        avatarUrl: 'https://i.pravatar.cc/150?u=vintage'
      },
      lastMessageSnippet: 'Your order has been shipped!',
      lastMessageAt: twoHoursAgo,
      unreadCount: 0
    },
    // @ts-ignore
    conversationGroup: {
      id: 'c3',
      participant: {
        id: 'u3',
        name: 'David Smith',
        avatarUrl: 'https://i.pravatar.cc/150?u=david'
      },
      lastMessageSnippet: 'Sounds good to me. See you then.',
      lastMessageAt: yesterday,
      unreadCount: 0
    }
  }
};
