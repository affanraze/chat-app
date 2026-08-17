import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, MoreVertical, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import ContactRow from "../components/ContactRow";

export default function HomePage({ contacts, activeId, onSelect, onOpenSettings }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <button
            onClick={onOpenSettings}
            title="Profile settings"
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-transform hover:scale-105"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          >
            A
          </button>
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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              title="More options"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--hover)] transition-colors"
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 w-44 rounded-xl border border-[var(--border)] bg-[var(--elevated)] shadow-xl py-1.5 z-20">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--hover)] transition-colors"
                >
                  <Settings size={16} className="text-[var(--muted)]" />
                  Settings
                </button>
              </div>
            )}
          </div>
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
