import { Component, input } from '@angular/core';

@Component({
  selector: 'app-legal-contact',
  standalone: true,
  template: `
    <div class="legal-contact">
      <h2>Questions?</h2>
      <p>If you have any questions regarding this policy, please contact us:</p>
      <div class="legal-contact__links">
        @if (showPrivacy()) {
          <a href="mailto:aanusteven8@gmail.com">aanusteven8&#64;gmail.com</a>
        }
        @if (showLegal()) {
          <a href="mailto:aanusteven8@gmail.com">aanusteven8&#64;gmail.com</a>
        }
      </div>
    </div>
  `,
  styles: [`
    .legal-contact {
      margin-top: var(--size-48);
      padding: var(--size-32);
      background: var(--surface-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
    }
    .legal-contact h2 {
      margin-top: 0;
      margin-bottom: var(--size-12);
    }
    .legal-contact p {
      margin-bottom: var(--size-16);
      color: var(--text-secondary);
    }
    .legal-contact__links {
      display: flex;
      gap: var(--size-16);
    }
    .legal-contact__links a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: 500;
    }
    .legal-contact__links a:hover {
      text-decoration: underline;
    }
  `]
})
export class LegalContact {
  showPrivacy = input<boolean>(true);
  showLegal = input<boolean>(true);
}
