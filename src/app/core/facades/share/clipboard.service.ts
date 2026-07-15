import { Service } from '@angular/core';

@Service()
export class ClipboardService {
  async copy(text: string): Promise<void> {
    if (!navigator.clipboard) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textArea);
      }
      return;
    }
    
    await navigator.clipboard.writeText(text);
  }
}
