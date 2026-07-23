import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { Component } from '@angular/core';
import { Breadcrumb, BreadcrumbItem } from './breadcrumb';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-breadcrumb-story',
  standalone: true,
  imports: [Breadcrumb, BreadcrumbItem],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 3rem; background: var(--surface-page);">
      
      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Chevron Separator (Default)</h3>
        <app-breadcrumb>
          <app-breadcrumb-item href="#">Dashboard</app-breadcrumb-item>
          <app-breadcrumb-item href="#">Users</app-breadcrumb-item>
          <app-breadcrumb-item href="#">Active</app-breadcrumb-item>
          <app-breadcrumb-item>Alice Smith</app-breadcrumb-item>
        </app-breadcrumb>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Slash Separator</h3>
        <app-breadcrumb separator="slash">
          <app-breadcrumb-item href="#">Home</app-breadcrumb-item>
          <app-breadcrumb-item href="#">Products</app-breadcrumb-item>
          <app-breadcrumb-item href="#">Electronics</app-breadcrumb-item>
          <app-breadcrumb-item>Laptops</app-breadcrumb-item>
        </app-breadcrumb>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Dot Separator</h3>
        <app-breadcrumb separator="dot">
          <app-breadcrumb-item href="#">Organization</app-breadcrumb-item>
          <app-breadcrumb-item href="#">Engineering</app-breadcrumb-item>
          <app-breadcrumb-item>Frontend Team</app-breadcrumb-item>
        </app-breadcrumb>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Small Size</h3>
        <app-breadcrumb size="sm">
          <app-breadcrumb-item href="#">Files</app-breadcrumb-item>
          <app-breadcrumb-item href="#">Documents</app-breadcrumb-item>
          <app-breadcrumb-item>Q3_Report.pdf</app-breadcrumb-item>
        </app-breadcrumb>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; color: var(--text-primary); font-family: sans-serif;">Action Callbacks</h3>
        <app-breadcrumb>
          <app-breadcrumb-item (action)="log('Home clicked!')">Home (Callback)</app-breadcrumb-item>
          <app-breadcrumb-item (action)="log('Settings clicked!')">Settings (Callback)</app-breadcrumb-item>
          <app-breadcrumb-item>Profile</app-breadcrumb-item>
        </app-breadcrumb>
      </section>
      
    </div>
  `
})
class BreadcrumbStoryComponent {
  log(msg: string) {
    console.log(msg);
  }
}

const meta: Meta<Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
};
export default meta;

export const Showcase: StoryObj<Breadcrumb> = {
  render: () => ({
    moduleMetadata: {
      imports: [BreadcrumbStoryComponent],
    },
    template: `<app-breadcrumb-story />`,
  }),
  decorators: [
    applicationConfig({
      providers: [provideRouter([])]
    })
  ]
};
