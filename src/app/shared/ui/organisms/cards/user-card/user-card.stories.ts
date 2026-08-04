import { Meta, StoryObj } from '@storybook/angular';
import { UserCard } from './user-card';
import { FollowButton } from '../../../actions/follow-button/follow-button';

const meta: Meta<UserCard> = {
  title: 'Organisms/Cards/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [FollowButton],
    },
    template: `
      <div style="max-width: 25rem;">
        <ui-user-card [user]="user" [bio]="bio">
            <!-- Actions Slot -->
            <div card-actions>
              <ui-follow-button [isFollowed]="false" fullWidth="true"></ui-follow-button>
            </div>
          </ui-user-card>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<UserCard>;

export const Default: Story = {
  args: {
    user: {
      id: 'u1',
      username: 'tgenericx',
      displayName: 'Tomiwa',
      avatarUrl: 'https://i.pravatar.cc/150?u=tomiwa',
      isVerified: true
    },
    bio: 'Software Engineer specializing in Angular and Web Typography. Building the future of Orita.'
  }
};

export const WithoutBio: Story = {
  args: {
    user: {
      id: 'u2',
      username: 'johndoe',
      displayName: 'John Doe',
      avatarUrl: 'https://i.pravatar.cc/150?u=john',
      isVerified: false
    }
  }
};
