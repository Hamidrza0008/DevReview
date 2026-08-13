"use client";

import { useState } from "react";
import ConversationList from "@/Components/chat/ConversationList";
import Chat from "@/Components/chat/Chat";

const initialConversations = [
  { id: "c1", name: "Ava Chen", online: true, lastMessage: "That refactor looks clean, nice work!", lastMessageTime: "2m", unreadCount: 2 },
  { id: "c2", name: "Marcus Lee", online: false, lastMessage: "Can you review my PR when you get a chance?", lastMessageTime: "18m", unreadCount: 0 },
  { id: "c3", name: "Priya Sharma", online: true, lastMessage: "Thanks for the feedback on the API design.", lastMessageTime: "1h", unreadCount: 0 },
  { id: "c4", name: "Diego Fernandes", online: false, lastMessage: "Let's pair on the auth bug tomorrow.", lastMessageTime: "3h", unreadCount: 1 },
  { id: "c5", name: "Sofia Rossi", online: true, lastMessage: "Pushed the fix, should be good now.", lastMessageTime: "Yesterday", unreadCount: 0 },
  { id: "c6", name: "Noah Kim", online: false, lastMessage: "Great meetup last night!", lastMessageTime: "Mon", unreadCount: 0 },
];

const initialMessages = {
  c1: [
    { id: "m1", sender: "them", text: "Hey! I checked out your latest commit.", time: "09:12 AM" },
    { id: "m2", sender: "them", text: "That refactor looks clean, nice work!", time: "09:13 AM" },
    { id: "m3", sender: "me", text: "Thanks! Took a while to untangle the old state logic.", time: "09:20 AM" },
  ],
  c2: [
    { id: "m1", sender: "them", text: "Can you review my PR when you get a chance?", time: "Yesterday" },
    { id: "m2", sender: "me", text: "Sure, I'll take a look this evening.", time: "Yesterday" },
  ],
  c3: [
    { id: "m1", sender: "me", text: "Left a few comments on the API design doc.", time: "11:02 AM" },
    { id: "m2", sender: "them", text: "Thanks for the feedback on the API design.", time: "11:40 AM" },
  ],
  c4: [
    { id: "m1", sender: "them", text: "That auth bug is still showing up on staging.", time: "Yesterday" },
    { id: "m2", sender: "them", text: "Let's pair on the auth bug tomorrow.", time: "Yesterday" },
  ],
  c5: [
    { id: "m1", sender: "me", text: "Did the deploy go through okay?", time: "Mon" },
    { id: "m2", sender: "them", text: "Pushed the fix, should be good now.", time: "Mon" },
  ],
  c6: [
    { id: "m1", sender: "them", text: "Great meetup last night!", time: "Mon" },
    { id: "m2", sender: "me", text: "Agreed, good turnout. Let's do it again next month.", time: "Mon" },
  ],
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(null);

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId) || null;
  const messages = selectedId ? messagesByConversation[selectedId] || [] : [];

  const handleSelect = (id) => {
    setSelectedId(id);
    setConversations((prev) => prev.map((conversation) => (conversation.id === id ? { ...conversation, unreadCount: 0 } : conversation)));
  };

  const handleSend = (text) => {
    if (!selectedId) return;

    const newMessage = { id: `m${Date.now()}`, sender: "me", text, time: "Just now" };

    setMessagesByConversation((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage],
    }));

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedId ? { ...conversation, lastMessage: text, lastMessageTime: "Just now" } : conversation
      )
    );
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-screen p-4 sm:p-6 lg:p-8">
      <div className="h-full bg-surface border border-line rounded-2xl overflow-hidden flex">
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelect}
          className={`w-full md:w-80 lg:w-96 border-r border-line shrink-0 ${selectedId ? "hidden md:flex" : "flex"}`}
        />
        <Chat
          conversation={selectedConversation}
          messages={messages}
          onSend={handleSend}
          onBack={() => setSelectedId(null)}
          className={`flex-1 min-w-0 ${selectedId ? "flex" : "hidden md:flex"}`}
        />
      </div>
    </div>
  );
}
