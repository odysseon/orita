import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  DestroyRef,
} from '@angular/core';
import { LucideUpload, LucideX } from '@lucide/angular';

export interface IMediaPreview {
  url: string;
  isNew: boolean;
  file?: File;
}

@Component({
  selector: 'app-media-selector',
  imports: [LucideUpload, LucideX],
  templateUrl: './media-selector.html',
  styleUrl: './media-selector.css',
})
export class MediaSelector {
  #destroyRef = inject(DestroyRef);

  multiple = input<boolean>(false);
  accept = input<string>('image/*');
  maxSizeMb = input<number>(5);
  initialUrls = input<string[] | string>([]);

  readonly filesChanged = output<File[]>();
  readonly mediaRemoved = output<string>();

  readonly isDragging = signal(false);
  readonly selectedFiles = signal<{ file: File; objectUrl: string }[]>([]);

  readonly previews = computed<IMediaPreview[]>(() => {
    const list: IMediaPreview[] = [];

    // Parse initial URLs input (can be string or string[])
    const initials = this.initialUrls();
    if (initials) {
      const urlsArray = Array.isArray(initials) ? initials : [initials];
      urlsArray.forEach((url) => {
        if (url) {
          list.push({ url, isNew: false });
        }
      });
    }

    // Append newly selected files
    this.selectedFiles().forEach((s) => {
      list.push({ url: s.objectUrl, isNew: true, file: s.file });
    });

    return list;
  });

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.selectedFiles().forEach((s) => URL.revokeObjectURL(s.objectUrl));
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files.length > 0) {
      this.handleFiles(Array.from(inputEl.files));
    }
  }

  private handleFiles(files: File[]): void {
    // Validate types & sizes
    const validFiles = files.filter((file) => {
      const isTypeValid = file.type.match(this.accept().replace('*', '.*'));
      const isSizeValid = file.size / (1024 * 1024) <= this.maxSizeMb();
      return isTypeValid && isSizeValid;
    });

    if (validFiles.length === 0) return;

    const newSelections = validFiles.map((file) => ({
      file,
      objectUrl: URL.createObjectURL(file),
    }));

    if (this.multiple()) {
      this.selectedFiles.update((existing) => [...existing, ...newSelections]);
    } else {
      // Clear old object URL if replacing single file
      this.selectedFiles().forEach((s) => URL.revokeObjectURL(s.objectUrl));
      this.selectedFiles.set([newSelections[0]]);
    }

    this.filesChanged.emit(this.selectedFiles().map((s) => s.file));
  }

  removePreview(preview: IMediaPreview): void {
    if (preview.isNew && preview.file) {
      URL.revokeObjectURL(preview.url);
      
      // Remove from selected files
      this.selectedFiles.update((files) => files.filter((f) => f.file !== preview.file));
      this.filesChanged.emit(this.selectedFiles().map((s) => s.file));
    } else {
      // Remove from initial URLs
      this.mediaRemoved.emit(preview.url);
    }
  }
}
