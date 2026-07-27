import { InjectionToken } from '@angular/core';

export interface SaveButtonI18n {
  save: string;
  unsave: string;
}

export const SAVE_BUTTON_I18N = new InjectionToken<SaveButtonI18n>('save-button.i18n', {
  factory: () => ({
    save: 'Save',
    unsave: 'Saved',
  }),
});
