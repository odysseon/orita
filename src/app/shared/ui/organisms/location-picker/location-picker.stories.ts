import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { LocationPicker } from './location-picker';
import { LocationService } from '../../../../core/services/location.service';
import { FollowService } from '../../../../core/services/follow.service';
import { of, delay } from 'rxjs';

class MockLocationService {
  getCurrentPosition() {
    return new Promise(resolve => {
      setTimeout(() => resolve({ coords: { latitude: 6.52, longitude: 3.37 } }), 1000);
    });
  }
  reverseGeocode(lat: number, lng: number) {
    return of({
      id: 'mock-loc-gps',
      name: 'Lagos',
      formattedAddress: 'Lagos, Nigeria',
      latitude: lat,
      longitude: lng
    }).pipe(delay(500));
  }
  search(query: string) {
    const all = [
      { id: '1', name: 'Lagos', formattedAddress: 'Lagos, Nigeria', latitude: 0, longitude: 0 },
      { id: '2', name: 'Lagos Island', formattedAddress: 'Lagos, Nigeria', latitude: 0, longitude: 0 },
      { id: '3', name: 'Lagos Mainland', formattedAddress: 'Lagos, Nigeria', latitude: 0, longitude: 0 },
    ];
    const filtered = all.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));
    return of(filtered).pipe(delay(300));
  }
}

class MockFollowService {
  getStatus(type: string, id: string) {
    return of({ following: false }).pipe(delay(200));
  }
}

const meta: Meta<LocationPicker> = {
  title: 'Organisms/LocationPicker',
  component: LocationPicker,
  decorators: [
    applicationConfig({
      providers: [
        { provide: LocationService, useClass: MockLocationService },
        { provide: FollowService, useClass: MockFollowService }
      ]
    })
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<LocationPicker>;

export const Default: Story = {
  args: {
    triggerLabel: 'Set Location',
  }
};
