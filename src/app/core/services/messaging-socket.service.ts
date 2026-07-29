import { Service, inject, OnDestroy, effect } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { 
  WsMessageNewEvent, 
  WsReadReceiptEvent, 
  SendMessageDto 
} from './messaging.types';

@Service()
export class MessagingSocket implements OnDestroy {
  #auth = inject(AuthService);
  #socket: Socket | null = null;
  #apiUrl = environment.apiUrl.replace('/api', '');

  // Emit events to the Store
  #messageNew$ = new Subject<WsMessageNewEvent>();
  #messageRead$ = new Subject<WsReadReceiptEvent>();
  #connected$ = new Subject<void>();

  readonly messageNew$: Observable<WsMessageNewEvent> = this.#messageNew$.asObservable();
  readonly messageRead$: Observable<WsReadReceiptEvent> = this.#messageRead$.asObservable();
  readonly connected$: Observable<void> = this.#connected$.asObservable();

  constructor() {
    effect(() => {
      const token = this.#auth.token();
      if (this.#socket) {
        this.#socket.auth = { token };
        if (!token) {
          this.disconnect();
        }
      }
    });
  }

  connect(): void {
    if (this.#socket?.connected) return;

    // Use token from auth service for standard WS auth if your backend expects it in query or header
    // Our WS backend has a WsAuthGuard that expects auth. We pass token via query or auth object.
    const token = this.#auth.token();
    
    this.#socket = io(`${this.#apiUrl}/ws/messaging`, {
      auth: (cb: (data: { token?: string }) => void) => cb({ token: this.#auth.token() }),
      transports: ['websocket'],
      withCredentials: true
    });

    this.#socket.on('connect', () => {
      console.log('MessagingSocket connected');
      this.#connected$.next();
    });

    this.#socket.on('disconnect', () => {
      console.log('MessagingSocket disconnected');
    });

    this.#socket.on('message:new', (event: WsMessageNewEvent) => {
      this.#messageNew$.next(event);
    });

    this.#socket.on('message:read', (event: WsReadReceiptEvent) => {
      this.#messageRead$.next(event);
    });
  }

  disconnect(): void {
    this.#socket?.disconnect();
    this.#socket = null;
  }

  joinConversation(conversationId: string): void {
    this.#socket?.emit('conversation:join', { conversationId });
  }

  sendMessage(conversationId: string, dto: SendMessageDto): void {
    this.#socket?.emit('message:send', { 
      conversationId, 
      ...dto 
    });
  }

  markRead(conversationId: string, messageIds: string[]): void {
    this.#socket?.emit('message:read', { 
      conversationId, 
      messageIds 
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
