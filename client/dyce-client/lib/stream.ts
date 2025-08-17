import { StreamChat } from 'stream-chat';

let client: StreamChat | null = null;

export function getStreamClient() {
  if (!client) {
    client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!);
  }
  return client;
}
