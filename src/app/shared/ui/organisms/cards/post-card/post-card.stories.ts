import { Meta, StoryObj } from '@storybook/angular';
import { PostCard } from './post-card';
import { NearbyItemKind } from '../../../../../core/models/discovery';

const meta: Meta<PostCard> = {
  title: 'Organisms/Cards/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  argTypes: {
    actionClicked: { action: 'actionClicked' },
  },
};

export default meta;
type Story = StoryObj<PostCard>;

const baseItem = {
  id: '1',
  kind: NearbyItemKind.OPPORTUNITY_POST,
  title: 'Looking for a frontend developer',
  body: 'We are looking for a skilled frontend developer to help us build amazing interfaces using Angular and CSS.',
  subtype: 'JOB',
  status: 'ACTIVE',
  location: {
    id: 'loc1',
    name: 'San Francisco, CA',
  },
  author: {
    id: 'user1',
    username: 'techcorp',
    displayName: 'Tech Corp',
    avatarUrl: 'https://i.pravatar.cc/150?u=techcorp',
  },
  media: [],
  createdAt: new Date().toISOString(),
  capabilities: {
    canReply: true,
    canEdit: false,
    canDelete: false,
    canComplete: false,
  },
};

export const WithoutMedia: Story = {
  args: {
    item: { ...baseItem } as any,
  },
};

export const WithMedia: Story = {
  args: {
    item: {
      ...baseItem,
      media: [{ url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', mimeType: 'image/jpeg' }],
    } as any,
  },
};

export const OwnOpportunityWithManage: Story = {
  args: {
    item: {
      ...baseItem,
      capabilities: {
        canReply: false,
        canEdit: true,
        canDelete: true,
        canComplete: true,
      },
    } as any,
  },
};

export const NoAvatar: Story = {
  args: {
    item: {
      ...baseItem,
      author: {
        id: 'user2',
        username: 'anonymous',
      },
    } as any,
  },
};
