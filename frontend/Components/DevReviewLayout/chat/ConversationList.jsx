"use client"
import { getConversationsApi } from "@/services/conversationsApis";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const conversations = [
  { id: 1, name: "Ava Chen", initials: "AC", online: true, lastMessage: "That refactor looks clean, nice work!", time: "2m", unread: 2 },
  { id: 2, name: "Marcus Lee", initials: "ML", online: false, lastMessage: "Can you review my PR when you get a chance?", time: "18m", unread: 0 },
  { id: 3, name: "Priya Sharma", initials: "PS", online: true, lastMessage: "Thanks for the feedback on the API design.", time: "1h", unread: 0 },
];

export default function ConversationList() {
  const router = useRouter();

  useEffect(() => {
    getConversations();
  } , [])

  const getConversations = async() => {
    try {
      const res = await getConversationsApi();
      console.log(res);
    } catch (error) {
      
    }
  }

  return (
    <div className="hidden md:flex flex-col h-full w-80 lg:w-96 shrink-0 border-r border-line bg-surface">
      <div className="p-4 border-b border-line">
        <h1 className="text-lg font-extrabold text-ink">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => router.push(`/messages/${conversation.id}`)}
            className="w-full flex items-center gap-3 px-4 py-3 border-b border-line/60 cursor-pointer hover:bg-surface-2"
          >
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-sm font-extrabold text-accent">
                {conversation.initials}
              </div>
              {conversation.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-ok ring-2 ring-surface" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink truncate">{conversation.name}</p>
                <span className="text-[11px] text-muted shrink-0">{conversation.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <p className="text-xs text-muted truncate">{conversation.lastMessage}</p>
                {conversation.unread > 0 && (
                  <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-accent text-accent-ink text-[10px] font-extrabold flex items-center justify-center">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
