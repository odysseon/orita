import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IConversation, IConversationPreview, IMessage, CreateConversationDto, SendMessageDto } from './messaging.types';

@Service()
export class MessagingApiService {
  #http = inject(HttpClient);
  #apiUrl = environment.apiUrl;

  getConversations(): Observable<IConversationPreview[]> {
    return this.#http.get<IConversationPreview[]>(`${this.#apiUrl}/conversations`);
  }

  getConversationDetails(id: string): Observable<IConversation> {
    return this.#http.get<IConversation>(`${this.#apiUrl}/conversations/${id}`);
  }

  createConversation(dto: CreateConversationDto): Observable<IConversation> {
    return this.#http.post<IConversation>(`${this.#apiUrl}/conversations`, dto);
  }

  openConversation(targetType: 'USER' | 'BUSINESS' | 'OPPORTUNITY', targetId: string): Observable<IConversation> {
    return this.#http.post<IConversation>(`${this.#apiUrl}/conversations/open`, { targetType, targetId });
  }

  sendMessage(conversationId: string, dto: SendMessageDto): Observable<IMessage> {
    return this.#http.post<IMessage>(`${this.#apiUrl}/conversations/${conversationId}/messages`, dto);
  }

  markMessagesRead(conversationId: string, messageIds: string[]): Observable<void> {
    return this.#http.post<void>(`${this.#apiUrl}/conversations/${conversationId}/read-receipts`, { messageIds });
  }

  updateConversationStatus(id: string, status: 'ACTIVE' | 'CLOSED'): Observable<IConversation> {
    return this.#http.patch<IConversation>(`${this.#apiUrl}/conversations/${id}/status`, { status });
  }
}
