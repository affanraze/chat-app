import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MoreVertical,
  LogOut,
  Settings,
  UserPlus,
  Loader2,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import ContactRow from "../components/ContactRow";
import Avatar from "../components/Avatar";

export default function HomePage({
  contacts,
  activeId,
  onSelect,
  onOpenSettings,
}) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [searchedUser, setSearchedUser] = useState(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const menuRef = useRef(null);
  const addUserRef = useRef(null);
  const searchTimer = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { user, findUser } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (addUserRef.current && !addUserRef.current.contains(e.target)) {
        setAddUserOpen(false);
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

  const handleUser = (e) => {
    const value = e.target.value;
    clearTimeout(searchTimer.current);
    if (!value.trim()) {
      setSearchedUser(null);
      setSearching(false);
      setNotFound(false);
      return;
    }
    setSearching(true);
    setSearchedUser(null);
    setNotFound(false);
    searchTimer.current = setTimeout(async () => {
      try {
        const user = await findUser(value.trim());
        setSearchedUser(user);
        setNotFound(false);
      } catch {
        setSearchedUser(null);
        setNotFound(true);
      } finally {
        setSearching(false);
      }
    }, 1000);
  };

  const addUserInContact = () => {
    setAddUserOpen(false);
    onSelect(searchedUser.id, searchedUser);
  };

  return (
    <div className="relative h-full flex flex-col bg-[var(--elevated)]">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <img
            src={user?.avatar}
            onClick={onOpenSettings}
            title="Profile settings"
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-transform hover:scale-105 object-cover"
            style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
          ></img>

          <h1
            className="text-[17px] font-semibold tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Chats
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
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
                    setAddUserOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-[var(--text)] hover:bg-[var(--hover)] transition-colors"
                >
                  <UserPlus size={16} className="text-[var(--muted)]" />
                  Add user
                </button>
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
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-400 hover:bg-[var(--hover)] transition-colors"
                >
                  <LogOut size={16} />
                  Log out
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

      {/* add user popup */}
      {addUserOpen && (
        <div
          className="absolute right-4 top-20 w-64 rounded-xl border border-[var(--border)] bg-[var(--elevated)] shadow-xl p-3 z-30"
          ref={addUserRef}
        >
          <p
            className="text-[13px] font-medium mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Add user
          </p>
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-[var(--bg)] border border-[var(--border)]">
            <Search size={15} className="text-[var(--muted)] shrink-0" />
            <input
              onChange={handleUser}
              placeholder="Search by username"
              className="w-full bg-transparent outline-none text-[13px] placeholder:text-[var(--muted)]"
            />
          </div>

          {searching && (
            <div className="flex items-center gap-2.5 mt-3 px-1">
              <Loader2
                size={15}
                className="animate-spin text-[var(--muted)] shrink-0"
              />
              <span className="text-[13px] text-[var(--muted)]">
                Searching...
              </span>
            </div>
          )}

          {!searching && notFound && (
            <p className="text-center text-[13px] text-[var(--muted)] mt-4">
              No user found
            </p>
          )}

          {!searching && searchedUser && (
            <div className="flex items-center gap-3 mt-3 p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <Avatar
                src={searchedUser.avatar}
                name={searchedUser.username}
                size={36}
              />
              <span
                className="min-w-0 flex-1 truncate text-[13px] font-medium"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {searchedUser.username}
              </span>
              <button
                onClick={() => addUserInContact(searchedUser)}
                title="Add user"
                className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      )}

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
