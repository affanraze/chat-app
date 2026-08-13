import React from "react";

export default function MessageBubble({ msg }) {
  return (
    <div className={`flex ${msg.mine ? "justify-end" : "justify-start"} px-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-3.5 py-2 mb-2 text-[14px] leading-relaxed ${
          msg.mine ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
        style={{
          background: msg.mine ? "var(--accent)" : "var(--elevated)",
          color: msg.mine ? "#0d0e12" : "var(--text)",
          border: msg.mine ? "none" : "1px solid var(--border)",
        }}
      >
        {msg.text}
        <div className={`text-[10px] mt-1 ${msg.mine ? "text-black/50" : "text-[var(--muted)]"}`}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}
