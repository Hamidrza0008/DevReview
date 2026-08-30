"use client";

import { getConversationsApi } from "@/services/conversationsApis";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ConversationList() {
  const router = useRouter();
  const pathname = usePathname();
  const { user: authUser } = useAuth();

  const [conversations, setConversations] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchConversations = async () => {
      try {
        const res = await getConversationsApi();
        if (!cancelled && res?.success && res.data) {
          setConversations(res.data);
        }
      } catch {
        // silent
      }
    };
    fetchConversations();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (conversations === null) return;
    let cancelled = false;
    const refetch = async () => {
      try {
        const res = await getConversationsApi();
        if (!cancelled && res?.success && res.data) {
          setConversations(res.data);
        }
      } catch {
        // silent
      }
    };
    refetch();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const getOtherParticipant = (conversation) => {
    if (!authUser) return null;
    return conversation.participants?.find((p) => p._id !== authUser._id);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "now";
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHr < 24) return `${diffHr}h`;
    if (diffDay < 7) return `${diffDay}d`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const loaded = conversations !== null;
  const list = conversations || [];

  return (
    <div className="hidden md:flex flex-col h-full w-80 lg:w-96 shrink-0 border-r border-line bg-surface">
      <div className="p-4 border-b border-line">
        <h1 className="text-lg font-extrabold text-ink">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loaded && list.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted">No conversations yet.</p>
          </div>
        )}

        {list.map((conversation) => {
          const other = getOtherParticipant(conversation);
          return (
            <div
              key={conversation._id}
              onClick={() => router.push(`/messages/${conversation._id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b border-line/60 cursor-pointer hover:bg-surface-2"
            >
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-sm font-extrabold text-accent overflow-hidden">
                  {other?.profileImage ? (
                    <img
                      src={other.profileImage}
                      alt={other.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(other?.name)
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink truncate">
                    {other?.name || "Unknown"}
                  </p>
                  <span className="text-[11px] text-muted shrink-0">
                    {formatTime(conversation.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-muted truncate">
                    {conversation.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
