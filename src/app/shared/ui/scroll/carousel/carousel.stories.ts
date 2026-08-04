import { Meta, StoryObj } from '@storybook/angular';
import { Carousel, CarouselItem } from './carousel';

const meta: Meta<Carousel> = {
  title: 'Scroll/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  render: (args) => ({
    props: args,
    moduleMetadata: {
      imports: [CarouselItem],
    },
    template: `
      <div style="max-width: 400px; border: var(--size-1) solid var(--border-default); overflow: hidden; background: var(--surface-default);">
        <ui-carousel>
          <ui-carousel-item style="width: 80%;">
            <div style="height: 150px; background: var(--clr-primary-container); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--clr-on-primary-container); font-weight: bold;">Card 1</div>
          </ui-carousel-item>
          <ui-carousel-item style="width: 80%;">
            <div style="height: 150px; background: var(--clr-secondary-container); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; color: var(--clr-on-secondary-container); font-weight: bold;">Card 2</div>
          </ui-carousel-item>
          <ui-carousel-item style="width: 80%;">
            <div style="height: 150px; background: var(--surface-container-high); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: bold;">Card 3</div>
          </ui-carousel-item>
          <ui-carousel-item style="width: 80%;">
            <div style="height: 150px; background: var(--surface-container-highest); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-weight: bold;">Card 4</div>
          </ui-carousel-item>
        </ui-carousel>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<Carousel>;

export const Default: Story = {};
