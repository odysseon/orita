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
  readonly selectedFiles = signal<File[]>([]);

  // Track created local object URLs to revoke them and prevent leaks
  readonly localObjectUrls = signal<string[]>([]);

  // Computed previews list containing both initial URLs and newly selected files
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
    this.selectedFiles().forEach((file) => {
      const objectUrl = URL.createObjectURL(file);
      this.localObjectUrls.update((urls) => [...urls, objectUrl]);
      list.push({ url: objectUrl, isNew: true, file });
    });

    return list;
  });

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.clearLocalUrls();
    });
  }

  private clearLocalUrls(): void {
    this.localObjectUrls().forEach((url) => URL.revokeObjectURL(url));
    this.localObjectUrls.set([]);
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

    // Reset previous object URLs to prevent accumulation
    this.clearLocalUrls();

    if (this.multiple()) {
      this.selectedFiles.update((existing) => [...existing, ...validFiles]);
    } else {
      this.selectedFiles.set([validFiles[0]]);
    }

    this.filesChanged.emit(this.selectedFiles());
  }

  removePreview(preview: IMediaPreview): void {
    if (preview.isNew && preview.file) {
      // Clean up object URL
      URL.revokeObjectURL(preview.url);
      this.localObjectUrls.update((urls) => urls.filter((u) => u !== preview.url));

      // Remove from selected files
      this.selectedFiles.update((files) => files.filter((f) => f !== preview.file));
      this.filesChanged.emit(this.selectedFiles());
    } else {
      // Remove from initial URLs
      this.mediaRemoved.emit(preview.url);
    }
  }
}
