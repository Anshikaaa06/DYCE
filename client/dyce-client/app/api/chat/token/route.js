import { NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const token = serverClient.createToken(userId);
  return NextResponse.json({ token });
}
