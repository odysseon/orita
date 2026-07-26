import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal } from '@angular/core';
import { Drawer, DrawerSize } from './drawer';
import { DrawerPosition } from './drawer.model';
import { Button } from '../../atoms/button/button';

@Component({
  standalone: true,
  selector: 'app-drawer-story',
  imports: [Drawer, Button],
  template: `
    <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem; align-items: flex-start;">
      <section>
        <h3 style="margin-bottom: 1rem; font-family: sans-serif;">Positions</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          @for (pos of positions; track pos) {
            <button app-button (click)="openDrawer(pos, 'md')">Open {{ pos }}</button>
          }
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; font-family: sans-serif;">Sizes (Right Drawer)</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          @for (s of sizes; track s) {
            <button app-button (click)="openDrawer('right', s)">Size {{ s }}</button>
          }
        </div>
      </section>

      <section>
        <h3 style="margin-bottom: 1rem; font-family: sans-serif;">Special Behaviors</h3>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button app-button appearance="outline" (click)="openScrolling()">Scrolling Content (with Sticky Header)</button>
          <button app-button appearance="outline" (click)="openStrict()">Strict / Non-Dismissible</button>
        </div>
      </section>
    </div>

    <!-- The single dynamic Drawer instance -->
    <app-drawer [(open)]="isOpen" [position]="currentPosition()" [size]="currentSize()" [dismissible]="isDismissible()">
      @if (storyMode() === 'scrolling') {
        <header style="flex-shrink: 0; padding: 1rem; border-bottom: 1px solid var(--border-subtle); position: sticky; top: 0; background: var(--surface-card); z-index: 10; display: flex; justify-content: space-between; align-items: center;">
          <h2 style="margin: 0; font-family: sans-serif; font-size: 1.25rem;">Terms & Conditions</h2>
          <button app-button appearance="ghost" shape="circle" (click)="isOpen.set(false)" aria-label="Close">×</button>
        </header>
        <div style="flex: 1 1 auto; overflow-y: auto; padding: 1rem;">
          <p style="margin-bottom: 1rem; line-height: 1.6; font-family: sans-serif;">Scroll down to see the header stay fixed.</p>
          @for (i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; track i) {
            <p style="margin-bottom: 1rem; line-height: 1.6; font-family: sans-serif;">Section {{ i }}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          }
        </div>
      } @else if (storyMode() === 'strict') {
        <div style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; height: 100%;">
          <h2 style="margin: 0; font-family: sans-serif; font-size: 1.5rem;">Action Required</h2>
          <p style="margin: 0; line-height: 1.6; font-family: sans-serif; flex: 1;">
            You cannot close this drawer by clicking the backdrop, pressing escape, or dragging. You must explicitly agree to continue.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button app-button intent="primary" (click)="isOpen.set(false)">I Agree</button>
          </div>
        </div>
      } @else {
        <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <h2 style="margin: 0; font-family: sans-serif;">{{ currentPosition() }} Drawer</h2>
          <p style="margin: 0; font-family: sans-serif;">Size: {{ currentSize() }}</p>
          <p style="margin: 0; font-family: sans-serif;">Projected content goes here.</p>
        </div>
      }
    </app-drawer>
  `,
})
class DrawerStoryComponent {
  positions: DrawerPosition[] = ['left', 'right', 'top', 'bottom', 'center'];
  sizes: DrawerSize[] = ['sm', 'md', 'lg', 'full'];

  isOpen = signal(false);
  currentPosition = signal<DrawerPosition>('right');
  currentSize = signal<DrawerSize>('md');
  isDismissible = signal(true);
  storyMode = signal<'standard' | 'scrolling' | 'strict'>('standard');

  openDrawer(pos: DrawerPosition, size: DrawerSize) {
    this.currentPosition.set(pos);
    this.currentSize.set(size);
    this.isDismissible.set(true);
    this.storyMode.set('standard');
    this.isOpen.set(true);
  }

  openScrolling() {
    this.currentPosition.set('right');
    this.currentSize.set('md');
    this.isDismissible.set(true);
    this.storyMode.set('scrolling');
    this.isOpen.set(true);
  }

  openStrict() {
    this.currentPosition.set('center');
    this.currentSize.set('md');
    this.isDismissible.set(false);
    this.storyMode.set('strict');
    this.isOpen.set(true);
  }
}

const meta: Meta<Drawer> = {
  title: 'Overlays/Drawer',
  component: Drawer,
};

export default meta;

export const Showcase: StoryObj<DrawerStoryComponent> = {
  render: () => ({
    moduleMetadata: {
      imports: [DrawerStoryComponent],
    },
    template: `<app-drawer-story />`,
  }),
};
