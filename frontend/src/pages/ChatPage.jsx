import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, MoreVertical, Send, Paperclip, Smile } from "lucide-react";
import Avatar from "../components/Avatar";
import MessageBubble from "../components/MessageBubble";
import api from "../utils/api.js";
import { getSocket, sendMessage } from "../sockets/chat.socket.js";
import { useAuth } from "../context/AuthContext";
import { formatMessageTime } from "../utils/conversations.js";

export default function ChatPage({ contact, onBack, onMessageSent }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const listRef = useRef(null);

  const receiverId = contact?.id;

  useEffect(() => {
    if (!receiverId) return;
    let mounted = true;
    setMessages([]);
    setLoading(true);
    api
      .get(`/api/v1/messages/get-convo/${receiverId}`)
      .then(({ data }) => {
        if (!mounted) return;
        setMessages(
          data.data.map((m) => ({
            id: m.id,
            mine: m.sender_id === user?.id,
            text: m.content,
            time: formatMessageTime(m.created_at),
          })),
        );
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [receiverId, user?.id]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    const s = getSocket();
    const handler = (payload) => {
      if (!payload?.senderId || !payload?.receiverId) return;
      const belongsToConvo =
        payload.senderId === contact?.id || payload.receiverId === contact?.id;
      if (!belongsToConvo) return;

      setMessages((prev) => {
        if (payload.tempId) {
          const idx = prev.findIndex((m) => m.id === payload.tempId);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = {
              id: payload.id,
              mine: payload.senderId === user?.id,
              text: payload.content,
              time: formatMessageTime(payload.createdAt),
            };
            return next;
          }
        }
        if (prev.some((m) => m.id === payload.id)) return prev;
        return [
          ...prev,
          {
            id: payload.id,
            mine: payload.senderId === user?.id,
            text: payload.content,
            time: formatMessageTime(payload.createdAt),
          },
        ];
      });
    };
    s.on("message", handler);
    return () => s.off("message", handler);
  }, [contact?.id, user?.id]);

  const handleSend = () => {
    const text = formRef.current.value.trim();
    if (!text || !contact) return;
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: tempId, mine: true, text, time: "now" },
    ]);
    onMessageSent?.(contact.id, text);
    formRef.current.value = "";
    sendMessage({ receiverId: contact.id, content: text, tempId });
  };

  if (!contact) {
    return (
      <div className="h-full hidden md:flex flex-col items-center justify-center gap-3 bg-[var(--bg)] text-[var(--muted)]">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          <Send size={22} />
        </div>
        <p
          className="text-[14px]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg)]">
      {/* header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--elevated)]">
        <button
          onClick={onBack}
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--hover)]"
        >
          <ArrowLeft size={18} />
        </button>
        <Avatar
          name={contact.name}
          src={contact.avatar}
          hue={contact.hue}
          online={contact.online}
          size={38}
        />
        <div className="min-w-0 flex-1">
          <div
            className="text-[15px] font-medium truncate"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {contact.name}
          </div>
          <div className="text-[12px] text-[var(--muted)]">
            {contact.online ? "online" : "offline"}
          </div>
        </div>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hover)]">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto py-4">
        {loading ? (
          <p className="text-center text-[13px] text-[var(--muted)] mt-8">
            Loading messages...
          </p>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} msg={m} />)
        )}
      </div>

      {/* input */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-[var(--border)] bg-[var(--elevated)]">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--hover)] shrink-0">
          <Smile size={19} />
        </button>
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--hover)] shrink-0">
          <Paperclip size={18} />
        </button>
        <input
          ref={formRef}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2 text-[14px] outline-none placeholder:text-[var(--muted)]"
        />
        <button
          onClick={handleSend}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "var(--accent)", color: "#0d0e12" }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}