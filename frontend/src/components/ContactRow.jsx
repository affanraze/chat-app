import React from "react";
import Avatar from "./Avatar.jsx";

export default function ContactRow({ contact, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[var(--border)]/60 transition-colors ${
        active ? "bg-[var(--accent-soft)]" : "hover:bg-[var(--hover)]"
      }`}
    >
      <Avatar src={contact.avatar} name={contact.name} hue={contact.hue} online={contact.online} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span
            className="truncate text-[15px] font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {contact.name}
          </span>
          <span className="text-[11px] shrink-0 text-[var(--muted)]">{contact.time}</span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="truncate text-[13px] text-[var(--muted)]">{contact.last}</span>
          {contact.unread > 0 && (
            <span
              className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-semibold flex items-center justify-center"
              style={{ background: "var(--accent)", color: "#0d0e12" }}
            >
              {contact.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
