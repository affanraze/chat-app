import React, { useEffect, useState } from "react";
import HomePage from "./HomePage.jsx";
import ChatPage from "./ChatPage.jsx";
import ProfileSettings from "./ProfileSetting.jsx";
import { socket } from "../sockets/chat.socket.js";
import { fetchConversations, userToContact } from "../utils/conversations.js";

export default function ChatApp() {
  const [activeId, setActiveId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchConversations()
      .then((convos) => mounted && setConversations(convos))
      .catch(console.error);
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const handler = (payload) => {
      if (!payload?.contactId) return;
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === payload.contactId);
        if (idx === -1) return prev;
        const next = [...prev];
        const [item] = next.splice(idx, 1);
        next.unshift({ ...item, last: payload.text, time: "now" });
        return next;
      });
    };
    socket.on("msg", handler);
    return () => socket.off("msg", handler);
  }, []);

  const activeContact =
    conversations.find((c) => c.id === activeId) || selectedUser || null;
  const showMain = activeContact || showProfile;

  const handleSelect = (id, user) => {
    setActiveId(id);
    setSelectedUser(user ? userToContact(user) : null);
  };

  const handleMessageSent = (receiverId, text) => {
    setConversations((prev) => {
      const rest = prev.filter((c) => c.id !== receiverId);
      const existing = prev.find((c) => c.id === receiverId);
      const base =
        existing ||
        selectedUser || {
          id: receiverId,
          name: "New chat",
          avatar: "",
          last: "",
          time: "",
          unread: 0,
          online: false,
          hue: "#8b7fff",
        };
      return [{ ...base, last: text, time: "now" }, ...rest];
    });
  };

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
          contacts={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onOpenSettings={() => setShowProfile(true)}
        />
      </div>

      {/* chat page / profile settings */}
      <div className={`flex-1 ${showMain ? "block" : "hidden md:block"}`}>
        {showProfile ? (
          <ProfileSettings onBack={() => setShowProfile(false)} />
        ) : (
          <ChatPage
            contact={activeContact}
            onBack={() => setActiveId(null)}
            onMessageSent={handleMessageSent}
          />
        )}
      </div>
    </div>
  );
}