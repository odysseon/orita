import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';
import { DropdownTrigger } from './dropdown';
import { Menu, MenuItem, MenuSeparator } from '../menu/menu';
import { Button } from '../../atoms/button/button';
import { LucideUser, LucideSettings, LucideLogOut } from '@lucide/angular';

@Component({
  selector: 'app-dropdown-story',
  standalone: true,
  imports: [DropdownTrigger, Menu, MenuItem, MenuSeparator, Button, LucideUser, LucideSettings, LucideLogOut],
  template: `
    <div style="padding: 4rem; display: flex; flex-direction: column; gap: 4rem; background: var(--surface-page); align-items: center; min-height: 100vh;">
      
      <section style="text-align: center; width: 100%; max-width: 600px;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Basic Menu Dropdown</h3>
        <button app-button [appDropdownTrigger]="menu1" position="bottom-center">
          Open Menu
        </button>

        <ng-template #menu1>
          <app-menu>
            <button app-menu-item>
              <svg lucideUser></svg>
              View Profile
            </button>
            <button app-menu-item>
              <svg lucideSettings></svg>
              Settings
            </button>
            <hr app-menu-separator />
            <button app-menu-item intent="danger">
              <svg lucideLogOut></svg>
              Log Out
            </button>
          </app-menu>
        </ng-template>
      </section>

      <section style="text-align: center; width: 100%; max-width: 600px;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Long Menu (Scrollable)</h3>
        <button app-button appearance="outline" [appDropdownTrigger]="menu2" position="bottom-start">
          Open Long Menu
        </button>

        <ng-template #menu2>
          <app-menu>
            @for (i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; track i) {
              <button app-menu-item>Item {{ i }}</button>
            }
          </app-menu>
        </ng-template>
        <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.85rem; font-family: sans-serif;">
          Test Typeahead: open this menu and type a number quickly (e.g. "12") to jump to it.
        </p>
      </section>

      <section style="text-align: center; width: 100%; max-width: 600px; margin-top: auto; padding-top: 5rem;">
        <h3 style="margin-bottom: 2rem; color: var(--text-primary); font-family: sans-serif;">Collision Detection (Bottom Edge)</h3>
        <button app-button intent="primary" [appDropdownTrigger]="menu3" position="bottom-end">
          I'm near the bottom
        </button>

        <ng-template #menu3>
          <app-menu>
            <button app-menu-item>Should flip up!</button>
            <button app-menu-item>Item 2</button>
            <button app-menu-item>Item 3</button>
          </app-menu>
        </ng-template>
      </section>

    </div>
  `
})
class DropdownStoryComponent {}

const meta: Meta<DropdownTrigger> = {
  title: 'Overlays/Dropdown & Menu',
  component: DropdownTrigger,
};
export default meta;

export const Showcase: StoryObj<DropdownTrigger> = {
  render: () => ({
    moduleMetadata: {
      imports: [DropdownStoryComponent],
    },
    template: `<app-dropdown-story />`,
  }),
};
