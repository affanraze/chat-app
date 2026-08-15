import React, { useRef } from "react";
import { ArrowLeft, MoreVertical, Send, Paperclip, Smile } from "lucide-react";
import Avatar from "../components/Avatar";
import MessageBubble from "../components/MessageBubble";
import DUMMY_MESSAGES from "../data/messages.js";
import { sendMessage } from "../sockets";

export default function ChatPage({ contact, onBack }) {
  const formRef = useRef();
  const handleSend = () => {
    const text = formRef.current.value.trim();
    if (!text) return;
    sendMessage({ text, contactId: contact?.id });
    formRef.current.value = "";
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
          initials={contact.initials}
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
      <div className="flex-1 overflow-y-auto py-4">
        {DUMMY_MESSAGES.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
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
