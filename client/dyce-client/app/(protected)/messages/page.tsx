"use client";

import BottomNavigation from "@/components/BottomNavigation";
import { axiosClient } from "@/lib/axios-client";
import { getStreamClient } from "@/lib/stream";
import { useAuthStore } from "@/stores/auth-store";
import { Match } from "@/types/messages";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Messages = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filterMatches = () => {
    if (!searchQuery) return matches;
    return matches.filter((match) =>
      match.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axiosClient.get("/matches");

        const basicMatches = response.data.matches.map((match: any) => ({
          id: match.user.id,
          name: match.user.name,
          avatar: match.user.profileImages[0].url,
        }));

        const streamClient = getStreamClient();
        const tokenRes = await fetch(
          `/api/chat/token?userId=${currentUser.id}`
        );
        const { token } = await tokenRes.json();

        await streamClient.connectUser(currentUser, token);

        const filters = {
          type: "messaging",
          members: { $in: [currentUser.id] },
        };
        const sort = [{ last_message_at: -1 }];

        const channels = await streamClient.queryChannels(filters, sort, {
          watch: true,
          state: true,
        });

        const enriched = basicMatches.map((match: any) => {
          const channel = channels.find((ch) => {
            const membersArray = Object.values(ch.state.members);
            return membersArray.some((m: any) => m.user?.id === match.id);
          });

          const lastMessage = channel?.state.messages?.at(-1);
          const unread = channel?.countUnread() || 0;

          return {
            ...match,
            lastMessage: channel
              ? lastMessage?.text || "No messages yet"
              : "No chat yet",
            timestamp: lastMessage
              ? new Date(lastMessage.created_at!).toLocaleTimeString()
              : "",
            unread,
          };
        });

        setMatches(enriched);
        setFilteredMatches(enriched);
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast.error("Failed to load matches. Please try again later.");
      } finally {
        setLoadingInbox(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setFilteredMatches(filterMatches());
    }, 300);
    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, matches]);

  return (
    <>
      <div className="h-screen bg-dark text-light flex">
        <div
          className={`w-full transition-all duration-300 overflow-hidden border-r border-light/10 bg-light/5 pb-34`}
        >
          <div className="p-4 border-b border-light/10">
            {/* <h2 className="font-serif text-xl text-primary mb-4">Dyce</h2> */}
            <Image
              src="/dyce-logo.png"
              alt="logo"
              className="object-cover"
              width={100}
              height={80}
            />

            <div className="relative mt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search matches..."
                className="w-full p-3 bg-light/10 border border-light/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-light text-sm"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-full pb-20">
            {loadingInbox ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="animate-spin text-primary h-6 w-6" />
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-light/60">No matches found.</p>
              </div>
            ) : null}
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => router.push(`/messages/${match.id}`)}
                className={`p-4 border-b border-light/5 cursor-pointer transition-colors hover:bg-light/10`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={match.avatar}
                      alt={match.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover overflow-hidden"
                      style={{ width: "48px", height: "48px" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-light truncate">
                        {match.name}
                      </h3>
                    </div>
                    <p className="text-light/60 text-sm truncate">
                      {match.lastMessage}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-light/50 text-xs mb-1">
                      {match.timestamp}
                    </p>
                    {match.unread > 0 && (
                      <div className="bg-primary w-5 h-5 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {match.unread}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    </>
  );
};

export default Messages;
