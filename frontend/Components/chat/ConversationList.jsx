"use client";

import { useState } from "react";
import { Search, MessageCircle } from "lucide-react";

function getInitials(name = "") {
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

export default function ConversationList({ conversations, selectedId, onSelect, className = "" }) {
  const [query, setQuery] = useState("");

  const filtered = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className={`flex-col h-full bg-surface ${className}`}>
      <div className="p-4 border-b border-line shrink-0">
        <h1 className="text-lg font-extrabold text-ink mb-3">Messages</h1>
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-page border border-line text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">
            <MessageCircle className="w-6 h-6 mx-auto mb-2 text-muted" />
            No conversations found.
          </div>
        ) : (
          filtered.map((conversation) => {
            const isActive = conversation.id === selectedId;
            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-line/60 transition-colors cursor-pointer relative ${
                  isActive ? "bg-accent-soft" : "hover:bg-page"
                }`}
              >
                {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-accent" />}

                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-sm font-extrabold text-accent">
                    {getInitials(conversation.name)}
                  </div>
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-ok ring-2 ring-surface" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${isActive ? "text-accent font-bold" : "text-ink font-semibold"}`}>
                      {conversation.name}
                    </p>
                    <span className="text-[11px] text-muted shrink-0">{conversation.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-muted truncate">{conversation.lastMessage}</p>
                    {conversation.unreadCount > 0 && (
                      <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-accent text-accent-ink text-[10px] font-extrabold flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
