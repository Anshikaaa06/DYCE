
export interface Match {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isTyping?: boolean;
  isOnline?: boolean;
  isNewMatch?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  timestamp: string;
  status: 'sent' | 'delivered' | 'seen';
  duration?: number; // for voice messages
  reactions?: string[];
}