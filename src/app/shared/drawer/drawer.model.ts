export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';

export interface DrawerConfig {
  position: DrawerPosition;
  size?: string;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export const DRAWER_DEFAULTS: Required<DrawerConfig> = {
  position: 'right',
  size: '400px',
  closeOnBackdrop: true,
  closeOnEscape: true,
};

export const VELOCITY_THRESHOLD = 0.4;
export const DISTANCE_THRESHOLD = 0.4;
