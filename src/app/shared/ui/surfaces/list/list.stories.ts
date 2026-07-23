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
      <div style="max-width: 400px; padding: 20px; background: var(--surface-container); border-radius: var(--radius-xl);">
        <h3 style="margin-bottom: 16px; font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Settings Example</h3>
        <ui-list>
          <button uiListItem>
            <div uiListItemStart>
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--clr-primary-container); color: var(--clr-on-primary-container); display: flex; align-items: center; justify-content: center;">
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
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--clr-primary-container); color: var(--clr-on-primary-container); display: flex; align-items: center; justify-content: center;">
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
              <div style="width: 40px; height: 40px; border-radius: 10px; background: var(--clr-primary-container); color: var(--clr-on-primary-container); display: flex; align-items: center; justify-content: center;">
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

        <h3 style="margin-top: 32px; margin-bottom: 16px; font-size: 14px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">Contacts Example</h3>
        <ui-list>
          <a href="#" uiListItem>
            <div uiListItemStart>
              <div style="width: 40px; height: 40px; border-radius: 20px; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center;">
                <svg lucidePhone></svg>
              </div>
            </div>
            <div uiListItemContent>
              <div uiListItemTitle>Call Business</div>
              <div uiListItemDescription>+1 (555) 123-4567</div>
            </div>
          </a>
          
          <a href="#" uiListItem>
            <div uiListItemStart>
              <div style="width: 40px; height: 40px; border-radius: 20px; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center;">
                <svg lucideGlobe></svg>
              </div>
            </div>
            <div uiListItemContent>
              <div uiListItemTitle>Website</div>
              <div uiListItemDescription>orita.app</div>
            </div>
            <div uiListItemEnd>
               <svg lucideChevronRight></svg>
            </div>
          </a>
        </ui-list>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<List>;

export const Default: Story = {};

