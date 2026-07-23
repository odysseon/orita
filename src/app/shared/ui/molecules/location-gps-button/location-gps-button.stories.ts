import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { LocationGpsButton } from './location-gps-button';
import { LocationService } from '../../../../core/services/location.service';
import { of, delay } from 'rxjs';
import { importProvidersFrom } from '@angular/core';

class MockLocationService {
  getCurrentPosition() {
    return new Promise(resolve => {
      setTimeout(() => resolve({ coords: { latitude: 6.52, longitude: 3.37 } }), 1000);
    });
  }
  reverseGeocode(lat: number, lng: number) {
    return of({
      id: 'mock-loc-1',
      name: 'Lagos',
      formattedAddress: 'Lagos, Nigeria',
      latitude: lat,
      longitude: lng
    }).pipe(delay(500));
  }
}

const meta: Meta<LocationGpsButton> = {
  title: 'Molecules/LocationGpsButton',
  component: LocationGpsButton,
  decorators: [
    applicationConfig({
      providers: [
        { provide: LocationService, useClass: MockLocationService }
      ]
    })
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<LocationGpsButton>;

export const Default: Story = {
  args: {
    label: 'Use my current location',
    loadingLabel: 'Locating...'
  }
};
