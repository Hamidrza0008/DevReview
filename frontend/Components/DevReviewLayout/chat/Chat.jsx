"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  sendMessageApi,
  getMessagesApi,
  getConversationsApi,
  getUserByIdApi,
  markConversationAsReadApi,
} from "@/services/conversationsApis";

const PAGE_SIZE = 20;

export default function Chat({ receiverId, conversationId }) {
  const router = useRouter();
  const { user: authUser } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const topSentinelRef = useRef(null);
  const isLoadingMoreRef = useRef(false);
  const preserveScrollRef = useRef(false);

  const scrollToBottom = useCallback((behavior = "instant") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  useEffect(() => {
    if (!conversationId && !receiverId) return;

    const init = async () => {
      setLoading(true);
      setError(null);
      setHasMore(true);
      setMessages([]);
      isLoadingMoreRef.current = false;

      try {
        if (conversationId) {
          const convRes = await getConversationsApi();
          if (convRes?.success && convRes.data) {
            const conv = convRes.data.find((c) => c._id === conversationId);
            if (conv) {
              const other = conv.participants.find(
                (p) => p._id !== authUser?._id
              );
              if (other) setReceiver(other);
            }
          }

          const msgRes = await getMessagesApi(conversationId, { limit: PAGE_SIZE });
          if (msgRes?.success && msgRes.data) {
            setMessages(msgRes.data.messages);
            setHasMore(msgRes.data.hasMore);
          }

          await markConversationAsReadApi(conversationId);
        } else if (receiverId) {
          const userRes = await getUserByIdApi(receiverId);
          if (userRes?.success && userRes.data) {
            setReceiver(userRes.data);
          }
        }
      } catch {
        setError("Failed to load chat.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [conversationId, receiverId, authUser?._id]);

  useEffect(() => {
    if (loading) return;

    if (preserveScrollRef.current) {
      preserveScrollRef.current = false;
      return;
    }

    if (isNearBottom) {
      scrollToBottom("instant");
    }
  }, [messages, loading, isNearBottom, scrollToBottom]);

  useEffect(() => {
    if (loading || !conversationId) return;

    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceFromBottom < 100);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [loading, conversationId]);

  const loadOlderMessages = useCallback(async () => {
    if (isLoadingMoreRef.current || !hasMore || !conversationId) return;

    isLoadingMoreRef.current = true;
    setLoadingMore(true);

    const oldestMessage = messages[0];
    const cursor = oldestMessage?._id;

    try {
      const res = await getMessagesApi(conversationId, {
        limit: PAGE_SIZE,
        before: cursor,
      });

      if (res?.success && res.data) {
        const { messages: olderMessages, hasMore: more } = res.data;

        if (olderMessages.length > 0) {
          preserveScrollRef.current = true;

          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m._id));
            const newMessages = olderMessages.filter((m) => !existingIds.has(m._id));

            if (newMessages.length === 0) return prev;

            const container = containerRef.current;
            const previousScrollHeight = container?.scrollHeight ?? 0;

            requestAnimationFrame(() => {
              if (container) {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop += newScrollHeight - previousScrollHeight;
              }
            });

            return [...newMessages, ...prev];
          });
        }

        setHasMore(more);
      }
    } catch {
      setError("Failed to load older messages.");
    } finally {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [conversationId, messages, hasMore]);

  useEffect(() => {
    if (loading || !conversationId || !hasMore) return;

    const sentinel = topSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingMoreRef.current && hasMore) {
          loadOlderMessages();
        }
      },
      { root: containerRef.current, threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loading, conversationId, hasMore, loadOlderMessages]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const targetReceiverId = receiverId || receiver?._id;
      const res = await sendMessageApi(targetReceiverId, trimmed);

      if (res?.success && res.data) {
        const newMessage = {
          _id: res.data.message._id,
          conversationId: res.data.conversationId,
          sender: {
            _id: authUser._id,
            name: authUser.name,
            username: authUser.username,
            profileImage: authUser.profileImage,
          },
          text: trimmed,
          isRead: false,
          createdAt: res.data.message.createdAt,
          updatedAt: res.data.message.updatedAt,
        };

        setMessages((prev) => [...prev, newMessage]);
        setText("");

        if (!conversationId && res.data.conversationId) {
          router.replace(`/messages/${res.data.conversationId}`);
        }
      } else {
        setError(res?.message || "Failed to send message.");
      }
    } catch {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full flex-1 min-w-0">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
          <div className="w-10 h-10 rounded-full bg-surface-2 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-surface-2 rounded animate-pulse" />
            <div className="h-3 w-16 bg-surface-2 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col h-full flex-1 min-w-0">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 min-w-0">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
        <button
          type="button"
          onClick={() => receiver?.username && router.push(`/users/${receiver.username}`)}
          className="relative shrink-0 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-accent/15 to-accent-2/15 border border-line flex items-center justify-center text-xs font-extrabold text-accent overflow-hidden">
            {receiver?.profileImage ? (
              <img
                src={receiver.profileImage}
                alt={receiver.name}
                className="w-full h-full object-cover"
              />
            ) : (
              getInitials(receiver?.name)
            )}
          </div>
        </button>
        <button
          type="button"
          onClick={() => receiver?.username && router.push(`/users/${receiver.username}`)}
          className="min-w-0 text-left cursor-pointer"
        >
          <p className="text-sm font-bold text-ink truncate hover:text-accent transition-colors">
            {receiver?.name || "Unknown"}
          </p>
          <p className="text-xs text-muted">
            {receiver?.username ? `@${receiver.username}` : ""}
          </p>
        </button>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        <div ref={topSentinelRef} className="h-1" />

        {loadingMore && (
          <div className="flex justify-center py-2">
            <p className="text-xs text-muted">Loading older messages...</p>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted">
              No messages yet. Say hello!
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isMe = message.sender?._id === authUser?._id;
          return (
            <div
              key={message._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] sm:max-w-[65%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? "bg-accent text-accent-ink rounded-br-sm"
                    : "bg-surface-2 text-ink border border-line rounded-bl-sm"
                }`}
              >
                <p>{message.text}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    isMe ? "text-accent-ink/70" : "text-muted"
                  }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {error && messages.length > 0 && (
        <div className="px-4 py-2 text-xs text-danger bg-danger/5 border-t border-danger/20">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 p-3 border-t border-line">
        <textarea
          ref={textareaRef}
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-page border border-line text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 resize-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !text.trim()}
          className="w-10 h-10 shrink-0 rounded-xl bg-accent text-accent-ink flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
