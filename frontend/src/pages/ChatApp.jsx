import React, { useState } from "react";
import HomePage from "./HomePage.jsx";
import ChatPage from "./ChatPage.jsx";
import ProfileSettings from "./ProfileSetting.jsx";
import CONTACTS from "../data/contacts.js";

export default function ChatApp() {
  const [activeId, setActiveId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const activeContact = CONTACTS.find((c) => c.id === activeId) || null;
  const showMain = activeContact || showProfile;

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* sidebar / home page */}
      <div
        className={`w-full md:w-[380px] md:shrink-0 border-r border-[var(--border)] ${
          showMain ? "hidden md:block" : "block"
        }`}
      >
        <HomePage
          contacts={CONTACTS}
          activeId={activeId}
          onSelect={setActiveId}
          onOpenSettings={() => setShowProfile(true)}
        />
      </div>

      {/* chat page / profile settings */}
      <div className={`flex-1 ${showMain ? "block" : "hidden md:block"}`}>
        {showProfile ? (
          <ProfileSettings onBack={() => setShowProfile(false)} />
        ) : (
          <ChatPage contact={activeContact} onBack={() => setActiveId(null)} />
        )}
      </div>
    </div>
  );
}
