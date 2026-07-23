import type { Meta, StoryObj } from '@storybook/angular';
import { Button } from './button';
import { LucideSearch, LucideHeart, LucideTrash } from '@lucide/angular';
import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-button-regression',
  imports: [Button, LucideSearch, LucideHeart, LucideTrash],
  template: `
    <div style="display: flex; flex-direction: column; gap: 3rem; padding: 2rem;">
      @for (intent of intents; track intent) {
        <section>
          <h2 style="margin-bottom: 1rem; text-transform: capitalize; font-family: sans-serif;">{{ intent }}</h2>
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            @for (appearance of appearances; track appearance) {
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <h3 style="margin: 0; font-family: sans-serif; font-size: 0.9rem; color: #666;">{{ appearance }}</h3>
                
                <!-- Sizes -->
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                  @for (size of sizes; track size) {
                    <button app-button [intent]="intent" [appearance]="appearance" [size]="size">
                      Size {{ size }}
                    </button>
                  }
                </div>

                <!-- Modifiers -->
                <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-top: 0.5rem;">
                  <button app-button [intent]="intent" [appearance]="appearance" loading>
                    Loading
                  </button>
                  <button app-button [intent]="intent" [appearance]="appearance" disabled>
                    Disabled
                  </button>
                  <button app-button [intent]="intent" [appearance]="appearance" shape="square" aria-label="Search">
                    <svg lucideSearch></svg>
                  </button>
                  <button app-button [intent]="intent" [appearance]="appearance" shape="circle" aria-label="Like">
                    <svg lucideHeart></svg>
                  </button>
                  <button app-button [intent]="intent" [appearance]="appearance" shape="pill">
                    Pill Shape
                  </button>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <section>
        <h2 style="margin-bottom: 1rem; font-family: sans-serif;">Full Width</h2>
        <button app-button intent="primary" appearance="solid" fullWidth>
          I span the entire container
        </button>
      </section>
    </div>
  `,
})
class ButtonRegressionComponent {
  intents = ['primary', 'secondary', 'success', 'warning', 'danger'] as const;
  appearances = ['solid', 'outline', 'ghost', 'soft', 'link', 'plain'] as const;
  sizes = ['xs', 'sm', 'md', 'lg'] as const;
}

const meta: Meta<Button> = {
  title: 'Atoms/Button',
  component: Button,
};

export default meta;

type Story = StoryObj<Button>;

export const Default: Story = {
  args: {
    intent: 'primary',
    appearance: 'solid',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<button app-button [intent]="intent" [appearance]="appearance" [size]="size" [disabled]="disabled" [loading]="loading" [fullWidth]="fullWidth" [type]="type">Button Text</button>`,
  }),
};

export const RegressionGrid: StoryObj<ButtonRegressionComponent> = {
  render: () => ({
    moduleMetadata: {
      imports: [ButtonRegressionComponent],
    },
    template: `<app-button-regression />`,
  }),
};
