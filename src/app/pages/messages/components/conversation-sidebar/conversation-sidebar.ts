import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideSearch } from '@lucide/angular';
import { ConversationItem } from './conversation-item';
import { IConversationPreview } from '../../../../core/services/messaging.types';

@Component({
  selector: 'app-conversation-sidebar',
  imports: [FormsModule, RouterLink, LucideSearch, ConversationItem],
  templateUrl: './conversation-sidebar.html',
  styleUrl: './conversation-sidebar.css'
})
export class ConversationSidebar {
  conversations = input<IConversationPreview[]>([]);
  activeId = input<string | null>(null);
  
  selectConversation = output<string>();

  searchQuery = signal('');

  // Client-side search for MVP
  filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.conversations() || [];
    
    if (!q) return list;
    
    return list.filter(c => 
      c.title?.toLowerCase().includes(q) || 
      c.latestMessage?.content?.toLowerCase().includes(q)
    );
  });
}
