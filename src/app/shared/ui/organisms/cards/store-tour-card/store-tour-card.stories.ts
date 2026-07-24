import { Meta, StoryObj } from '@storybook/angular';
import { StoreTourCard } from './store-tour-card';
import { LucidePlay, LucideCalendar } from '@lucide/angular';
import { Button } from '../../../atoms/button/button';
import { Fab } from '../../../actions/fab/fab';

const meta: Meta<StoreTourCard> = {
  title: 'Organisms/Cards/StoreTourCard',
  component: StoreTourCard,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [LucidePlay, LucideCalendar, Button, Fab],
    },
    template: `
      <div style="max-width: 360px;">
        <style>
          .duration-badge {
            position: absolute;
            bottom: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 12px;
            font-weight: 500;
            padding: 2px 6px;
            border-radius: 4px;
          }
        </style>
        
        <a class="ui-store-tour-card">
          <ui-store-tour-card [tour]="tour">
            <!-- Media Overlay Slot -->
            <div card-media-overlay>
              <button ui-fab appearance="glass" intent="primary" size="sm" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                <svg lucidePlay style="width: 20px; height: 20px; fill: white; margin-left: 2px;"></svg>
              </button>
              <div class="duration-badge">12:45</div>
            </div>
            
            <!-- Summary Slot -->
            <div card-summary>
              Join us for a detailed walkthrough of our new flagship store in Victoria Island. We'll show you the exclusive collections and behind-the-scenes.
            </div>
            
            <!-- Actions Slot -->
            <div card-actions style="display: flex; width: 100%; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 13px;">
                <svg lucideCalendar style="width: 14px; height: 14px;"></svg>
                <span>Oct 12 • 2:00 PM</span>
              </div>
              <button uiButton intent="secondary" size="sm" appearance="ghost">Set Reminder</button>
            </div>
          </ui-store-tour-card>
        </a>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<StoreTourCard>;

export const Default: Story = {
  args: {
    tour: {
      id: 'tour1',
      title: 'Flagship Store Grand Opening Tour',
      thumbnailUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
      business: {
        id: 'biz1',
        name: 'Orita Originals',
        logoUrl: 'https://i.pravatar.cc/150?u=orita',
        isVerified: true
      }
    }
  }
};
