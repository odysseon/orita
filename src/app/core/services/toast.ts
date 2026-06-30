import { Service, signal } from '@angular/core';

export type ToastIntent = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  intent: ToastIntent;
  title: string;
  message?: string;
}

let nextId = 0;

@Service()
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  success(title: string, message?: string): void {
    this.#push('success', title, message);
  }

  error(title: string, message?: string): void {
    this.#push('error', title, message);
  }

  info(title: string, message?: string): void {
    this.#push('info', title, message);
  }

  warning(title: string, message?: string): void {
    this.#push('warning', title, message);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  #push(intent: ToastIntent, title: string, message?: string): void {
    const id = nextId++;
    this.toasts.update((list) => [...list, { id, intent, title, message }]);
    setTimeout(() => this.dismiss(id), 4000);
  }
}
