import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { Tabs, TabList, TabTrigger, TabPanel } from './index';
import { Button } from '../../atoms/button/button';
import { LucideSettings, LucideUser, LucideBell, LucideStar } from '@lucide/angular';

@Component({
  selector: 'app-tabs-story',
  standalone: true,
  imports: [Tabs, TabList, TabTrigger, TabPanel, Button, LucideSettings, LucideUser, LucideBell, LucideStar],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page); font-family: sans-serif;">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Line Appearance (Default)</h3>
        <app-tabs defaultValue="profile">
          <app-tab-list appearance="line" size="md">
            <button app-button app-tab-trigger value="profile">
              <svg lucideUser></svg>
              Profile
            </button>
            <button app-button app-tab-trigger value="security">
              <svg lucideSettings></svg>
              Security
            </button>
            <button app-button app-tab-trigger value="notifications">
              <svg lucideBell></svg>
              Notifications
            </button>
          </app-tab-list>
          
          <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--surface-container); border-radius: var(--radius-md);">
            <app-tab-panel value="profile">
              Profile settings content here. (Try using Arrow Keys to navigate tabs!)
            </app-tab-panel>
            <app-tab-panel value="security">
              Security settings content here.
            </app-tab-panel>
            <app-tab-panel value="notifications">
              Notification preferences here.
            </app-tab-panel>
          </div>
        </app-tabs>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Pill Appearance</h3>
        <app-tabs defaultValue="favorites">
          <app-tab-list appearance="pill" size="md">
            <button app-button app-tab-trigger value="favorites">
              <svg lucideStar></svg>
              Favorites
            </button>
            <button app-button app-tab-trigger value="recent">
              Recent
            </button>
            <button app-button app-tab-trigger value="archived">
              Archived
            </button>
          </app-tab-list>
          
          <div style="margin-top: 1.5rem;">
            <app-tab-panel value="favorites">Favorites content.</app-tab-panel>
            <app-tab-panel value="recent">Recent content.</app-tab-panel>
            <app-tab-panel value="archived">Archived content.</app-tab-panel>
          </div>
        </app-tabs>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Enclosed Appearance (Full Width)</h3>
        <app-tabs defaultValue="week">
          <app-tab-list appearance="enclosed" size="sm" [fullWidth]="true">
            <button app-button app-tab-trigger value="day">Day</button>
            <button app-button app-tab-trigger value="week">Week</button>
            <button app-button app-tab-trigger value="month">Month</button>
          </app-tab-list>
        </app-tabs>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Sizes (Enclosed)</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <app-tabs defaultValue="1">
            <app-tab-list appearance="enclosed" size="sm">
              <button app-button app-tab-trigger value="1">Small Tab</button>
              <button app-button app-tab-trigger value="2">Second</button>
            </app-tab-list>
          </app-tabs>
          <app-tabs defaultValue="1">
            <app-tab-list appearance="enclosed" size="md">
              <button app-button app-tab-trigger value="1">Medium Tab</button>
              <button app-button app-tab-trigger value="2">Second</button>
            </app-tab-list>
          </app-tabs>
          <app-tabs defaultValue="1">
            <app-tab-list appearance="enclosed" size="lg">
              <button app-button app-tab-trigger value="1">Large Tab</button>
              <button app-button app-tab-trigger value="2">Second</button>
            </app-tab-list>
          </app-tabs>
        </div>
      </section>
      
    </div>
  `
})
class TabsStoryComponent {
}

const meta: Meta<Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
};
export default meta;

export const Showcase: StoryObj<Tabs> = {
  render: () => ({
    moduleMetadata: {
      imports: [TabsStoryComponent],
    },
    template: `<app-tabs-story />`,
  }),
};
