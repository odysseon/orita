export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'center';

export interface DrawerConfig {
  position: DrawerPosition;
  /** Width for left/right/top/bottom drawers, or dialog width for center. CSS value. */
  size?: string;
  /** Close when backdrop is clicked */
  closeOnBackdrop?: boolean;
  /** Close on Escape key */
  closeOnEscape?: boolean;
  /** Allow drag-to-close and close button */
  dismissible?: boolean;
  /** Show built-in close button in header */
  showCloseButton?: boolean;
  /** Drawer title (renders built-in header when provided) */
  title?: string;
  /** Accessible label for the drawer dialog */
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

/** Velocity threshold (px/ms) above which a flick gesture snaps the drawer closed */
export const VELOCITY_THRESHOLD = 0.9;

/** Distance fraction (0–1) of drawer size beyond which release snaps closed */
export const DISTANCE_THRESHOLD = 0.38;
