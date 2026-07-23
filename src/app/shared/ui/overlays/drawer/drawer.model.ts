export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';

export interface DrawerConfig {
  position: DrawerPosition;
  size?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  dismissible?: boolean;
  showCloseButton?: boolean;
  title?: string;
  ariaLabel?: string;
}

export const DRAWER_DEFAULTS: Required<Omit<DrawerConfig, 'title'>> = {
  position: 'right',
  size: '400px',
  closeOnBackdrop: true,
  closeOnEscape: true,
  dismissible: true,
  showCloseButton: true,
  ariaLabel: 'Drawer',
};

export const VELOCITY_THRESHOLD = 0.4;
export const DISTANCE_THRESHOLD = 0.4;
