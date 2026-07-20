export type ConversationType = 'DIRECT' | 'GROUP';
export type ConversationStatus = 'ACTIVE' | 'CLOSED';
export type MediaType = 'IMAGE' | 'VIDEO';
export type MessageSyncState = 'LOCAL' | 'SENDING' | 'FAILED' | 'SYNCED';

export interface IMessageReadReceipt {
  messageId: string;
  participantId: string;
  readAt: string;
}

export interface IMessageEmbed {
  id: string;
  embedType: string;
  targetId: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaLabel?: string | null;
  ctaPath?: string | null;
}

export interface IMessage {
  id: string;
  conversationId: string;
  participantId: string;
  senderDisplayName: string;
  senderAvatarUrl?: string | null;
  content?: string | null;
  mediaUrl?: string | null;
  mediaType?: MediaType | null;
  embeds: IMessageEmbed[];
  createdAt: string;
  readReceipts: IMessageReadReceipt[];
  
  // UI state for optimistic updates
  syncState?: MessageSyncState;
}

export interface IConversationAnchor {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  businessId?: string | null;
  listingId?: string | null;
  tourId?: string | null;
  locationId?: string | null;
}

export type IMessagePreviewDescriptor =
  | { kind: 'TEXT'; text: string }
  | { kind: 'EMBED'; embedType: string }
  | { kind: 'ATTACHMENT'; attachmentType: string }
  | { kind: 'SYSTEM'; text: string };

export interface IMessagePreview {
  id: string;
  content?: string | null;
  participantId: string;
  senderDisplayName: string;
  createdAt: string;
  descriptor: IMessagePreviewDescriptor;
}

export interface IConversationPreview {
  id: string;
  type: ConversationType;
  title: string;
  avatarUrl?: string | null;
  anchor?: IConversationAnchor | null;
  latestMessage?: IMessagePreview;
  unreadCount: number;
  lastActivityAt: string;
}

export type ConversationLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface IConversation {
  id: string;
  type: ConversationType;
  status: ConversationStatus;
  title?: string | null;
  avatarUrl?: string | null;
  anchorId?: string | null;
  anchor?: IConversationAnchor | null;
  participantIds: string[];
  createdAt: string;
  updatedAt: string;
  messages?: IMessage[];
  viewer?: { participantId: string };
  
  // Computed UI state
  unreadCount?: number;
  lastActivityAt?: string;
  latestMessage?: IMessagePreview;
}

export interface CreateConversationDto {
  type: ConversationType;
  invitedParticipantIds: string[];
  anchor?: { type: string; targetId: string };
  initialMessage?: string;
}

export interface SendMessageDto {
  content?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  embeds?: { embedType: string; targetId: string }[];
}

export interface WsMessageNewEvent {
  conversationId: string;
  message: IMessage;
}

export interface WsReadReceiptEvent {
  conversationId: string;
  messageId: string;
  participantId: string;
  readAt: string;
}

export interface PendingAttachment {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: number;
}

export interface QueuedMessage {
  id: string;
  conversationId: string;
  payload: SendMessageDto;
  attemptCount: number;
  lastError: string | null;
  lastAttemptAt: number | null;
  createdAt: number;
  status: 'LOCAL' | 'SENDING' | 'FAILED';
  attachments?: PendingAttachment[];
}
