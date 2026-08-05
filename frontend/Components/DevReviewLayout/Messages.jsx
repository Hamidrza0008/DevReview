"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, Send, ArrowLeft, MessageCircle, CheckCheck, Construction } from "lucide-react";

const initialConversations = [
  {
    id: 1,
    name: "Rahul Sharma",
    username: "rahulsharma",
    online: true,
    unreadCount: 2,
    messages: [
      { id: 1, sender: "them", text: "Hey! Just went through your Finance Tracker Dashboard project.", time: "10:12 AM" },
      { id: 2, sender: "them", text: "The revenue chart is really clean, nice work on the animations.", time: "10:12 AM" },
      { id: 3, sender: "me", text: "Thank you so much! Took a while to get the bar transitions smooth 😅", time: "10:15 AM" },
      { id: 4, sender: "them", text: "Haha totally worth it. Mobile responsiveness could use a bit of work though.", time: "10:18 AM" },
    ],
  },
  {
    id: 2,
    name: "Ayesha Khan",
    username: "ayeshak",
    online: true,
    unreadCount: 0,
    messages: [
      { id: 1, sender: "them", text: "Left a review on your API repo, check it out when you get a chance.", time: "Yesterday" },
      { id: 2, sender: "me", text: "On it, thanks Ayesha!", time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Devon Cole",
    username: "devoncole",
    online: false,
    unreadCount: 5,
    messages: [
      { id: 1, sender: "them", text: "Are you still looking for a reviewer on the auth module?", time: "Mon" },
      { id: 2, sender: "them", text: "I have some experience with JWT refresh flows, happy to help.", time: "Mon" },
      { id: 3, sender: "them", text: "Let me know whenever you're free to pair on it.", time: "Mon" },
      { id: 4, sender: "them", text: "No pressure though, just say the word.", time: "Tue" },
      { id: 5, sender: "them", text: "Bumping this in case it got buried 🙂", time: "Tue" },
    ],
  },
  {
    id: 4,
    name: "Priya Nair",
    username: "priyanair",
    online: false,
    unreadCount: 0,
    messages: [
      { id: 1, sender: "me", text: "Your portfolio site looks amazing, especially the case studies section.", time: "Sat" },
      { id: 2, sender: "them", text: "That means a lot, thank you! Feel free to fork the layout if it helps.", time: "Sat" },
      { id: 3, sender: "me", text: "Might just do that 😄", time: "Sat" },
    ],
  },
  {
    id: 5,
    name: "Marcus Lee",
    username: "marcuslee",
    online: true,
    unreadCount: 0,
    messages: [
      { id: 1, sender: "them", text: "Following up on the code review — did the memory leak fix work out?", time: "2d ago" },
      { id: 2, sender: "me", text: "Yep, cleaning up the event listeners on unmount fixed it completely.", time: "2d ago" },
      { id: 3, sender: "them", text: "Nice catch, that's a common one.", time: "2d ago" },
    ],
  },
];

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2F6F4E&color=fff&bold=true`;
}

export default function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  const activeConvo = conversations.find((c) => c.id === activeId) || null;

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeId, activeConvo?.messages.length]);

  const openConversation = (id) => {
    setActiveId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeConvo) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvo.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: c.messages.length + 1, sender: "me", text, time: "Just now" },
              ],
            }
          : c
      )
    );
    setDraft("");
  };

  return (
    <div className="h-[calc(100dvh-3.5rem)] md:h-screen flex flex-col overflow-hidden p-3 md:p-6 w-full text-ink">
      <div className="mb-3 md:mb-4 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-ink">Messages</h1>
        <p className="text-xs md:text-sm text-muted mt-0.5">
          Chat with developers about their projects and your reviews.
        </p>
        <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-star/25 bg-star/10 px-3 py-2 text-xs text-ink">
          <Construction className="h-4 w-4 shrink-0 text-star" />
          <p><strong>Under development:</strong> Chat is currently a dummy UI for preview purposes. Real-time messaging is coming soon.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-3 md:gap-4">
        {/* Conversation list */}
        <div
          className={`bg-surface border border-line rounded-2xl overflow-hidden flex-col min-h-0 ${
            activeConvo ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-3 md:p-4 border-b border-line shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-3 py-2 bg-page border border-line rounded-lg text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
                <MessageCircle className="w-8 h-8 text-muted mb-2" />
                <p className="text-sm font-semibold text-ink">No conversations found</p>
                <p className="text-xs text-muted mt-1">Try a different search term.</p>
              </div>
            ) : (
              filteredConversations.map((c) => {
                const last = c.messages[c.messages.length - 1];
                const isActive = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => openConversation(c.id)}
                    className={`w-full flex items-center gap-3 px-3 md:px-4 py-3 border-b border-line/60 text-left transition-colors cursor-pointer ${
                      isActive ? "bg-accent-soft" : "hover:bg-page"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Image
                        src={avatarUrl(c.name)}
                        alt={c.name}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover border border-line"
                      />
                      {c.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-ok rounded-full ring-2 ring-surface" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-ink truncate">{c.name}</span>
                        <span className="text-[10px] text-muted shrink-0">{last.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate ${c.unreadCount > 0 ? "text-ink font-semibold" : "text-muted"}`}>
                          {last.sender === "me" ? "You: " : ""}
                          {last.text}
                        </p>
                        {c.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-ink text-[10px] font-bold flex items-center justify-center">
                            {c.unreadCount}
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

        {/* Thread panel */}
        <div
          className={`bg-surface border border-line rounded-2xl overflow-hidden flex-col min-h-0 ${
            activeConvo ? "flex" : "hidden lg:flex"
          }`}
        >
          {activeConvo ? (
            <>
              <div className="flex items-center gap-3 px-3 md:px-4 py-3 border-b border-line shrink-0">
                <button
                  onClick={() => setActiveId(null)}
                  className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-muted hover:text-ink hover:bg-page cursor-pointer transition-colors"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="relative shrink-0">
                  <Image
                    src={avatarUrl(activeConvo.name)}
                    alt={activeConvo.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover border border-line"
                  />
                  {activeConvo.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-ok rounded-full ring-2 ring-surface" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink truncate">{activeConvo.name}</p>
                  <p className="text-[11px] text-muted">
                    {activeConvo.online ? "Online" : "Offline"} · @{activeConvo.username}
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 md:px-4 py-4 flex flex-col gap-3">
                {activeConvo.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] flex flex-col gap-1 ${
                      m.sender === "me" ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2 text-sm leading-relaxed ${
                        m.sender === "me"
                          ? "bg-accent text-accent-ink rounded-2xl rounded-br-sm"
                          : "bg-page border border-line text-ink rounded-2xl rounded-bl-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className="flex items-center gap-1 px-1">
                      <span className="text-[10px] text-muted">{m.time}</span>
                      {m.sender === "me" && <CheckCheck className="w-3 h-3 text-accent" />}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="flex items-center gap-2 px-3 md:px-4 py-3 border-t border-line shrink-0">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-page border border-line rounded-full text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-accent text-accent-ink disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm font-bold text-ink">Select a conversation</p>
              <p className="text-xs text-muted mt-1 max-w-[220px]">
                Pick someone from the list to view your message history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
