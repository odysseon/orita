import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucidePlus, LucideX } from '@lucide/angular';
import { Button } from '../../../../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-tour-form-highlights',
  imports: [FormsModule, LucidePlus, LucideX, Button],
  templateUrl: './tour-form-highlights.html',
  styleUrl: './tour-form-highlights.css'
})
export class TourFormHighlights {
  items = input<string[]>([]);
  readonly itemsChange = output<string[]>();

  newItem = signal('');

  addItem(): void {
    const val = this.newItem().trim();
    if (!val) return;
    
    const next = [...this.items(), val];
    this.itemsChange.emit(next);
    this.newItem.set('');
  }

  removeItem(index: number): void {
    const next = [...this.items()];
    next.splice(index, 1);
    this.itemsChange.emit(next);
  }
}
