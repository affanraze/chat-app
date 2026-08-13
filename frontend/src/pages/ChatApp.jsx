import React, { useState } from "react";
import HomePage from "./HomePage.jsx";
import ChatPage from "./ChatPage.jsx";
import CONTACTS from "../data/contacts.js";

export default function ChatApp() {
  const [activeId, setActiveId] = useState(null);
  const activeContact = CONTACTS.find((c) => c.id === activeId) || null;

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* sidebar / home page */}
      <div
        className={`w-full md:w-[380px] md:shrink-0 border-r border-[var(--border)] ${
          activeContact ? "hidden md:block" : "block"
        }`}
      >
        <HomePage contacts={CONTACTS} activeId={activeId} onSelect={setActiveId} />
      </div>

      {/* chat page */}
      <div className={`flex-1 ${activeContact ? "block" : "hidden md:block"}`}>
        <ChatPage contact={activeContact} onBack={() => setActiveId(null)} />
      </div>
    </div>
  );
}
