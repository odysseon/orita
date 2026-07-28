import { InjectionToken } from '@angular/core';

export interface AttachButtonI18n {
  attach: string;
}

export const ATTACH_BUTTON_I18N = new InjectionToken<AttachButtonI18n>('attach-button.i18n', {
  factory: () => ({
    attach: 'Attach file',
  }),
});
