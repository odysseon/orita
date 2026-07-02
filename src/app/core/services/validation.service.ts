import { Service } from '@angular/core';
import { required, pattern } from '@angular/forms/signals';

@Service()
export class ValidationService {
  private readonly PASSWORD_PATTERN: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  private readonly PASSWORD_MESSAGE =
    'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character.';

  validatePassword(field: any) {
    required(field, { message: 'Password is required' });
    pattern(field, this.PASSWORD_PATTERN, { message: this.PASSWORD_MESSAGE });
  }
}
