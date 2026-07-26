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
        <ui-tabs defaultValue="profile">
          <ui-tab-list appearance="line" size="md">
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
          </ui-tab-list>
          
          <div style="margin-top: 1.5rem; padding: 1.5rem; background: var(--surface-container); border-radius: var(--radius-md);">
            <ui-tab-panel value="profile">
              Profile settings content here. (Try using Arrow Keys to navigate tabs!)
            </ui-tab-panel>
            <ui-tab-panel value="security">
              Security settings content here.
            </ui-tab-panel>
            <ui-tab-panel value="notifications">
              Notification preferences here.
            </ui-tab-panel>
          </div>
        </ui-tabs>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Pill Appearance</h3>
        <ui-tabs defaultValue="favorites">
          <ui-tab-list appearance="pill" size="md">
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
          </ui-tab-list>
          
          <div style="margin-top: 1.5rem;">
            <ui-tab-panel value="favorites">Favorites content.</ui-tab-panel>
            <ui-tab-panel value="recent">Recent content.</ui-tab-panel>
            <ui-tab-panel value="archived">Archived content.</ui-tab-panel>
          </div>
        </ui-tabs>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Enclosed Appearance (Full Width)</h3>
        <ui-tabs defaultValue="week">
          <ui-tab-list appearance="enclosed" size="sm" [fullWidth]="true">
            <button app-button app-tab-trigger value="day">Day</button>
            <button app-button app-tab-trigger value="week">Week</button>
            <button app-button app-tab-trigger value="month">Month</button>
          </ui-tab-list>
        </ui-tabs>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Sizes (Enclosed)</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <ui-tabs defaultValue="1">
            <ui-tab-list appearance="enclosed" size="sm">
              <button app-button app-tab-trigger value="1">Small Tab</button>
              <button app-button app-tab-trigger value="2">Second</button>
            </ui-tab-list>
          </ui-tabs>
          <ui-tabs defaultValue="1">
            <ui-tab-list appearance="enclosed" size="md">
              <button app-button app-tab-trigger value="1">Medium Tab</button>
              <button app-button app-tab-trigger value="2">Second</button>
            </ui-tab-list>
          </ui-tabs>
          <ui-tabs defaultValue="1">
            <ui-tab-list appearance="enclosed" size="lg">
              <button app-button app-tab-trigger value="1">Large Tab</button>
              <button app-button app-tab-trigger value="2">Second</button>
            </ui-tab-list>
          </ui-tabs>
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
