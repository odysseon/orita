import { Meta, StoryObj } from '@storybook/angular';
import { 
  List, 
  ListItem, 
  ListItemStart, 
  ListItemContent, 
  ListItemTitle, 
  ListItemDescription, 
  ListItemEnd 
} from './list';
import { LucideSettings, LucideShieldCheck, LucidePalette, LucideChevronRight, LucideUser, LucidePhone, LucideGlobe } from '@lucide/angular';

const meta: Meta<List> = {
  title: 'Surfaces/List',
  component: List,
  tags: ['autodocs'],
  argTypes: {
    bordered: { control: 'boolean' },
    dividers: { control: 'boolean' },
    padding: { control: 'boolean' },
    radius: { control: 'boolean' }
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [
        ListItem, 
        ListItemStart, 
        ListItemContent, 
        ListItemTitle, 
        ListItemDescription, 
        ListItemEnd,
        LucideSettings, LucideShieldCheck, LucidePalette, LucideChevronRight, LucideUser, LucidePhone, LucideGlobe
      ],
    },
    template: `
      <div style="max-width: 400px; padding: var(--size-20); background: var(--surface-container); border-radius: var(--radius-xl);">
        <h3 style="margin-bottom: var(--size-16); font-size: var(--size-14); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Dynamic List Example</h3>
        <ui-list [bordered]="bordered" [dividers]="dividers" [padding]="padding" [radius]="radius">
          <button uiListItem>
            <div uiListItemStart>
              <div style="width: var(--size-40); height: var(--size-40); border-radius: var(--size-10); background: var(--clr-primary-container); color: var(--clr-on-primary-container); display: flex; align-items: center; justify-content: center;">
                <svg lucideSettings></svg>
              </div>
            </div>
            <div uiListItemContent>
              <div uiListItemTitle>Discovery Preferences</div>
              <div uiListItemDescription>Personalize your feed and interests</div>
            </div>
            <div uiListItemEnd>
              <svg lucideChevronRight></svg>
            </div>
          </button>
          
          <button uiListItem>
            <div uiListItemStart>
              <div style="width: var(--size-40); height: var(--size-40); border-radius: var(--size-10); background: var(--clr-primary-container); color: var(--clr-on-primary-container); display: flex; align-items: center; justify-content: center;">
                <svg lucideShieldCheck></svg>
              </div>
            </div>
            <div uiListItemContent>
              <div uiListItemTitle>Privacy & Security</div>
              <div uiListItemDescription>Manage auth methods and account security</div>
            </div>
            <div uiListItemEnd>
              <svg lucideChevronRight></svg>
            </div>
          </button>
          
          <button uiListItem>
            <div uiListItemStart>
              <div style="width: var(--size-40); height: var(--size-40); border-radius: var(--size-10); background: var(--clr-primary-container); color: var(--clr-on-primary-container); display: flex; align-items: center; justify-content: center;">
                <svg lucidePalette></svg>
              </div>
            </div>
            <div uiListItemContent>
              <div uiListItemTitle>Appearance</div>
              <div uiListItemDescription>Customize how Orita looks for you</div>
            </div>
            <div uiListItemEnd>
              <svg lucideChevronRight></svg>
            </div>
          </button>
        </ui-list>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<List>;

export const Default: Story = {
  args: {
    bordered: true,
    dividers: true,
    padding: true,
    radius: true
  }
};

export const InboxStyle: Story = {
  args: {
    bordered: false,
    dividers: true,
    padding: true,
    radius: false
  }
};

export const MenuStyle: Story = {
  args: {
    bordered: false,
    dividers: false,
    padding: true,
    radius: false
  }
};
