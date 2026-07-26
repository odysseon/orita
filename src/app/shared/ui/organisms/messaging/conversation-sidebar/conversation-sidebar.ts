import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideMessageCircleMore } from '@lucide/angular';
import { ConversationListItem } from '../../../../shared/ui/organisms/list-items/conversation-list-item/conversation-list-item';
import { SearchBar } from '../../../../shared/ui/molecules/search-bar/search-bar';
import { InputDirective } from '../../../../shared/ui/atoms/forms';
import { IConversationPreview } from '../../../../core/services/messaging.types';
import { Button } from '../../../../shared/ui/atoms/button/button';

@Component({
  selector: 'app-conversation-sidebar',
  imports: [FormsModule, RouterLink, LucideMessageCircleMore, ConversationListItem, SearchBar, InputDirective, Button],
  templateUrl: './conversation-sidebar.html',
  styleUrl: './conversation-sidebar.css'
})
export class ConversationSidebar {
  conversations = input<IConversationPreview[]>([]);
  activeId = input<string | null>(null);
  
  selectConversation = output<string>();

  searchQuery = signal('');

  filteredConversations = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const list = this.conversations() || [];
    
    if (!q) return list;
    
    return list.filter(c => 
      c.title?.toLowerCase().includes(q) || 
      c.latestMessage?.content?.toLowerCase().includes(q)
    );
  });

  toListItemDto(conv: IConversationPreview) {
    let snippet = '';
    if (conv.latestMessage?.descriptor) {
      const desc = conv.latestMessage.descriptor;
      if (desc.kind === 'TEXT') snippet = desc.text;
      else if (desc.kind === 'EMBED') snippet = 'Attachment';
      else if (desc.kind === 'ATTACHMENT') snippet = 'Photo / File';
      else if (desc.kind === 'SYSTEM') snippet = desc.text;
    } else {
      snippet = conv.latestMessage?.content || 'No messages yet';
    }

    return {
      id: conv.id,
      participant: {
        id: conv.id,
        name: conv.title || 'Conversation',
        avatarUrl: conv.avatarUrl || null,
      },
      lastMessageSnippet: snippet,
      lastMessageAt: conv.lastActivityAt ? new Date(conv.lastActivityAt) : new Date(),
      unreadCount: conv.unreadCount || 0
    };
  }
}
