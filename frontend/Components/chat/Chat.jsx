"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageSquareText, Send } from "lucide-react";

function getInitials(name = "") {
  return name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

export default function Chat({ conversation, messages, onSend, onBack, className = "" }) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, conversation?.id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  };

  if (!conversation) {
    return (
      <div className={`flex-col items-center justify-center text-center px-6 h-full ${className}`}>
        <div className="w-14 h-14 rounded-2xl bg-accent-soft text-accent flex items-center justify-center mb-4">
          <MessageSquareText className="w-6 h-6" />
        </div>
        <h2 className="font-bold text-ink">Select a conversation</h2>
        <p className="text-sm text-muted mt-1">Pick someone from the list to view your messages.</p>
      </div>
    );
  }

  return (
    <div className={`flex-col h-full ${className}`}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-1.5 -ml-1.5 rounded-lg text-muted hover:text-ink hover:bg-page cursor-pointer"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-xs font-extrabold text-accent">
            {getInitials(conversation.name)}
          </div>
          {conversation.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-ok ring-2 ring-surface" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-ink truncate">{conversation.name}</p>
          <p className="text-xs text-muted">{conversation.online ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {messages.map((message) => {
          const mine = message.sender === "me";
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] sm:max-w-[65%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  mine
                    ? "bg-accent text-accent-ink rounded-br-sm"
                    : "bg-surface-2 text-ink border border-line rounded-bl-sm"
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-[10px] mt-1 ${mine ? "text-accent-ink/70" : "text-muted"}`}>{message.time}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-line shrink-0">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-page border border-line text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="w-10 h-10 shrink-0 rounded-xl bg-accent text-accent-ink flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
