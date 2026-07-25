export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerConfig {
  position: DrawerPosition;
  size?: DrawerSize;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  dismissible?: boolean;
  showCloseButton?: boolean;
  title?: string;
  ariaLabel?: string;
}

export const DRAWER_DEFAULTS: Required<Omit<DrawerConfig, 'title'>> = {
  position: 'right',
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true,
  dismissible: true,
  showCloseButton: true,
  ariaLabel: 'Drawer',
};

export const VELOCITY_THRESHOLD = 0.4;
export const DISTANCE_THRESHOLD = 0.4;
