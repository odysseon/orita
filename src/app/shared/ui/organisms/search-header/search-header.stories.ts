import type { Meta, StoryObj } from '@storybook/angular';
import { SearchHeader } from './search-header';
import { provideRouter } from '@angular/router';

const meta: Meta<SearchHeader> = {
  title: 'Organisms/Headers/SearchHeader',
  component: SearchHeader,
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      ...story(),
      providers: [provideRouter([])]
    })
  ],
  render: (args) => ({
    props: args,
    template: `
      <div style="height: 300px; background: var(--surface-container-low); margin: -1rem;">
        <app-search-header 
          [avatarSrc]="avatarSrc" 
          [sticky]="sticky"
          [placeholder]="placeholder"
          [query]="query"
        ></app-search-header>
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<SearchHeader>;

export const Default: Story = {
  args: {
    avatarSrc: 'https://i.pravatar.cc/150?img=11',
    sticky: true,
    placeholder: 'Search places, people...',
    query: ''
  },
};
