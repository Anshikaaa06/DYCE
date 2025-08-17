"use client";

import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Window,
  LoadingIndicator,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStreamClient } from "@/lib/stream";
import { useAuthStore } from "@/stores/auth-store";

import "stream-chat-react/dist/css/v2/index.css"; // Optional: include Stream's base styles
import { ArrowLeft, Unlink } from "lucide-react";

interface ChatViewProps {
  otherUser: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export default function ChatView({ otherUser }: ChatViewProps) {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showUnmatchModal, setShowUnmatchModal] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const client = getStreamClient();
    const initChat = async () => {

      // Only connect once per user
      if (!client.userID) {
        const tokenRes = await fetch(`/api/chat/token?userId=${user.id}`);
        const { token } = await tokenRes.json();

        await client.connectUser(
          {
            id: user.id,
            name: user.name,
            image: user.avatar,
          },
          token
        );
      }

      // Create or get existing channel
      const chatChannel = client.channel("messaging", {
        members: [user.id, otherUser.id],
      });

      await chatChannel.watch();

      setChatClient(client);
      setChannel(chatChannel);
      setLoading(false);
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, otherUser.id]);

  const handleUnmatch = async () => {
    setShowUnmatchModal(false);
  };

  if (loading || !chatClient || !channel) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark text-light">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <div className="p-4 border-b border-light/10 bg-dark/80 flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-light/10 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="text-primary font-semibold">{otherUser.name}</h2>
                <p className="text-xs text-light/60">Chatting now</p>
              </div>
              <button
                    onClick={() => setShowUnmatchModal(true)}
                    className="p-2 hover:bg-light/10 rounded-full transition-colors"
                  >
                    <Unlink className="w-5 h-5" />
                  </button>
            </div>

            <MessageList />
            <MessageInput focus />
          </Window>
        </Channel>
      </Chat>

      {showUnmatchModal && (
        <div className="fixed inset-0 bg-dark/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-light/5 backdrop-blur-sm rounded-3xl p-6 border border-light/10 max-w-sm mx-4">
            <h2 className="font-serif text-xl text-light mb-2">Unmatch {otherUser.name}?</h2>
            <p className="text-light/70 text-sm mb-6">
              This will end your chat and remove you from each other&apos;s matches.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowUnmatchModal(false)}
                className="flex-1 py-3 bg-light/10 rounded-2xl text-light/70 font-rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUnmatch}
                className="flex-1 py-3 bg-red-500 rounded-2xl text-white font-rounded"
              >
                Unmatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
