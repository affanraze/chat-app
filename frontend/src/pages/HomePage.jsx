import React, { useMemo, useState } from "react";
import { Search, MoreVertical, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import ContactRow from "../components/ContactRow";

export default function HomePage({ contacts, activeId, onSelect }) {
  const [query, setQuery] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const filtered = useMemo(
    () => 
      contacts.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [contacts, query],
  );

  return (
    <div className="h-full flex flex-col bg-[var(--elevated)]">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            A
          </div>
          <h1
            
            className="text-[17px] font-semibold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Chats
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            title="Log out"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-red-400 hover:bg-[var(--hover)] transition-colors"
          >
            <LogOut size={18} />
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      {/* search */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[var(--bg)] border border-[var(--border)]">
          <Search size={16} className="text-[var(--muted)] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or start a new chat"
            className="w-full bg-transparent outline-none text-[14px] placeholder:text-[var(--muted)]"
          />
        </div>
      </div>

      {/* contact list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-[13px] text-[var(--muted)] mt-8">
            No chats found
          </p>
        ) : (
          filtered.map((c) => (
            <ContactRow
              key={c.id}
              contact={c}
              active={c.id === activeId}
              onClick={() => onSelect(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
