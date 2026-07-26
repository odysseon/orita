import { Meta, StoryObj } from '@storybook/angular';
import { CoverMedia } from './cover-media';
import { LucideImage } from '@lucide/angular';

const meta: Meta<CoverMedia> = {
  title: 'Surfaces/CoverMedia',
  component: CoverMedia,
  tags: ['autodocs'],
  argTypes: {
    aspectRatio: { control: 'text' },
    overlayGradient: { control: 'boolean' }
  },
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [LucideImage],
    },
    template: `
      <div style="max-width: 400px; border-radius: 12px; overflow: hidden;" class="demo-card">
        <style>
          .demo-card:hover .ui-cover-media__img {
            transform: scale(1.05);
          }
        </style>
        <ui-cover-media 
          [src]="src" 
          [alt]="alt" 
          [aspectRatio]="aspectRatio" 
          [overlayGradient]="overlayGradient"
        >
          <svg cover-placeholder lucideImage style="width: 32px; height: 32px; opacity: 0.3;"></svg>
          <div style="position: absolute; top: 12px; right: 12px; background: oklch(0% 0 0 / 0.5); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
            Overlay Content
          </div>
        </ui-cover-media>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<CoverMedia>;

export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    alt: 'Office space',
    aspectRatio: '16/9',
    overlayGradient: false
  }
};

export const WithGradient: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    alt: 'Office space',
    aspectRatio: '16/9',
    overlayGradient: true
  }
};

export const Placeholder: Story = {
  args: {
    src: null,
    alt: 'No image',
    aspectRatio: '4/3',
    overlayGradient: false
  }
};
